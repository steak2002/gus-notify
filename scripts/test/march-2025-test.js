const EventChecker = require('../../src/eventChecker');
const axios = require('axios');

async function testMarch2025() {
  console.log('🧪 Testing March 25, 2025 (known to have gus events)...');
  
  try {
    // Use the exact date range from your original example that had gus events
    const url = 'https://www.vinterbadbryggen.com/api/activity/event/days?eventsToShow=300&fromOffset=2025-03-24T00:00:00.000Z&toTime=2025-03-26T21:59:59.999Z';
    
    console.log(`Fetching from: ${url}`);
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'GusNotifier/1.0' }
    });
    
    console.log(`\n📊 API Response status: ${response.status}`);
    console.log(`📈 Days returned: ${Array.isArray(response.data) ? response.data.length : 'Not an array'}`);
    
    if (response.data && Array.isArray(response.data)) {
      let totalEvents = 0;
      const gusEvents = [];
      
      response.data.forEach(day => {
        console.log(`\n📅 ${day.date}:`);
        if (day.slots && Array.isArray(day.slots)) {
          totalEvents += day.slots.length;
          console.log(`   Total events: ${day.slots.length}`);
          
          day.slots.forEach(event => {
            const name = (event.name || '').toLowerCase();
            const location = (event.locationName || '').toLowerCase();
            const isGus = name.includes('gus') || location.includes('gus');
            
            if (isGus) {
              gusEvents.push({
                ...event,
                date: day.date
              });
            }
            
            console.log(`   ${isGus ? '🔥' : '  '} "${event.name}" at ${event.locationName} (${event.status})`);
          });
        }
      });
      
      console.log(`\n🎯 Total events: ${totalEvents}`);
      console.log(`🔥 Gus events found: ${gusEvents.length}`);
      
      if (gusEvents.length > 0) {
        console.log('\n🎉 Now testing local notifier with these events...');
        
        // Now test our local notifier with this historical data
        const LocalGusNotifier = require('../local-test');
        const notifier = new LocalGusNotifier();
        
        // Simulate finding these events
        console.log('\n📧 Email preview for March 2025 events:');
        notifier.previewEmail(gusEvents);
        
        return gusEvents;
      }
      
    } else {
      console.log('❌ Unexpected response format');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testMarch2025();
