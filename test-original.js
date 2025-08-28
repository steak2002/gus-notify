const axios = require('axios');

async function testOriginalExample() {
  console.log('🧪 Testing with the original date range from your example...');
  
  try {
    // Use the exact URL from your example
    const url = 'https://www.vinterbadbryggen.com/api/activity/event/days?eventsToShow=300&fromOffset=2025-03-24T00:00:00.000Z&toTime=2025-03-25T21:59:59.999Z';
    
    console.log(`Fetching from: ${url}`);
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'GusNotifier/1.0' }
    });
    
    console.log(`\n📊 API Response status: ${response.status}`);
    console.log(`📈 Days returned: ${Array.isArray(response.data) ? response.data.length : 'Not an array'}`);
    
    if (response.data && Array.isArray(response.data)) {
      let totalEvents = 0;
      let gusEvents = 0;
      
      response.data.forEach(day => {
        console.log(`\n📅 ${day.date}:`);
        if (day.slots && Array.isArray(day.slots)) {
          totalEvents += day.slots.length;
          console.log(`   Events: ${day.slots.length}`);
          
          day.slots.forEach(event => {
            const name = (event.name || '').toLowerCase();
            const location = (event.locationName || '').toLowerCase();
            const isGus = name.includes('gus') || location.includes('gus');
            
            if (isGus) gusEvents++;
            
            console.log(`   ${isGus ? '🔥' : '  '} "${event.name}" at ${event.locationName} (${event.status})`);
          });
        }
      });
      
      console.log(`\n🎯 Total events: ${totalEvents}`);
      console.log(`🔥 Gus events: ${gusEvents}`);
      
    } else {
      console.log('❌ Unexpected response format');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testOriginalExample();
