# 🔥 Gus Event Notifier Setup Guide

## Step 1: Repository Setup

1. **Initialize git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Gus event notifier"
   ```

2. **Create GitHub repository**:
   - Go to GitHub and create a new repository named `gus-notify`
   - Push your local code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/gus-notify.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Gmail Configuration

### Enable App Passwords for Gmail

1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Go to **Security** → **App passwords**
4. Generate a new app password for "Gus Notifier"
5. **Save this password** - you'll need it for GitHub secrets

## Step 3: GitHub Repository Secrets

In your GitHub repository, go to **Settings** → **Secrets and variables** → **Actions**, then add these secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `GMAIL_USER` | Your Gmail address | `your-email@gmail.com` |
| `GMAIL_APP_PASSWORD` | The app password from step 2 | `abcd efgh ijkl mnop` |
| `NOTIFICATION_EMAIL` | Where to send notifications | `your-email@gmail.com` |

## Step 4: Test the Setup

### Local Testing (Optional)

1. Copy environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your values:
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-app-password
   NOTIFICATION_EMAIL=your-email@gmail.com
   ```

3. Test locally:
   ```bash
   npm run check-events
   ```

### GitHub Actions Testing

1. Go to your repository → **Actions** tab
2. Find "Check Gus Events" workflow
3. Click **Run workflow** to test manually
4. Check the logs to ensure it runs without errors

## Step 5: Customize Settings

### Change Check Frequency

Edit `.github/workflows/check-events.yml` and modify the cron schedule:

```yaml
schedule:
  # Every hour
  - cron: '0 * * * *'
  
  # Every 30 minutes
  - cron: '*/30 * * * *'
  
  # Every day at 9 AM
  - cron: '0 9 * * *'
```

### Adjust Date Range

Edit `src/eventChecker.js` to change how far ahead to look for events:

```javascript
// Look 30 days ahead (default)
const toDate = addDays(fromDate, 30);

// Look 60 days ahead
const toDate = addDays(fromDate, 60);
```

## How It Works

1. **GitHub Actions runs the workflow** every hour (or your chosen schedule)
2. **Fetches events** from the vinterbadbryggen.com API
3. **Filters for gus events** (events containing "gus" in name or location)
4. **Compares with previous events** stored in `last_events.json`
5. **Sends email notifications** for any new events found
6. **Updates the events file** to prevent duplicate notifications

## Troubleshooting

### Common Issues

1. **No emails received**:
   - Check your GitHub repository secrets
   - Verify Gmail app password is correct
   - Check GitHub Actions logs for errors

2. **Workflow not running**:
   - Ensure the repository is public or you have GitHub Actions minutes
   - Check the Actions tab for error messages

3. **API errors**:
   - The sauna club website might be down
   - API endpoint might have changed

### Debug Logs

Check the GitHub Actions logs:
1. Go to **Actions** tab
2. Click on a workflow run
3. Expand the "Check for new gus events" step

## Security Notes

- Never commit your `.env` file to git
- Use GitHub repository secrets for sensitive data
- App passwords are specific to applications and can be revoked if needed

## Support

If you encounter issues:
1. Check the GitHub Actions logs
2. Verify your Gmail configuration
3. Test the API endpoint manually with `node test-api.js`
