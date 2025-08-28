const axios = require('axios');
const { addDays, format } = require('date-fns');

async function inspectAPI() {
  console.log('🔍 Inspecting the sauna club API...');
  
  try {
    const fromDate = new Date();
    const toDate = addDays(fromDate, 30);
    
    const fromOffset = format(fromDate, "yyyy-MM-dd'T'00:00:00.000'Z'");
    const toTime = format(toDate, "yyyy-MM-dd'T'21:59:59.999'Z'");
    
    const url = `https://www.vinterbadbryggen.com/api/activity/event/days?eventsToShow=300&fromOffset=${fromOffset}&toTime=${toTime}`;
    
    console.log(`Fetching from: ${url}`);
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'GusNotifier/1.0' }
    });
    
    console.log(`\n📊 API Response status: ${response.status}`);
    console.log(`📦 Response data type: ${typeof response.data}`);
    console.log(`📈 Days returned: ${Array.isArray(response.data) ? response.data.length : 'Not an array'}`);
    
    if (response.data && Array.isArray(response.data)) {
      let totalEvents = 0;
      
      response.data.forEach((day, dayIndex) => {
        if (day.slots && Array.isArray(day.slots)) {
          totalEvents += day.slots.length;
          
          if (dayIndex < 3 && day.slots.length > 0) { // Show first few days with events
            console.log(`\n📅 ${day.date} - ${day.slots.length} events:`);
            day.slots.forEach((event, eventIndex) => {
              if (eventIndex < 2) { // Show first 2 events per day
                console.log(`   ${eventIndex + 1}. "${event.name}" at ${event.locationName || 'Unknown location'}`);
              }
            });
          }
        }
      });
      
      console.log(`\n🎯 Total events found: ${totalEvents}`);
      
      // Check for any events containing "gus" (case insensitive)
      const allEvents = [];
      response.data.forEach(day => {
        if (day.slots) {
          day.slots.forEach(event => {
            const name = (event.name || '').toLowerCase();
            const location = (event.locationName || '').toLowerCase();
            
            allEvents.push({
              name: event.name,
              location: event.locationName,
              isGus: name.includes('gus') || location.includes('gus')
            });
          });
        }
      });
      
      const gusEvents = allEvents.filter(e => e.isGus);
      console.log(`🔥 Gus events found: ${gusEvents.length}`);
      
      if (gusEvents.length > 0) {
        console.log('🎉 Gus events:');
        gusEvents.forEach(event => {
          console.log(`   - ${event.name} at ${event.location}`);
        });
      }
      
      // Show sample of all event names to see patterns
      if (allEvents.length > 0) {
        console.log('\n📋 Sample event names:');
        allEvents.slice(0, 10).forEach((event, index) => {
          console.log(`   ${index + 1}. "${event.name}" at ${event.location}`);
        });
      }
      
    } else {
      console.log('❌ Unexpected response format');
      console.log(JSON.stringify(response.data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Headers:`, error.response.headers);
    }
  }
}

inspectAPI();
