const EventChecker = require('../src/eventChecker');
const EmailNotifier = require('../src/emailNotifier');
const fs = require('fs').promises;
const path = require('path');

class LocalGusNotifier {
  constructor() {
    this.eventChecker = new EventChecker();
    this.emailNotifier = new EmailNotifier();
    // Use a separate file for local testing
    this.lastEventsFile = path.join(__dirname, '..', 'data', 'local_last_events.json');
  }

  async loadLastEvents() {
    try {
      const data = await fs.readFile(this.lastEventsFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.log('No local events file found, starting fresh');
      return [];
    }
  }

  async saveLastEvents(events) {
    const eventIds = events.map(event => event.entityId);
    await fs.writeFile(this.lastEventsFile, JSON.stringify(eventIds, null, 2));
  }

  async run(options = {}) {
    try {
      console.log('🔍 [LOCAL TEST] Checking for new gus events...');
      
      // Get current events (optionally with longer date range for testing)
      const daysAhead = options.daysAhead || 30;
      const currentEvents = await this.eventChecker.getGusEvents(daysAhead);
      console.log(`Found ${currentEvents.length} current gus events`);
      
      // Load previously seen events (from local file)
      const lastEventIds = await this.loadLastEvents();
      
      // Find new events
      const newEvents = currentEvents.filter(event => 
        !lastEventIds.includes(event.entityId)
      );
      
      if (newEvents.length > 0) {
        console.log(`🎉 Found ${newEvents.length} new events!`);
        
        // Show what we would send (but don't actually send unless specified)
        if (options.sendEmail) {
          console.log('📧 Sending actual email notification...');
          await this.emailNotifier.sendNotification(newEvents);
        } else {
          console.log('📧 Email preview (use --send-email to actually send):');
          this.previewEmail(newEvents);
        }
        
        // Update local events file
        await this.saveLastEvents(currentEvents);
        console.log('✅ Local events file updated');
        
      } else {
        console.log('ℹ️ No new events found');
        
        // Create/update the local file even if no events found
        // This helps with understanding the local testing state
        await this.saveLastEvents(currentEvents);
        console.log('✅ Local events file updated (empty state)');
      }
      
    } catch (error) {
      console.error('❌ Error running local test:', error);
      process.exit(1);
    }
  }

  previewEmail(events) {
    console.log('\n📋 Email Preview:');
    console.log(`Subject: 🔥 ${events.length} new gus event${events.length > 1 ? 's' : ''} available!`);
    console.log('\nEvents:');
    
    events.forEach((event, index) => {
      console.log(`\n${index + 1}. ${event.name}`);
      console.log(`   📍 ${event.locationName}`);
      console.log(`   📅 ${event.startTimeUtc}`);
      console.log(`   👥 ${event.booked}/${event.maxAttendees} booked`);
      console.log(`   🎯 Status: ${event.status}`);
    });
  }

  async reset() {
    try {
      await fs.unlink(this.lastEventsFile);
      console.log('✅ Local events file reset');
    } catch (error) {
      console.log('ℹ️ No local events file to reset');
    }
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  const notifier = new LocalGusNotifier();
  
  const options = {
    sendEmail: args.includes('--send-email'),
    daysAhead: 30
  };
  
  // Check for days ahead parameter
  const daysIndex = args.indexOf('--days');
  if (daysIndex !== -1 && args[daysIndex + 1]) {
    options.daysAhead = parseInt(args[daysIndex + 1]);
  }
  
  if (args.includes('--reset')) {
    await notifier.reset();
    return;
  }
  
  await notifier.run(options);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = LocalGusNotifier;
