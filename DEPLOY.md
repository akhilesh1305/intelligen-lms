# Deploy IntelliGen LMS to Railway (Public Production)

This guide walks you through putting your LMS on the internet with **Railway** + **PostgreSQL**.

## One-command deploy (fastest)

From the project folder in PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/deploy-railway.ps1
```

This will:
1. Install Railway CLI (if needed)
2. Open browser for Railway login
3. Create project + PostgreSQL
4. Set environment variables
5. Deploy and generate a public URL

**You only need to sign in to Railway when the browser opens.**

---

## Manual deploy

## Prerequisites

- A [GitHub](https://github.com) account
- A [Railway](https://railway.app) account (free tier works to start)
- Your project pushed to a GitHub repository

## Step 1 — Push code to GitHub

```bash
git init
git add .
git commit -m "Prepare for production deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/intelligen-lms.git
git push -u origin main
```

## Step 2 — Create Railway project

1. Go to [railway.app](https://railway.app) and sign in with GitHub.
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select your `intelligen-lms` repository.

## Step 3 — Add PostgreSQL

1. In your Railway project, click **+ New** → **Database** → **PostgreSQL**.
2. Click the PostgreSQL service → **Variables** tab.
3. Copy the `DATABASE_URL` value (starts with `postgresql://`).

## Step 4 — Configure the web service

Click your **Next.js app service** (not the database) → **Variables** and add:

| Variable | Value |
|----------|--------|
| `DATABASE_URL` | Paste from PostgreSQL service (use **Reference** to link services) |
| `SESSION_SECRET` | Long random string (32+ chars), e.g. run `openssl rand -base64 32` |
| `NODE_ENV` | `production` |
| `AVATAR_STORAGE` | `database` |

Optional (email & AI):

| Variable | Value |
|----------|--------|
| `SMTP_HOST` | Your SMTP server |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `SMTP_FROM` | `IntelliGen LMS <noreply@yourdomain.com>` |
| `OPENAI_API_KEY` | For AI assistant & quiz generator |

Razorpay (course purchases & subscriptions — India):

| Variable | Value |
|----------|--------|
| `RAZORPAY_KEY_ID` | From [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys) (`rzp_test_` or `rzp_live_`) |
| `RAZORPAY_KEY_SECRET` | Secret key (server only — never expose in client) |
| `RAZORPAY_WEBHOOK_SECRET` | From Webhooks → add `https://your-domain/api/webhooks/razorpay` |
| `NEXT_PUBLIC_APP_URL` | `https://learn.intelligenlms.com` (or your Railway URL) |

**Link `DATABASE_URL`:** In the web service Variables, click **+ New Variable** → **Add Reference** → select PostgreSQL → `DATABASE_URL`.

## Step 5 — Deploy

Railway auto-deploys on push. The first deploy will:

1. Install dependencies
2. Generate Prisma client
3. Build Next.js
4. On start: run `prisma db push` + seed if database is empty
5. Start the server on Railway's public port

## Step 6 — Get your public URL

1. Open your **web service** → **Settings** → **Networking**.
2. Click **Generate Domain**.
3. You'll get a URL like `https://intelligen-lms-production.up.railway.app`.

Share that link — your site is now public.

## Step 7 — Custom domain: `learn.intelligenlms.com`

### A. Buy the domain

Register **intelligenlms.com** at a registrar (Namecheap, Cloudflare, etc.) if you have not already.

### B. Add domain in Railway

1. Open [Railway](https://railway.app/dashboard) → project **intelligen-lms** → service **intelligen-web**.
2. **Settings** → **Networking** → **+ Custom Domain**.
3. Enter: `learn.intelligenlms.com`
4. Railway shows the DNS record(s) to add — keep that page open.

Or via CLI (after `railway login`):

```powershell
railway service link intelligen-web
railway domain learn.intelligenlms.com
```

### C. DNS at your registrar

Add this record where you manage **intelligenlms.com** DNS:

| Type | Host / Name | Value / Target |
|------|-------------|----------------|
| **CNAME** | `learn` | `intelligen-web-production.up.railway.app` |

Use the exact target Railway shows if it differs. TTL: automatic or 300 seconds.

**Cloudflare:** use **DNS only** (grey cloud) until the domain is active, then you can enable the proxy.

### D. Railway environment variable

In **intelligen-web** → **Variables**, add:

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_APP_URL` | `https://learn.intelligenlms.com` |

Redeploy after adding (or push a new deploy). This fixes Open Graph / share preview URLs.

### E. Verify

- Wait 5–30 minutes for DNS (up to 48h in rare cases).
- Railway **Networking** should show `learn.intelligenlms.com` as **Active** with HTTPS.
- Open https://learn.intelligenlms.com — your LMS should load.

The old Railway URL (`intelligen-web-production.up.railway.app`) will still work as a backup.

## Demo accounts (after first seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@intelligen.lms | password123 |
| Instructor | instructor@intelligen.lms | password123 |
| Student | student@intelligen.lms | password123 |

**Change these passwords before sharing widely.**

## Local development with PostgreSQL

```bash
docker compose up -d
```

Copy `.env.example` to `.env`:

```
DATABASE_URL="postgresql://intelligen:intelligen@localhost:5432/intelligen_lms"
SESSION_SECRET="local-dev-secret-change-in-production"
AVATAR_STORAGE="filesystem"
```

Then:

```bash
npm install
npm run db:setup
npm run dev
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails on Prisma | Ensure `DATABASE_URL` is set before build (link PostgreSQL to web service) |
| 500 on login | Check `SESSION_SECRET` is set |
| Empty site / no courses | Redeploy — seed runs automatically when user table is empty |
| Avatars disappear after redeploy | Set `AVATAR_STORAGE=database` (default in production) |

## Security checklist before going live

- [ ] Set a strong `SESSION_SECRET`
- [ ] Change demo account passwords
- [ ] Configure SMTP for real emails
- [ ] Review admin audit logs at `/admin/audit-logs`
