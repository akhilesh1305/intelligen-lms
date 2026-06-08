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

## Step 7 — Custom domain (optional)

1. In **Networking**, click **Custom Domain**.
2. Add your domain (e.g. `learn.yourdomain.com`).
3. Add the CNAME record at your DNS provider as Railway instructs.

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
