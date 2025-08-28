# 🧪 Local Testing Guide

This guide shows you how to test the gus notifier locally without affecting the production `last_events.json` file used by GitHub Actions.

## Quick Start

### 1. Basic Local Test (No Email)
```bash
npm run local-test
```
This will:
- ✅ Check for gus events
- ✅ Show you what events were found
- ✅ Use `local_last_events.json` (separate from production)
- ✅ Preview what the email would look like
- ❌ Won't send actual emails

### 2. Test with Longer Date Range
```bash
node scripts/local-test.js --days 180
```
Look further ahead to find events (useful since there might not be events in the next 30 days).

### 3. Reset Local Testing State
```bash
node scripts/local-test.js --reset
```
Deletes `local_last_events.json` so all events will be considered "new" again.

## Email Testing (Optional)

### Setup for Email Testing
1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your real values:**
   ```bash
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-char-app-password
   NOTIFICATION_EMAIL=where-to-send@gmail.com
   ```

3. **Test with actual email sending:**
   ```bash
   node scripts/local-test.js --send-email
   ```

## Common Testing Scenarios

### Scenario 1: First Time Testing
```bash
# This will find all current gus events and mark them as "seen"
npm run local-test

# Run again - should find no new events
npm run local-test
```

### Scenario 2: Simulate New Events
```bash
# Reset to make all events "new" again
node scripts/local-test.js --reset

# Now run test - will find events as "new"
npm run local-test
```

### Scenario 3: Look for Historical Events
```bash
# Check if there are any events in the next 6 months
node scripts/local-test.js --days 180
```

### Scenario 4: Full Email Test
```bash
# Make sure you have .env set up first
node scripts/local-test.js --reset --send-email
```

## File Structure

- `data/last_events.json` - Used by GitHub Actions (production)
- `data/local_last_events.json` - Used by local testing (gitignored)
- `.env` - Your local secrets (gitignored)
- `.env.example` - Template for secrets (committed)

## Safety Features

1. **Separate tracking files**: Local testing uses `data/local_last_events.json`
2. **Email preview**: Shows email content without sending by default
3. **Gitignored**: Local files won't be committed accidentally
4. **No interference**: Local testing doesn't affect GitHub Actions

## Troubleshooting

### "No events found"
- Try longer date range: `--days 180`
- Check if sauna club has events scheduled
- Test with historical date range that you know has events

### Email errors
- Check your `.env` file has correct values
- Verify Gmail app password is working
- Make sure 2-factor authentication is enabled

### Permission errors
- Make sure you're in the project directory
- Check that `local-test.js` exists

## Example Output

```bash
$ npm run local-test

🔍 [LOCAL TEST] Checking for new gus events...
Fetching events from: https://www.vinterbadbryggen.com/api/activity/event/days?eventsToShow=300&fromOffset=2025-08-28T00:00:00.000Z&toTime=2025-09-27T21:59:59.999Z
Found 0 gus events
Found 0 current gus events
ℹ️ No new events found
```
