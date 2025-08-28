#!/bin/bash

# Quick setup script for Gus Event Notifier

echo "🔥 Setting up Gus Event Notifier..."

# Add all files to git
echo "📁 Adding files to git..."
git add .

# Initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Gus event notifier

- Monitor vinterbadbryggen.com for gus events
- GitHub Actions workflow runs hourly
- Email notifications via Gmail
- Prevents duplicate notifications"

echo "✅ Repository initialized!"
echo ""
echo "Next steps:"
echo "1. Create a GitHub repository at https://github.com/new"
echo "2. Follow the setup guide in SETUP.md"
echo "3. Configure Gmail app password"
echo "4. Add repository secrets"
echo ""
echo "Then push to GitHub:"
echo "git remote add origin https://github.com/YOUR_USERNAME/gus-notify.git"
echo "git branch -M main"
echo "git push -u origin main"
