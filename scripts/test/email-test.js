const LocalGusNotifier = require('../local-test');

async function testEmailWithMockData() {
  console.log('📧 Testing Email Functionality with Mock Data...\n');
  
  // Check if environment variables are set
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD || !process.env.NOTIFICATION_EMAIL) {
    console.log('❌ Email environment variables not set!');
    console.log('Please create a .env file with:');
    console.log('GMAIL_USER=your-email@gmail.com');
    console.log('GMAIL_APP_PASSWORD=your-app-password');
    console.log('NOTIFICATION_EMAIL=where-to-send@gmail.com');
    return;
  }
  
  const notifier = new LocalGusNotifier();
  
  // Reset state first
  console.log('1️⃣ Resetting local state...');
  await notifier.reset();
  
  // Create realistic mock events based on the March 2025 data we know works
  const mockEvents = [
    {
      entityId: "TEST-EMAIL-001",
      name: "Test Mandag aftengus🔥",
      locationName: "Gussaunaen",
      startTimeUtc: "2025-03-24T18:00:00Z",
      endTimeUtc: "2025-03-24T19:30:00Z",
      signUpDeadlineUtc: "2025-03-24T17:30:00Z",
      booked: 16,
      maxAttendees: 18,
      waitingList: 2,
      status: "scheduled",
      description: "<p>This is a test email to verify the gus notification system is working correctly.</p>",
      responsible: [{
        displayName: "Test User",
        firstName: "Test",
        surName: "User"
      }]
    },
    {
      entityId: "TEST-EMAIL-002", 
      name: "Test Tirsdagsgus",
      locationName: "Gussauna",
      startTimeUtc: "2025-03-25T13:00:00Z",
      endTimeUtc: "2025-03-25T14:30:00Z",
      signUpDeadlineUtc: "2025-03-25T12:00:00Z",
      booked: 12,
      maxAttendees: 18,
      waitingList: 0,
      status: "scheduled",
      description: "<p>Another test event to demonstrate multiple events in one notification.</p>",
      responsible: [{
        displayName: "Another Test User",
        firstName: "Another",
        surName: "Test User"
      }]
    }
  ];
  
  console.log('2️⃣ Simulating new events found...');
  console.log(`Found ${mockEvents.length} test events`);
  
  // Show preview first
  console.log('\n📋 Email Preview:');
  notifier.previewEmail(mockEvents);
  
  console.log('\n❓ Do you want to send this test email? (This will send a real email)');
  console.log('If yes, run: node scripts/test/email-test.js --send');
  console.log('If you just ran with --send, sending email now...\n');
  
  // Check if --send flag is passed
  const shouldSend = process.argv.includes('--send');
  
  if (shouldSend) {
    console.log('3️⃣ Sending test email...');
    try {
      await notifier.emailNotifier.sendNotification(mockEvents);
      console.log('✅ Test email sent successfully!');
      console.log('📮 Check your email inbox for the notification.');
      
      // Update local file to prevent duplicate sends
      await notifier.saveLastEvents(mockEvents);
      console.log('✅ Local events file updated');
      
    } catch (error) {
      console.error('❌ Failed to send email:', error.message);
      console.log('\n🔍 Common issues:');
      console.log('- Check your Gmail app password is correct');
      console.log('- Make sure 2-factor authentication is enabled');
      console.log('- Verify GMAIL_USER email address is correct');
    }
  } else {
    console.log('ℹ️ Email preview only (no email sent)');
    console.log('To actually send the test email, run:');
    console.log('node scripts/test/email-test.js --send');
  }
}

// Load environment variables if .env file exists
try {
  require('dotenv').config();
} catch (error) {
  // dotenv not installed, that's OK for production
}

testEmailWithMockData().catch(console.error);
