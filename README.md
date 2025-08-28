# Gus Event Notifier

A GitHub Actions-powered service that monitors sauna club events and sends email notifications when new "gus" events are available.

## 🔥 Features

- 🔄 Automatically checks for new gus events every hour
- 📧 Sends Gmail notifications when new events are found
- 🚫 Avoids duplicate notifications by tracking previously seen events
- ⚙️ Configurable via GitHub repository secrets
- 🧪 Local testing environment separate from production

## 📁 Project Structure

```
├── src/                          # Core application
│   ├── index.js                  # Main application entry point
│   ├── eventChecker.js          # API client for sauna events
│   └── emailNotifier.js         # Email notification handler
├── scripts/                     # Development and utility scripts
│   ├── local-test.js            # Local testing interface
│   ├── test/                    # API and integration testing
│   │   ├── api-test.js          # Basic API connectivity test
│   │   ├── api-inspector.js     # Detailed API response inspector
│   │   ├── march-2025-test.js   # Test with known historical events
│   │   └── original-api-test.js # Test with your original API example
│   ├── demo/                    # Demonstrations and examples
│   │   └── local-demo.js        # Interactive local testing demo
│   ├── setup/                   # Setup and initialization
│   │   └── setup.sh             # Repository initialization script
│   └── README.md                # Scripts documentation
├── data/                        # Data files
│   ├── last_events.json         # Production event tracking (GitHub Actions)
│   └── local_last_events.json   # Local testing event tracking (gitignored)
├── docs/                        # Documentation
│   ├── SETUP.md                 # Setup instructions
│   └── LOCAL_TESTING.md         # Local testing guide
├── .github/workflows/           # GitHub Actions
│   └── check-events.yml        # Hourly event checking workflow
└── local-test.js               # Local testing (separate from production)
```

## 🚀 Quick Start

1. **Clone and setup**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/gus-notify.git
   cd gus-notify
   npm install
   ./scripts/setup/setup.sh  # Optional: initialize git repository
   ```

2. **Local testing**:
   ```bash
   npm run local-test
   ```

3. **Setup for production**: Follow [docs/SETUP.md](docs/SETUP.md)

## 🧪 Testing

### Local Testing
```bash
# Basic test (no emails sent)
npm run local-test

# Test with longer date range
node scripts/local-test.js --days 180

# Reset local state
node scripts/local-test.js --reset

# Test email with mock data (preview only)
node scripts/test/email-test.js

# Test email with mock data (actually send)
node scripts/test/email-test.js --send
```

### API Testing
```bash
# Test API connectivity
node scripts/test/api-test.js

# Test with known historical events
node scripts/test/march-2025-test.js

# Inspect API responses
node scripts/test/api-inspector.js

# Test email functionality (preview only)
node scripts/test/email-test.js

# Test email functionality (actually send)
node scripts/test/email-test.js --send
```

For detailed testing instructions, see [docs/LOCAL_TESTING.md](docs/LOCAL_TESTING.md).

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
npm run local-test
```

## Configuration

- **Check frequency**: Modify the cron schedule in `.github/workflows/check-events.yml`
- **Date range**: Adjust the date range in `src/eventChecker.js`
- **Email template**: Customize the email content in `src/emailNotifier.js`
