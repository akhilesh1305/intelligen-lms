# IntelliGen LMS

A modern learning management platform built with Next.js, Prisma, and Tailwind CSS.

## Features

- **Course progress tracking** — Lessons, quizzes, and assignments tracked with overall % completion
- **Quiz & assignment module** — Multiple-choice quizzes and text assignments per course
- **Certificate generation** — Auto-issued on course completion with printable certificate page
- **Role-based access control** — Student, Instructor, and Admin roles with protected routes
- **Analytics dashboard** — Charts for enrollments, users, course status, and top courses
- **Course approval workflow** — Instructors submit courses; admins approve or reject
- **Email notifications** — Enrollment, certificates, approvals (console log without SMTP)
- **AI course recommendations** — Personalized suggestions based on learning history
- **Discussion forum** — Per-course threads and replies with notifications
- **Leaderboard & badges** — Points, achievements, and ranked learner leaderboard

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
