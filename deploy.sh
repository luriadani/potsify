#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# Potsify — One-shot deploy to GitHub + Netlify
# Run this ONCE after cloning/unzipping the project locally.
# Prerequisites: Node 18+, git, GitHub account, Netlify account
# ─────────────────────────────────────────────────────────────

set -e

REPO_NAME="potsify"
GITHUB_USER=""   # ← fill in your GitHub username

echo ""
echo "🟢 Potsify deploy script"
echo "─────────────────────────"

# ── 1. Spotify credentials ──────────────────────────────────
if [ ! -f .env ]; then
  echo ""
  echo "Step 1: Spotify credentials"
  echo "Go to https://developer.spotify.com/dashboard and create an app."
  echo "Set redirect URI to: https://<your-netlify-subdomain>.netlify.app/callback"
  echo ""
  read -p "Paste your Spotify Client ID: " CLIENT_ID
  read -p "Paste your Netlify site URL (e.g. https://potsify.netlify.app): " SITE_URL

  cat > .env <<EOF
VITE_SPOTIFY_CLIENT_ID=${CLIENT_ID}
VITE_REDIRECT_URI=${SITE_URL}/callback
EOF
  echo "✔ .env created"
fi

# ── 2. Install dependencies ──────────────────────────────────
echo ""
echo "Step 2: Installing dependencies..."
npm install
echo "✔ Dependencies installed"

# ── 3. Build ─────────────────────────────────────────────────
echo ""
echo "Step 3: Building..."
npm run build
echo "✔ Build complete → dist/"

# ── 4. GitHub ────────────────────────────────────────────────
echo ""
echo "Step 4: Pushing to GitHub..."

if [ -z "$GITHUB_USER" ]; then
  read -p "Your GitHub username: " GITHUB_USER
fi

git init -b main
git add .
git commit -m "🟢 init: Potsify — undiscovered Spotify tracks"

# Create repo via GitHub CLI if available, otherwise print instructions
if command -v gh &>/dev/null; then
  gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
  echo "✔ Pushed to https://github.com/$GITHUB_USER/$REPO_NAME"
else
  echo ""
  echo "⚠ GitHub CLI (gh) not found. Create the repo manually:"
  echo "  1. Go to https://github.com/new"
  echo "  2. Name it: $REPO_NAME"
  echo "  3. Run these commands:"
  echo ""
  echo "     git remote add origin https://github.com/$GITHUB_USER/$REPO_NAME.git"
  echo "     git push -u origin main"
fi

# ── 5. Netlify ───────────────────────────────────────────────
echo ""
echo "Step 5: Deploying to Netlify..."

if command -v netlify &>/dev/null; then
  netlify deploy --prod --dir=dist --site-name="$REPO_NAME"
  echo "✔ Live on Netlify!"
else
  echo ""
  echo "⚠ Netlify CLI not found. Deploy manually (30 seconds):"
  echo "  1. Go to https://app.netlify.com/drop"
  echo "  2. Drag & drop the 'dist/' folder onto the page"
  echo "  3. Your site is live instantly!"
  echo ""
  echo "  OR connect GitHub for auto-deploys:"
  echo "  1. Go to https://app.netlify.com → Add new site → Import from Git"
  echo "  2. Connect your GitHub repo: $GITHUB_USER/$REPO_NAME"
  echo "  3. Build command: npm run build"
  echo "  4. Publish directory: dist"
  echo "  5. Add env vars: VITE_SPOTIFY_CLIENT_ID and VITE_REDIRECT_URI"
  echo ""
  echo "  Don't forget to add your Netlify URL to Spotify's redirect URIs!"
fi

echo ""
echo "─────────────────────────"
echo "🟢 Potsify deploy complete"
