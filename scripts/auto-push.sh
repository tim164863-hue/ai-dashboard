#!/bin/bash
# Auto-push to GitHub after each Phase completion

REPO_DIR="/Users/chiayingchu/.openclaw/workspace/ai-dashboard"
GITHUB_REPO="git@github.com:tim164863-hue/ai-dashboard.git"

cd "$REPO_DIR"

# Check if there are changes
if [ -z "$(git status --porcelain)" ]; then
  echo "No changes to commit"
  exit 0
fi

# Get the phase number from the latest commit or environment
PHASE=${1:-"Phase"}
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Stage all changes
git add .

# Commit with phase info
git commit -m "Update: $PHASE - $TIMESTAMP"

# Push to GitHub
git push origin main

echo "✅ Pushed to GitHub: $PHASE"
