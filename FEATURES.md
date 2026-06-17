# IntelliGen LMS — Feature inventory

**Last updated:** 2026-06-18

Use this table to see what is already built. **When you add or materially change a feature, add or update a row here** in the same PR/commit (see `.cursor/rules/feature-table.mdc`).

**Legend:** ✅ Live · 🧪 Partial / env-dependent · 🔒 Role-gated

---

## Summary

| Area | Count |
|------|------:|
| Learning & courses | 14 |
| AI & coaching | 11 |
| Gamification | 3 |
| Games | 20 |
| Organizations | 10 |
| Commerce | 4 |
| Security & compliance | 8 |
| Social & engagement | 6 |
| Admin (platform) | 4 |
| Platform & UX | 7 |
| **Total tracked** | **87** |

---

## Feature table

| # | Feature | Area | Status | Where | Description |
|---|---------|------|--------|-------|-------------|
| 1 | Course catalog & search | Learning | ✅ | `/courses` | Browse, filter, and search published courses |
| 2 | Course detail & enrollment | Learning | ✅ | `/courses/[id]` | Syllabus, reviews, enroll CTA |
| 3 | Learning player | Learning | ✅ | `/learn/[courseId]` | Lessons, progress, mark complete |
| 4 | Quizzes (per course) | Learning | ✅ | `/learn/[courseId]` | Multiple-choice quizzes with attempts |
| 5 | Assignments & submissions | Learning | ✅ | `/learn/[courseId]` | Text assignments + instructor review |
| 6 | Course progress tracking | Learning | ✅ | Dashboard, learn UI | Lesson % and overall completion |
| 7 | Certificates | Learning | ✅ | `/certificates/[id]` | Auto-issued on completion; printable |
| 8 | Instructor course builder | Learning | 🔒 | `/instructor/courses/*` | Create/edit courses, modules, lessons |
| 9 | AI quiz generator | Learning | 🧪 | Instructor course UI | Generate quiz questions via OpenAI |
| 10 | Course forum | Learning | ✅ | `/courses/[id]/forum` | Threads and replies per course |
| 11 | Course reviews & ratings | Learning | ✅ | Course pages | Star ratings and written reviews |
| 12 | Learning paths | Learning | ✅ | `/paths`, `/paths/[slug]` | Curated multi-course paths |
| 13 | Competency / skills | Learning | ✅ | `/competency` | Skill assessments and course mapping |
| 14 | Offline downloads | Learning | ✅ | `/offline`, `/offline/downloads` | Save lessons for offline reading |
| 15 | AI learning assistant | AI | 🧪 | `/assistant` | Chat assistant with course context |
| 16 | AI course generator | AI | 🧪 | `/instructor/courses/[id]` | Modules/lessons from topic, PDFs, or videos |
| 17 | Content summarizer | AI | 🧪 | Learn UI / API | Summarize long lesson content |
| 18 | AI voice narration | AI | 🧪 | Learn UI | OpenAI TTS or browser speech |
| 19 | Interview preparation | AI | 🧪 | `/ai` | Mock interview Q&A |
| 20 | Corporate coach | AI | 🧪 | `/coach` | Plans, insights, career chat |
| 21 | Career advisor | AI | 🧪 | `/ai` | Skill and path suggestions |
| 22 | Learning roadmap | AI | 🧪 | Assistant / coach | Phased learning plans |
| 23 | Assignment AI evaluation | AI | 🧪 | On submit | Auto-grade subjective answers |
| 24 | Resume builder | AI | 🧪 | `/ai` | Resume from skills & certs |
| 25 | AI tools hub page | AI | ✅ | `/ai` | Overview of all AI capabilities |
| 26 | Points & achievements | Gamification | ✅ | Profile, dashboard | Points for learning actions |
| 27 | Learner leaderboard | Gamification | ✅ | `/leaderboard` | Ranked learners by points |
| 28 | Badges | Gamification | ✅ | Profile | Earned achievement badges |
| 29 | Games hub | Games | ✅ | `/games` | Corporate, quiz, and GK games |
| 30 | Cybersecurity Escape Room | Games | ✅ | `/corporate-games/cybersecurity-escape` | Phishing, vulns, social engineering |
| 31 | Compliance Detective | Games | ✅ | `/corporate-games/compliance-detective` | Policy violation investigations |
| 32 | Customer Service Simulator | Games | ✅ | `/corporate-games/customer-service` | De-escalation and satisfaction |
| 33 | Sales Negotiation Simulator | Games | ✅ | `/corporate-games/sales-negotiation` | Sales conversation practice |
| 34 | Leadership Challenge | Games | ✅ | `/corporate-games/leadership-challenge` | Team management decisions |
| 35 | Project Management Game | Games | ✅ | `/corporate-games/project-management` | Resources, deadlines, risks |
| 36 | Corporate game daily rotation | Games | ✅ | `corporate-game-scenarios.ts` | 4 scenarios/day from 16-story catalog (UTC) |
| 37 | Rich corporate scenarios | Games | ✅ | Corporate games | Multi-paragraph stories, 2–3 Qs each |
| 38 | Corporate daily leaderboard | Games | ✅ | `/corporate-games/leaderboard` | Daily + weekly corporate ranks |
| 39 | Corporate mastery badges | Games | ✅ | Leaderboard UI | Bronze → Diamond lifetime tiers |
| 40 | Daily quiz challenges | Games | ✅ | `/challenges` | Timed GK/aptitude/technical quizzes |
| 41 | Weekly quiz challenge | Games | ✅ | `/challenges` | Themed weekly quiz |
| 42 | Quiz leaderboard | Games | ✅ | `/leaderboard` | Weekly quiz ranks |
| 43 | Flashcard Challenge (GK) | Games | ✅ | `/games/knowledge/flashcard-challenge` | Timed flashcards + SRS |
| 44 | Match the Pair (GK) | Games | ✅ | `/games/knowledge/match-the-pair` | Country ↔ capital matching |
| 45 | Memory Game (GK) | Games | ✅ | `/games/knowledge/memory-game` | Landmark/city memory pairs |
| 46 | Word Scramble (GK) | Games | ✅ | `/games/knowledge/word-scramble` | General-knowledge word puzzles |
| 47 | Crossword Puzzle (GK) | Games | ✅ | `/games/knowledge/crossword-puzzle` | Mini crossword trivia |
| 48 | General Knowledge games section | Games | ✅ | `/games#knowledge-games` | Non-course trivia only (geo, science, history) |
| 49 | Organizations (multi-tenant) | Organizations | ✅ | `/org`, `/org/[slug]` | Company workspaces |
| 50 | Org admin dashboard | Organizations | 🔒 | `/org/[slug]` | Stats, analytics, member overview |
| 51 | Org member management | Organizations | 🔒 | `/org/[slug]/members` | Add/edit/remove members |
| 52 | Org user directory | Organizations | 🔒 | `/org/[slug]/users` | Searchable employee directory |
| 53 | Org CSV mass upload | Organizations | 🔒 | Members UI | Bulk import: email, dept, location, phone |
| 54 | Org-scoped courses | Organizations | 🔒 | Course create | Courses tied to an organization |
| 55 | Email-domain auto-join | Organizations | ✅ | Registration | Join org by email domain |
| 56 | Platform admin org hub | Organizations | 🔒 | `/org` | Browse all orgs (platform `ADMIN` only) |
| 57 | Org admin org switcher | Organizations | 🔒 | Org toolbar | Platform admin filters orgs; org admins locked to own org |
| 58 | Org leaderboard analytics | Organizations | 🔒 | Org dashboard | Member points and activity |
| 59 | Pricing page | Commerce | ✅ | `/pricing` | Subscription plan display |
| 60 | Razorpay payments | Commerce | 🧪 | Checkout APIs | Course purchases (India); needs env keys |
| 61 | Subscriptions | Commerce | 🧪 | `/pricing` | Recurring plans via Razorpay |
| 62 | Promo landing | Commerce | ✅ | `/promo` | Marketing / promo page |
| 63 | Email/password auth | Security | ✅ | `/login`, `/register` | Session-based authentication |
| 64 | Two-factor authentication | Security | ✅ | `/settings/security` | Authenticator app at login |
| 65 | 2FA backup email/phone | Security | ✅ | `/settings/security` | Alternate verification contacts |
| 66 | SSO (OAuth providers) | Security | 🧪 | `/api/auth/sso/*` | Google/GitHub etc.; needs provider config |
| 67 | Device management | Security | ✅ | `/settings/security` | View and revoke signed-in devices |
| 68 | GDPR tools | Security | ✅ | `/settings/security` | Data export / deletion requests |
| 69 | Security settings (admin) | Security | 🔒 | `/admin/security` | Platform security configuration |
| 70 | Audit logs | Security | 🔒 | `/admin/audit-logs` | Admin action audit trail |
| 71 | Social feed | Social | ✅ | `/feed` | Posts, likes, learner activity |
| 72 | Webinars | Social | ✅ | `/webinars`, `/webinars/manage` | Schedule, register, attend webinars |
| 73 | Webinar attendance | Social | ✅ | Webinar player | Track live attendance |
| 74 | Notifications bell | Social | ✅ | Header | In-app notifications |
| 75 | Push notifications | Social | 🧪 | Profile / PWA | Web push; needs VAPID keys |
| 76 | Profile & avatar | Social | ✅ | `/profile` | Name, bio, avatar upload |
| 77 | Course approval workflow | Admin | 🔒 | `/admin/approvals` | Approve/reject instructor courses |
| 78 | Instructor approvals | Admin | 🔒 | `/admin/instructors` | Review instructor applications |
| 79 | Organization admin (platform) | Admin | 🔒 | `/admin/organizations` | Create/manage all organizations |
| 80 | Data exports | Admin | 🔒 | `/admin/exports` | Export platform data |
| 81 | Role-based access control | Platform | ✅ | Middleware, APIs | Student, Instructor, Admin roles |
| 82 | Analytics dashboard | Platform | 🔒 | `/dashboard` | Charts: enrollments, users, courses |
| 83 | AI recommendations | Platform | ✅ | Dashboard | Personalized course suggestions |
| 84 | Dark / light theme | Platform | ✅ | Header toggle | System-aware theme switching |
| 85 | Header “More” menu | Platform | ✅ | Navbar | Pricing, Skills, Webinars, Feed, Games |
| 86 | Mobile navigation | Platform | ✅ | Header | Responsive nav + bottom sheet |
| 87 | Railway production deploy | Platform | ✅ | `DEPLOY.md` | `railway up`, Postgres, public URL |

---

## Changelog (recent)

| Date | Change |
|------|--------|
| 2026-06-18 | AI course generator: PDF text extraction + video upload with optional transcripts |
| 2026-06-14 | Global page transitions + scroll-reveal animations on all routes |
| 2026-06-14 | Corporate games: daily shuffle from 16-scenario catalog (not fixed sets) |
| 2026-06-14 | General Knowledge games: trivia-only content (no course/LMS topics) |
| 2026-06-14 | Games hub at `/games` (Corporate + Quiz + GK sections) |
| 2026-06-14 | Org CSV upload: `department`, `location`, `phone_number` columns |
| 2026-06-14 | Platform admin org switcher; org admins scoped to own org |
| 2026-06-14 | Corporate scenarios: rich multi-paragraph stories, multiple questions |

---

## How to update

1. Add or edit a row in **Feature table** (keep `#` sequential or use next number).
2. Bump **Last updated** at the top.
3. Add a line to **Changelog (recent)** for notable releases.
4. Update **Summary** counts if a new area or multiple rows were added.
