# Shadow Assistant — Your creator inbox. Under control.

React + Vite + TypeScript dashboard, Vercel serverless API, Gemini for answers, and two Telegram bots
(Bot A = public assistant, Bot B = owner console) sharing one knowledge file.

## Quick start
```bash
npm install
cp .env.example .env.local   # fill in values
npm i -g vercel && vercel dev   # runs frontend + /api on http://localhost:3000
```
Demo login: `demo@shadowassistant.app` / `ShadowDemo123!` (demo account, not real auth).
Without keys the dashboard runs in demo mode and integrations show "Setup required".

## Setup
1. **Gemini**: create a key at https://aistudio.google.com/apikey → `GEMINI_API_KEY`.
2. **Bot A and Bot B**: create two bots with @BotFather → `TELEGRAM_BOT_A_TOKEN`, `TELEGRAM_BOT_B_TOKEN`.
3. Make up `TELEGRAM_BOT_A_WEBHOOK_SECRET`, `TELEGRAM_BOT_B_WEBHOOK_SECRET`, `SETUP_SECRET` (random strings, A-Z a-z 0-9 _ -).
4. Deploy to Vercel (push to GitHub, import repo), add every variable from `.env.example`, set `PUBLIC_BASE_URL=https://your-app.vercel.app`, redeploy.
5. Register webhooks (open in browser):
   `https://your-app.vercel.app/api/telegram/bot-a-setup?secret=SETUP_SECRET`
   `https://your-app.vercel.app/api/telegram/bot-b-setup?secret=SETUP_SECRET`
6. Send `/start` to Bot B → it shows your chat id → set `TELEGRAM_OWNER_CHAT_ID`, redeploy. Only that chat can control Bot B.
7. Check `https://your-app.vercel.app/api/health` — each service shows `true` only after real verification.

Other endpoints: `bot-a-info`, `bot-b-info` (webhook status), `delete-webhook?bot=A|B` (all need the setup secret).

## How answers work
1. Exact keyword (`GUIDE`, `TEMPLATE`, `NOTES`) or direct link request (GitHub, LinkedIn, Portfolio, Resume) → instant reply (`lib/rules.ts`).
2. Otherwise: follow-up resolution → intent detection (`lib/intent.ts`) → section retrieval from `knowledge/creator.md` (`lib/knowledge.ts`) → Gemini (`lib/ai.ts`) with only the relevant sections.
3. Confidence (`lib/confidence.ts`): LOW/UNKNOWN or business inquiries are sent to Bot B with Approve / Reply / Edit / Ignore.

## Creator knowledge
Edit `knowledge/creator.md` (placeholders included) and redeploy. Bot never answers beyond this file.

## Limitations (be honest in your demo)
- Conversation memory, reviews, stats and rate limits are in-memory per serverless instance and reset on cold start. Swap `lib/conversations.ts` for Supabase/Redis for persistence.
- The dashboard Inbox, Auto replies, Keyword table and counters are **sample data** (labelled "Demo data"); only the AI suggestion, health/integration status and contact form hit the real backend.
- Dashboard login is a demo gate only.
- Keyword rules live in `lib/rules.ts`; the dashboard does not edit them yet.
- Instagram, YouTube, Discord and email are not built.

## Roadmap
Database persistence, embeddings/RAG, knowledge editor, real auth, multiple creators, more channels.
