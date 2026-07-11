# Spec Plate — deployable version

A shared, always-on version of the caravan notes tool: real database (Netlify Blobs),
a shared passcode so it's private to your team, and your own Anthropic API key powering
the "Ask" and "Add note" features.

## Deploy to Netlify (one-time setup, ~10 minutes)

1. **Push this folder to a GitHub repo.**
   ```
   cd spec-plate-app
   git init
   git add .
   git commit -m "Initial commit"
   ```
   Create a new empty repo on GitHub, then:
   ```
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **In Netlify:** "Add new site" → "Import an existing project" → pick your repo.
   Netlify will detect `netlify.toml` and use the Next.js plugin automatically.
   Click **Deploy**. It will fail on the first deploy — that's expected, you need to add
   environment variables next.

3. **Add environment variables** (Site configuration → Environment variables):
   - `ANTHROPIC_API_KEY` — from https://console.anthropic.com (Settings → API Keys).
     Note: this is billed by usage on your Anthropic account (typically a few cents
     per question) — separate from any Claude.ai subscription.
   - `TEAM_PASSCODE` — any password you choose. You and your colleagues will type this
     once in the browser to unlock the app.

4. **Enable Netlify Blobs** — no setup needed. It's built into every Netlify site
   automatically; the app will just start using it once deployed.

5. **Redeploy** (Deploys → Trigger deploy) so the new environment variables take effect.

6. Open the site URL Netlify gives you, enter the passcode, and share that same URL +
   passcode with your colleagues.

## Local development (optional)

```
npm install
cp .env.example .env   # fill in ANTHROPIC_API_KEY and TEAM_PASSCODE
npm run dev
```
Note: Netlify Blobs needs a linked Netlify site to work locally — for local dev without
that, notes storage calls will error until you `netlify link` (via the Netlify CLI) or
just develop against the deployed version instead.

## What's different from the Claude.ai artifact version

- Notes are shared across everyone using the app (not per-person) — good for a small team
  working from the same reference.
- Chat history is NOT saved server-side (resets on page reload) — only notes persist.
  Say the word if you'd like chat history saved too.
- The "Ask" and "Add note" AI features now call the Anthropic API directly using your own
  API key, so they incur small per-use costs on your Anthropic account.
- Access is gated by a single shared passcode, not individual logins. Fine for a small
  trusted team; if you later want individual accounts/permissions, that's a bigger change —
  just ask.
