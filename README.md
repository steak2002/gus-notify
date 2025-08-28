# Gus Event Notifier

A GitHub Actions-powered service that monitors sauna club events and sends email notifications when new "gus" events are available.

## Features

- 🔄 Automatically checks for new gus events every hour
- 📧 Sends Gmail notifications when new events are found
- 🚫 Avoids duplicate notifications by tracking previously seen events
- ⚙️ Configurable via GitHub repository secrets

## Setup

1. **Clone this repository**
2. **Configure Gmail App Password** (required for sending emails):
   - Go to your Google Account settings
   - Enable 2-factor authentication if not already enabled
   - Generate an App Password for this application
3. **Set up repository secrets** in GitHub:
   - `GMAIL_USER`: Your Gmail address
   - `GMAIL_APP_PASSWORD`: The app password generated above
   - `NOTIFICATION_EMAIL`: Email address to receive notifications (can be the same as GMAIL_USER)

## How it works

1. The GitHub Action runs every hour (configurable in `.github/workflows/check-events.yml`)
2. It fetches events from the vinterbadbryggen.com API
3. Compares with previously seen events stored in `last_events.json`
4. Sends email notifications for any new events found
5. Updates the stored events list

## Manual Testing

You can manually trigger the workflow from the GitHub Actions tab, or run locally:

```bash
npm install
npm run check-events
```

## Configuration

- **Check frequency**: Modify the cron schedule in `.github/workflows/check-events.yml`
- **Date range**: Adjust the date range in `src/eventChecker.js`
- **Email template**: Customize the email content in `src/emailNotifier.js`
