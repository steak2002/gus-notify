const EventChecker = require('./eventChecker');
const EmailNotifier = require('./emailNotifier');
const fs = require('fs').promises;
const path = require('path');

class GusNotifier {
  constructor() {
    this.eventChecker = new EventChecker();
    this.emailNotifier = new EmailNotifier();
    this.lastEventsFile = path.join(__dirname, '..', 'data', 'last_events.json');
  }

  async loadLastEvents() {
    try {
      const data = await fs.readFile(this.lastEventsFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.log('No previous events file found, starting fresh');
      return [];
    }
  }

  async saveLastEvents(events) {
    const eventIds = events.map(event => event.entityId);
    await fs.writeFile(this.lastEventsFile, JSON.stringify(eventIds, null, 2));
  }

  async run() {
    try {
      console.log('🔍 Checking for new gus events...');
      
      // Get current events
      const currentEvents = await this.eventChecker.getGusEvents();
      console.log(`Found ${currentEvents.length} current gus events`);
      
      // Load previously seen events
      const lastEventIds = await this.loadLastEvents();
      
      // Find new events
      const newEvents = currentEvents.filter(event => 
        !lastEventIds.includes(event.entityId)
      );
      
      if (newEvents.length > 0) {
        console.log(`🎉 Found ${newEvents.length} new events!`);
        
        // Send notification
        await this.emailNotifier.sendNotification(newEvents);
        
        // Update last events
        await this.saveLastEvents(currentEvents);
        
        console.log('✅ Notification sent and events updated');
      } else {
        console.log('ℹ️ No new events found');
      }
      
    } catch (error) {
      console.error('❌ Error running gus notifier:', error);
      process.exit(1);
    }
  }
}

// Run if called directly
if (require.main === module) {
  const notifier = new GusNotifier();
  notifier.run();
}

module.exports = GusNotifier;
