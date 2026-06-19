# IntelliGen LMS — ChatGPT Code Review Guide

**Purpose:** Orient an external reviewer to this codebase before reading source files.  
**Stack:** Next.js 15 (App Router), React 19, Prisma 6, PostgreSQL, Tailwind CSS 4, session auth (Jose + bcrypt).  
**Entry points:** `src/app/**` (routes/UI), `src/app/api/**` (REST handlers), `src/lib/**` (domain logic), `prisma/schema.prisma` (data model).  
**Feature inventory:** See `FEATURES.md` (87 tracked capabilities as of 2026-06-18).

---

## Architecture overview

- **Monolithic Next.js app** with server components, API routes, and middleware (`src/middleware.ts`) for auth and role checks.
- **Roles:** Student (default), Instructor, Admin, plus **organization-scoped** org admins on multi-tenant workspaces.
- **Persistence:** Prisma ORM; seeds in `prisma/seed.ts`, demo org in `prisma/seed-demo-org.ts`.
- **Optional integrations:** OpenAI (AI features), Razorpay (payments/subscriptions), SMTP (email/2FA backup), OAuth SSO providers, Web Push (VAPID), SMS for backup 2FA.
- **Deploy:** `DEPLOY.md` (Railway), `vercel.json`, GitHub Actions for Vercel.

---

## Authentication, security, and compliance

| Capability | Routes / APIs | Key libraries |
|------------|---------------|---------------|
| Email/password register & login | `/register`, `/login`, `/api/auth/register`, `/api/auth/login` | `src/lib/auth.ts`, `src/lib/security/login.ts` |
| Session logout | `/api/auth/logout` | |
| Two-factor (TOTP) | `/login/2fa`, `/settings/security` | `src/lib/security/2fa.ts`, `otplib` |
| 2FA backup (email/phone codes) | `/api/auth/2fa/backup/*`, `/api/auth/2fa/send-code` | `src/lib/security/2fa-otp.ts`, `src/lib/email.ts`, `src/lib/sms.ts` |
| SSO (OAuth) | `/api/auth/sso/[provider]`, callback routes | `src/lib/security/sso.ts`, `src/components/auth/sso-buttons.tsx` |
| Device management | `/settings/security`, `/api/security/devices` | `src/lib/security/devices.ts` |
| Platform security settings | `/admin/security`, `/api/security/settings` | `src/lib/security/settings.ts`, IP restriction |
| GDPR export & deletion | Security settings UI, `/api/gdpr/export`, `/api/gdpr/delete` | `src/lib/gdpr.ts` |
| Audit trail | `/admin/audit-logs` | `src/lib/audit.ts` |

**Review focus:** Session cookie handling, 2FA bypass paths, SSO state/nonce, rate limiting on auth endpoints, encryption (`src/lib/encryption.ts`), and admin-only guards on security APIs.

---

## Learning: courses, player, and progress

| Capability | Where | Notes |
|------------|-------|-------|
| Course catalog & search | `/courses` | Filters, recommendations |
| Course detail & enrollment | `/courses/[id]`, `/api/enroll` | Reviews, syllabus, Razorpay for paid courses |
| Learning player | `/learn/[courseId]` | Lessons, video, mark complete |
| Modules & lessons (API) | `/api/courses/[id]/modules`, `/api/modules/[id]/lessons` | Instructor-built structure |
| Quizzes | Learn UI, `/api/quizzes/[id]/submit` | MCQ attempts |
| Assignments | Learn UI, `/api/assignments/[id]/submit` | Text submissions; optional AI grading |
| Progress | `/api/progress`, dashboard widgets | `src/lib/progress.ts` |
| Course forum | `/courses/[id]/forum`, `/api/forum/*` | Threads and posts |
| Course reviews | Course pages, `/api/courses/[id]/reviews` | Star ratings |
| Learning paths | `/paths`, `/paths/[slug]`, `/api/learning-paths/[slug]/start` | Multi-course curricula |
| Competency / skills | `/competency`, `/api/competency/assess` | Skill mapping to courses |
| Prerequisites | Enforced in lib | `src/lib/prerequisites.ts` |

---

## Instructor tools

| Capability | Where |
|------------|-------|
| Course builder | `/instructor/courses/new`, `/instructor/courses/[id]` |
| Modules & lessons forms | `module-form.tsx`, `lesson-form.tsx` |
| Thumbnail upload | `/api/courses/[id]/thumbnail` |
| AI quiz generation | UI + `/api/courses/[id]/quizzes/generate`, cron `/api/cron/generate-quizzes` |
| AI course generator | `ai-course-generator.tsx`, `/api/ai/course/generate`, `generate-from-sources` (PDF/video) |
| Course approval (admin) | `/admin/approvals`, `/api/courses/[id]/approve` |
| Instructor onboarding | `/admin/instructors`, review API |

---

## Certificates

| Capability | Where |
|------------|-------|
| Learner certificate list | `/certificates` |
| Certificate view & print | `/certificates/[id]` |
| Public verification | `/certificates/verify/[certificateNo]` |
| Demo certificate | `/certificates/demo` |
| Org-branded templates | `src/lib/certificate-templates.ts`, org signature/logo APIs |

Certificates auto-issue on course completion; LinkedIn share and QR placeholders in components.

---

## AI features

| Tool | Page / API | Implementation |
|------|------------|----------------|
| AI tools hub | `/ai` | `src/components/ai/ai-tools-hub.tsx` |
| Learning assistant (chat) | `/assistant`, `/api/assistant/chat` | `src/lib/assistant/*` |
| Corporate coach | `/coach`, `/api/coach/chat`, `insights`, `plan`, `profile` | `src/lib/coach/*` |
| Career advisor | `/api/ai/career` | `src/lib/ai/career-advisor.ts` |
| Interview prep | `/api/ai/interview` | `src/lib/ai/interview.ts` |
| Resume builder | `/api/ai/resume` | `src/lib/ai/resume-builder.ts` |
| Learning roadmap | Assistant/coach, `/api/ai/roadmap` | `src/lib/ai/roadmap-generator.ts` |
| Content summarizer | Learn UI, `/api/ai/summarize` | `src/lib/ai/summarizer.ts` |
| Voice narration | Learn UI, `/api/ai/narrate` | OpenAI TTS + browser fallback |
| Assignment AI evaluation | On submit, `/api/ai/evaluate-assignment` | `src/lib/ai/assignment-evaluator.ts` |
| Course outline generation | Instructor, `/api/ai/course/*` | `src/lib/ai/course-generator.ts`, `apply-course-outline.ts` |

**Env:** OpenAI API key required for most AI paths; graceful degradation varies by route.

---

## Games and gamification

### Gamification (learning-linked)

- **Points, badges, achievements:** `src/lib/gamification.ts`, profile and `/dashboard`
- **Learner leaderboard:** `/leaderboard`, `src/lib/weekly-leaderboard.ts`
- **Achievement levels:** `src/lib/achievement-levels.ts`

### Corporate simulation games (`/corporate-games`)

Game types include cybersecurity escape, compliance detective, customer service, sales negotiation, leadership challenge, project management (see `src/lib/corporate-game-types.ts`).

- **Daily scenario rotation** from 16-story catalog (`corporate-game-scenarios.ts`, UTC day)
- **Play flow:** `/corporate-games/[gameType]/play`, submit `/api/corporate-games/[gameType]/submit`
- **Leaderboard:** `/corporate-games/leaderboard`, mastery badges (Bronze → Diamond)

### Quiz challenges (`/challenges`)

- Timed daily/weekly GK, aptitude, technical quizzes
- APIs: `/api/challenges`, `[id]/start`, `answer`, `submit`, `violation`, `leaderboard`
- Play UI: `/challenges/[id]/play`, `/challenges/play`
- Anti-cheat hooks via violation reporting

### General knowledge mini-games (`/games/knowledge/[slug]`)

Flashcard challenge (SRS), match-the-pair, memory game, word scramble, crossword — content in `src/lib/knowledge-games/`.

### Games hub

- `/games` — sections for corporate, quiz challenges, and GK games with player dashboard widgets.

---

## Organizations and enterprise

| Capability | Where |
|------------|-------|
| Org workspaces | `/org`, `/org/[slug]` |
| Org admin dashboard & analytics | `/org/[slug]` |
| Member management | `/org/[slug]/members`, CSV import `/api/org/[organizationId]/members/import` |
| User directory | `/org/[slug]/users` |
| Org settings (logo, signature) | `/org/[slug]/settings`, logo/signature APIs |
| Email-domain auto-join | Registration flow |
| Platform admin org CRUD | `/admin/organizations`, terminate/reactivate APIs |
| Org suspension | `/org/suspended` |
| Org-scoped courses | Course creation with organizationId |
| Lifecycle | `src/lib/organization-lifecycle.ts` |

---

## Commerce

| Capability | Where |
|------------|-------|
| Pricing & plans | `/pricing`, `/api/subscriptions/plans` |
| Razorpay checkout | `src/components/payments/razorpay-checkout.tsx` |
| One-time course orders | `/api/payments/create-order`, `verify` |
| Subscriptions | `/api/subscriptions/create`, `verify` |
| Webhooks | `/api/webhooks/razorpay` |
| Currency helpers | `src/lib/currency.ts`, `src/lib/razorpay.ts` |

---

## Social, engagement, and platform UX

| Capability | Where |
|------------|-------|
| Activity feed | `/feed`, likes, announcements APIs |
| Webinars | `/webinars`, manage, register, attend, attendance |
| Notifications | Header bell, `/api/notifications` |
| Web push (PWA) | `src/lib/push.ts`, subscribe/unsubscribe APIs, service worker `public/sw.js` |
| Profile & avatar | `/profile`, `/api/profile`, avatar upload |
| Dashboard & analytics | `/dashboard`, Recharts in `src/components/analytics/charts.tsx` |
| AI course recommendations | Dashboard, `src/lib/recommendations.ts` |
| Theme (dark/light) | `src/components/theme/*` |
| Mobile nav & PWA install prompt | Layout components, `manifest.webmanifest` |
| Home marketing | `/`, promo at `/promo` |
| **Product tour** | `/product-tour` — `src/components/product-tour/*` |
| **Screenshot showcase** | `/showcase` — `src/components/showcase/*`, `src/lib/showcase-screens.ts` |
| **Home demo video** | Homepage section — `src/components/home/home-demo-video.tsx` (90-sec tour CTA) |
| Admin data exports | `/admin/exports`, `/api/admin/export/[type]` |

---

## Demo experience & presentation layer

Presentation-only mock data for recruiter/client demos. **Does not modify backend business logic** — pages branch on `shouldUseDemoData(email)` from `src/lib/demo/config.ts`.

| Capability | Where | Key files |
|------------|-------|-----------|
| Demo mode flag | `NEXT_PUBLIC_DEMO_MODE=true` | `src/lib/demo/config.ts` |
| Mock data layer | Courses, learners, analytics, certs, games | `src/lib/demo/*` |
| Demo Environment badge | Navbar + banner when demo active | `src/components/demo/demo-environment-badge.tsx` |
| One-click demo login | `/login` | `src/components/demo/demo-experience-login.tsx` |
| Learning history (demo learner) | Student dashboard | `src/lib/demo/learning-history.ts` |
| Homepage polish tokens | Shared section styling | `src/components/home/home-polish.ts` |

**Demo accounts** (seed + mock overlay when signed in):

| Role | Email | Password |
|------|-------|----------|
| Demo Admin | demo-admin@intelligen.lms | password123 |
| Demo Learner | demo-learner@intelligen.lms | password123 |

Wired pages: `/dashboard`, `/courses`, `/certificates`, `/games`, `/leaderboard`, `/challenges`, `/corporate-games/leaderboard`, games quiz section.

**Not yet on demo layer:** `/org/[slug]` org admin analytics (still DB-only).

---

## Suggested review order

1. `prisma/schema.prisma` — entities and relations  
2. `src/middleware.ts` + `src/lib/access.ts` + `src/lib/roles.ts` — authorization  
3. `src/lib/auth.ts` + security folder — auth surface  
4. Payment and webhook handlers — idempotency and signature verification  
5. AI routes — prompt injection, PII in prompts, cost/abuse limits  
6. Challenge/corporate game submit APIs — scoring integrity  
7. Org member import — CSV validation and privilege escalation  
8. File uploads (avatar, thumbnail, org assets) — path traversal and size limits  

---

## Excluded from this review archive

Large promo media under `public/promo/_tmp/*` and `public/promo/*.mp4` / `*.webm` are omitted from the zip to keep size manageable. `node_modules`, `.next`, and `.env` are never included.

---

## Demo accounts (local seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@intelligen.lms | password123 |
| Demo Admin | demo-admin@intelligen.lms | password123 |
| Demo Learner | demo-learner@intelligen.lms | password123 |
| Instructor | instructor@intelligen.lms | password123 |
| Student | student@intelligen.lms | password123 |

Run `npm run db:setup` after `docker compose up -d` and configuring `.env` from `.env.example`.
