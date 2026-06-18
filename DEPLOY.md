# Deploy IntelliGen LMS to Vercel (Public Production)

This guide deploys the **Next.js app on Vercel**. PostgreSQL can stay on Railway (easiest migration) or move to [Vercel Postgres](https://vercel.com/storage/postgres), Neon, or Supabase.

## One-command deploy

From the project folder in PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/deploy-vercel.ps1
```

You will sign in to Vercel when prompted. Set environment variables in the Vercel dashboard before the first production deploy.

---

## Prerequisites

- [GitHub](https://github.com) repository with your code (`main` branch)
- [Vercel](https://vercel.com) account (Hobby tier works to start)
- PostgreSQL `DATABASE_URL` (existing Railway Postgres is fine)

## Step 1 — Import from GitHub (recommended)

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import **akhilesh1305/intelligen-lms** (or your fork).
3. Framework preset: **Next.js** (auto-detected).
4. Build command: `npm run vercel-build` (set in `vercel.json`).
5. Do **not** deploy yet — add environment variables first.

## Step 2 — Environment variables

In Vercel → **Project** → **Settings** → **Environment Variables** (Production):

| Variable | Value |
|----------|--------|
| `DATABASE_URL` | PostgreSQL connection string (see below) |
| `SESSION_SECRET` | Long random string (`openssl rand -base64 32`) |
| `AVATAR_STORAGE` | `database` |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` (update after first deploy) |
| `CRON_SECRET` | Random string for `/api/cron/generate-quizzes` |

Optional: `SMTP_*`, `OPENAI_API_KEY`, `RAZORPAY_*`, SSO keys — same as `.env.example`.

### Keep Railway Postgres (quickest migration)

1. Railway dashboard → **Postgres** service → **Variables** → copy `DATABASE_URL`.
2. Paste into Vercel as `DATABASE_URL`.
3. Ensure the database allows external connections (Railway public URL works).

### Or use Vercel Postgres / Neon

Create a new database, run `npm run db:setup` locally against the new URL once, then use that `DATABASE_URL` in Vercel.

## Step 3 — Deploy

**Git push (auto-deploy after GitHub is connected):**

```bash
git push origin main
```

**Or CLI:**

```powershell
npx vercel@latest deploy --prod
```

Each build runs:

1. `prisma generate`
2. `prisma db push` (schema sync)
3. `next build`

## Step 4 — Production URL

After deploy, Vercel shows a URL like:

`https://intelligen-lms.vercel.app`

Update `NEXT_PUBLIC_APP_URL` to match and redeploy.

## Step 5 — Custom domain (`learn.intelligenlms.com`)

1. Vercel → **Project** → **Settings** → **Domains**.
2. Add `learn.intelligenlms.com`.
3. At your DNS registrar, add the records Vercel shows (usually **CNAME** `learn` → `cname.vercel-dns.com`).
4. Set `NEXT_PUBLIC_APP_URL=https://learn.intelligenlms.com` and redeploy.

## Scheduled quizzes (cron)

`vercel.json` registers a daily cron hitting `/api/cron/generate-quizzes`. Set `CRON_SECRET` in Vercel; the route validates `Authorization: Bearer <CRON_SECRET>`.

> Cron jobs require Vercel **Pro** on team accounts; Hobby includes cron with limits — check [Vercel cron docs](https://vercel.com/docs/cron-jobs).

## Demo accounts (after seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@intelligen.lms | password123 |
| Instructor | instructor@intelligen.lms | password123 |
| Student | student@intelligen.lms | password123 |

Seed locally once against production DB (careful):

```bash
DATABASE_URL="your-production-url" npm run db:seed
```

**Change demo passwords before sharing widely.**

## Local development

```bash
docker compose up -d
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

## Railway → Vercel checklist

- [ ] Copy `DATABASE_URL` from Railway Postgres to Vercel
- [ ] Copy `SESSION_SECRET` and other secrets to Vercel
- [ ] Set `AVATAR_STORAGE=database`
- [ ] Deploy on Vercel and verify login + `/games`
- [ ] Point custom domain DNS to Vercel (not Railway)
- [ ] Update Razorpay webhook URL to Vercel domain
- [ ] (Optional) Pause or delete Railway **web** service to avoid double hosting — **keep Postgres** until you migrate the DB

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails on Prisma | Ensure `DATABASE_URL` is set in Vercel **before** build |
| 500 on login | Check `SESSION_SECRET` |
| Avatars missing | `AVATAR_STORAGE=database` |
| DB connection errors | Use pooled URL or reduce serverless concurrency; try `?sslmode=require` on Postgres URL |
| Cron 401 | Set `CRON_SECRET` in Vercel env |

## Legacy Railway deploy

The previous Railway web deploy used `railway.toml` and `scripts/deploy-railway.ps1`. Those files remain for reference; production hosting is intended to run on Vercel.
