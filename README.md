# IntelliGen LMS

A modern learning management platform built with Next.js, Prisma, and Tailwind CSS.

## Features

See **[FEATURES.md](./FEATURES.md)** for the full feature inventory table (updated with every release).

Highlights:

- **Learning** — Courses, quizzes, assignments, certificates, paths, skills, offline downloads
- **AI suite** — Assistant, coach, quiz generator, narration, career tools (OpenAI optional)
- **Games** — Corporate simulations (daily scenarios), quiz challenges, general knowledge games
- **Organizations** — Multi-tenant workspaces, org admin, CSV member import
- **Security** — 2FA, SSO, devices, GDPR, audit logs
- **Commerce** — Pricing, Razorpay payments & subscriptions

## Quick start (local)

```bash
docker compose up -d
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

## Deploy to production (public internet)

See **[DEPLOY.md](./DEPLOY.md)** for step-by-step Railway + PostgreSQL deployment.

## Demo accounts

| Role       | Email                      | Password    |
|------------|----------------------------|-------------|
| Admin      | admin@intelligen.lms       | password123 |
| Instructor | instructor@intelligen.lms  | password123 |
| Student    | student@intelligen.lms     | password123 |

## Key routes

| Route | Description |
|-------|-------------|
| `/dashboard` | Role-based dashboard with analytics & recommendations |
| `/learn/[courseId]` | Learning UI with lessons, quizzes, assignments, progress |
| `/leaderboard` | Points ranking and badges |
| `/admin/approvals` | Admin course approval queue |
| `/courses/[id]/forum` | Course discussion forum |
| `/certificates/[id]` | View and print certificates |

## Tech stack

- Next.js 15, Prisma, PostgreSQL, Tailwind CSS 4
- Recharts (analytics), Nodemailer (email), Zod, Jose + bcryptjs

## Environment variables

```
DATABASE_URL="postgresql://intelligen:intelligen@localhost:5432/intelligen_lms"
SESSION_SECRET="your-secret-key"
PORT=3001
AVATAR_STORAGE="filesystem"

# Optional SMTP for real emails
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="IntelliGen LMS <noreply@intelligen.lms>"
```

Without SMTP, emails are logged to the console in development.
