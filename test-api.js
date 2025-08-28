const EventChecker = require('./src/eventChecker');

async function testAPI() {
  console.log('🧪 Testing API endpoint...');
  
  try {
    const checker = new EventChecker();
    
    // Test with different date ranges
    const ranges = [30, 60, 90, 180];
    
    for (const days of ranges) {
      console.log(`\n🔍 Checking next ${days} days...`);
      const events = await checker.getGusEvents(days);
      console.log(`Found ${events.length} gus events`);
      
      if (events.length > 0) {
        console.log('📋 Sample events:');
        events.slice(0, 3).forEach((event, index) => {
          console.log(`   ${index + 1}. ${event.name} - ${event.startTimeUtc} (${event.status})`);
        });
        break; // Stop when we find events
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI();
