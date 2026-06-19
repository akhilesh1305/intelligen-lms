# Project Description

## IntelliGen LMS — AI-Powered Learning Management System

IntelliGen LMS is a full-stack, production-ready learning platform designed for enterprises, training teams, and ed-tech use cases. It unifies course delivery, AI-assisted content creation, learner engagement, verifiable credentials, and analytics in a single deployable application — suitable for live demos, pilots, and portfolio presentations.

The platform serves multiple personas: students track progress and earn certificates; instructors build and manage courses with AI-assisted tooling; administrators monitor platform-wide KPIs and approvals; organization admins operate multi-tenant workspaces with member management and org-scoped analytics.

### Core capabilities

- **Learning** — Course catalog, learning player, quizzes, assignments, forums, learning paths, competency mapping, and offline downloads
- **AI suite** — Course generator, quiz builder, learning assistant, corporate coach, summarization, narration, career tools, and assignment evaluation (OpenAI-integrated when configured)
- **Engagement** — XP, badges, leaderboards, daily quiz challenges, and 20+ corporate and knowledge games
- **Credentials** — Auto-issued certificates with public verification and org-branded templates
- **Analytics** — Enrollment trends, completion rates, quiz activity, and exportable reporting
- **Enterprise** — Multi-tenant organizations, SSO, 2FA, audit logs, GDPR tools, Razorpay commerce, and PWA support

### Technical architecture

Monolithic Next.js 15 application using the App Router, server components, API routes, and middleware for authentication and role-based access. Prisma ORM connects to PostgreSQL. Session auth uses Jose and bcrypt; optional integrations include OpenAI, SMTP, Razorpay, and OAuth providers (Google, Microsoft, Okta).

### Demo and presentation layer

The product includes recruiter- and client-ready surfaces: interactive product tour, visual showcase, demo accounts, screenshot guide, and recording mode — enabling professional walkthroughs without seeding production data manually.

### Deployment

Deployable to Vercel with PostgreSQL (Railway, Neon, Supabase). Documented in `DEPLOY.md` with environment-variable guidance for production.

**Live demo:** https://intelligen-lms.vercel.app
