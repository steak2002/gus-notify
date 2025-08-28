# Scripts Directory

This directory contains all development tools and utilities.

## 📁 Structure

### `local-test.js` - **Main Local Development Interface**
Primary tool for local testing and development.

### `test/` - API and Integration Testing
- `api-test.js` - Basic API connectivity test
- `api-inspector.js` - Detailed API response inspection
- `march-2025-test.js` - Test with known historical events (March 2025)
- `original-api-test.js` - Test with your original API example
- `email-test.js` - Test email functionality with mock data

### `demo/` - Demonstrations and Examples
- `local-demo.js` - Interactive demonstration of local testing features

### `setup/` - Setup and Initialization
- `setup.sh` - Repository initialization script

## 🚀 Usage

### Primary Local Testing
```bash
# Main local testing command (most common)
npm run local-test

# Direct usage with options
node scripts/local-test.js --days 180
node scripts/local-test.js --reset
node scripts/local-test.js --send-email
```

### Testing Scripts
```bash
# Basic API connectivity
node scripts/test/api-test.js

# Inspect API responses
node scripts/test/api-inspector.js

# Test with known historical events
node scripts/test/march-2025-test.js

# Test with original API example
node scripts/test/original-api-test.js

# Test email functionality (preview only)
node scripts/test/email-test.js

# Test email functionality (actually send email)
node scripts/test/email-test.js --send
```

### Demo Scripts
```bash
# Interactive local testing demonstration
node scripts/demo/local-demo.js
```

### Setup Scripts
```bash
# Initialize repository (if needed)
./scripts/setup/setup.sh
```

## 💡 Tips

- **For regular local testing**: Use `npm run local-test` (in root)
- **For API debugging**: Use scripts in `test/`
- **To understand features**: Run scripts in `demo/`
- **For initial setup**: Use scripts in `setup/`
