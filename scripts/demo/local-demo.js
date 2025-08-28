const LocalGusNotifier = require('../local-test');

async function demonstrateLocalTesting() {
  console.log('🧪 Demonstrating Local Testing with March 2025 events...\n');
  
  const notifier = new LocalGusNotifier();
  
  // First, reset any existing local state
  console.log('1️⃣ Resetting local testing state...');
  await notifier.reset();
  
  // Create some mock events for demonstration
  const mockEvents = [
    {
      entityId: "Activity2518853345471384032-202503241800TG",
      name: "Mandag aftengus🔥",
      locationName: "Gussaunaen",
      startTimeUtc: "2025-03-24T18:00:00Z",
      endTimeUtc: "2025-03-24T19:30:00Z",
      booked: 18,
      maxAttendees: 18,
      status: "booked"
    },
    {
      entityId: "Activity2518853345471384032-202503251300KG",
      name: "Tirsdagsgus",
      locationName: "Gussauna",
      startTimeUtc: "2025-03-25T13:00:00Z",
      endTimeUtc: "2025-03-25T14:30:00Z",
      booked: 15,
      maxAttendees: 18,
      status: "scheduled"
    }
  ];
  
  console.log('\n2️⃣ Simulating first run (finding new events)...');
  
  // Save these as "current events" to create the local file
  await notifier.saveLastEvents(mockEvents);
  console.log('✅ Created local_last_events.json with mock events');
  
  // Show the preview of what would be sent
  console.log('\n📧 Email preview for these events:');
  notifier.previewEmail(mockEvents);
  
  console.log('\n3️⃣ Checking what\'s in the local file...');
  const savedEvents = await notifier.loadLastEvents();
  console.log('📁 Saved event IDs:', savedEvents);
  
  console.log('\n4️⃣ Simulating second run (no new events)...');
  // If we run again with the same events, they should be seen as "already known"
  const newEvents = mockEvents.filter(event => 
    !savedEvents.includes(event.entityId)
  );
  
  if (newEvents.length === 0) {
    console.log('✅ Correctly detected no new events (all events already seen)');
  } else {
    console.log(`❌ Error: Found ${newEvents.length} events that should have been filtered out`);
  }
  
  console.log('\n5️⃣ Simulating new event arrival...');
  const newerEvent = {
    entityId: "Activity2518853345471384032-NEW123",
    name: "Wednesday evening gus🔥",
    locationName: "Gussaunaen",
    startTimeUtc: "2025-03-26T18:00:00Z",
    endTimeUtc: "2025-03-26T19:30:00Z",
    booked: 5,
    maxAttendees: 18,
    status: "scheduled"
  };
  
  const allEvents = [...mockEvents, newerEvent];
  const newEventsFound = allEvents.filter(event => 
    !savedEvents.includes(event.entityId)
  );
  
  console.log(`🎉 Found ${newEventsFound.length} new event(s):`);
  newEventsFound.forEach(event => {
    console.log(`   - ${event.name} at ${event.locationName}`);
  });
  
  console.log('\n6️⃣ Updating local file with new events...');
  await notifier.saveLastEvents(allEvents);
  console.log('✅ Local file updated');
  
  const finalSavedEvents = await notifier.loadLastEvents();
  console.log('📁 Final saved event IDs:', finalSavedEvents);
  
  console.log('\n🎯 Summary:');
  console.log('- data/local_last_events.json is now created and contains event IDs');
  console.log('- This file is separate from the production data/last_events.json');
  console.log('- You can now run "npm run local-test" for real testing');
  console.log('- Use "node local-test.js --reset" to start fresh anytime');
}

demonstrateLocalTesting().catch(console.error);
