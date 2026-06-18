import type { CourseOutline } from "../src/lib/ai/course-generator";

type CuratedSpec = Pick<CourseOutline, "modules"> & {
  title?: string;
  description?: string;
};

export const CURATED_COURSE_OUTLINES: Record<string, CuratedSpec> = {
  "Cybersecurity Essentials for Teams": {
    modules: [
      {
        title: "Security Mindset & Threat Landscape",
        summary: "Understand why security matters and recognize common workplace threats.",
        lessons: [
          {
            title: "Why Cybersecurity Is Everyone's Job",
            summary: "Security is a shared responsibility across all roles.",
            content: `## Why security matters at work\n\nMost breaches start with human error — a clicked link, a reused password, or an unpatched device. Security teams provide tools and policies, but **every employee is part of the defense**.\n\n### Learning objectives\n- Explain why attackers target organizations of all sizes\n- Identify the cost of incidents (downtime, data loss, reputation)\n- Adopt a "pause and verify" habit before acting on requests\n\n### Key ideas\n1. **Confidentiality, integrity, availability** — the CIA triad\n2. **Social engineering** — attackers manipulate trust, urgency, and authority\n3. **Defense in depth** — no single control stops every attack\n\n### Reflection\nList three systems at your workplace that would be painful to lose for 24 hours. That list is your personal reason to care about security.`,
          },
          {
            title: "Phishing, Malware & Social Engineering",
            summary: "Spot suspicious messages and unsafe attachments.",
            content: `## Recognizing common attacks\n\n**Phishing** emails imitate trusted senders to steal credentials or deploy malware. **Malware** includes viruses, ransomware, and spyware. **Social engineering** tricks people into bypassing controls.\n\n### Red flags in email & chat\n- Urgent language ("act in the next hour")\n- Unexpected attachments or login links\n- Slightly wrong sender addresses\n- Requests to bypass policy ("send me the file on WhatsApp")\n\n### Safe habits\n- Hover over links before clicking\n- Verify unusual payment or credential requests via a **second channel** (call, in-person)\n- Report suspicious messages to IT or security\n\n### Practice scenario\nYou receive: "Payroll failed — confirm your bank details here." What three steps do you take before responding?`,
          },
        ],
      },
      {
        title: "Passwords, MFA & Device Hygiene",
        summary: "Protect accounts and endpoints with strong everyday habits.",
        lessons: [
          {
            title: "Passwords & Password Managers",
            summary: "Use unique credentials and a trusted password manager.",
            content: `## Strong authentication basics\n\nReused passwords let one breach compromise many accounts. A **password manager** generates and stores unique passwords so you only memorize one master passphrase.\n\n### Good practices\n- **Unique password per account**\n- **Long passphrases** (4+ random words) where allowed\n- **Never share** credentials in chat or email\n- Enable breach alerts where available\n\n### Passphrase example\n\`correct-horse-battery-staple-2026!\` is easier to remember and harder to crack than \`P@ssw0rd1\`.\n\n### Action item\nEnable a password manager approved by your organization and rotate any reused passwords for work systems.`,
          },
          {
            title: "Multi-Factor Authentication & Updates",
            summary: "Add a second layer of protection and keep software current.",
            content: `## MFA and patching\n\n**Multi-factor authentication (MFA)** requires something you know (password) plus something you have (phone app, hardware key). It blocks most credential-stuffing attacks.\n\n### MFA tips\n- Prefer authenticator apps or hardware keys over SMS when possible\n- Register backup codes in a secure location\n- Never approve MFA prompts you did not initiate\n\n### Device hygiene\n- Install OS and app updates promptly\n- Lock screens when away from desk\n- Avoid public USB charging ports (juice jacking risk)\n- Use company VPN on untrusted networks\n\n### Checklist\n☐ MFA enabled on email and SSO  \n☐ Disk encryption on laptop  \n☐ Automatic updates turned on`,
          },
        ],
      },
      {
        title: "Data Handling & Incident Response",
        summary: "Handle sensitive data safely and know how to report incidents.",
        lessons: [
          {
            title: "Classifying & Sharing Data",
            summary: "Share the minimum data required for the task.",
            content: `## Data classification in practice\n\nOrganizations label data as **public**, **internal**, **confidential**, or **restricted**. Your job is to match handling to sensitivity.\n\n### Rules of thumb\n- **Need-to-know** — only share with people who require it for their role\n- **Least privilege** — request the lowest access level that works\n- **No personal cloud** for work files unless explicitly approved\n\n### Common mistakes\n- Forwarding customer PII to personal email\n- Screenshots of dashboards in public Slack channels\n- Unencrypted USB drives with exports\n\n### Mini exercise\nYou need feedback on a spreadsheet with employee names and salaries. Which channel is appropriate? Who must approve external sharing?`,
          },
          {
            title: "Reporting Incidents Quickly",
            summary: "Fast reporting limits damage and helps recovery.",
            content: `## When in doubt, report\n\nIf you clicked a suspicious link, lost a device, or see ransomware: **report immediately**. Early response contains blast radius.\n\n### What to include in a report\n- What happened and when\n- Systems or data potentially affected\n- Screenshots or message headers (not forwarded malware)\n- Actions already taken (password changed, device disconnected)\n\n### What not to do\n- Don't wait to "see if it gets worse"\n- Don't delete evidence unless IT instructs you\n- Don't pay ransomware without legal and security guidance\n\n### Remember\nReporting protects you and your teammates. Security teams want signal, not blame.`,
          },
        ],
      },
    ],
  },
  "Excel & Data Literacy for Professionals": {
    modules: [
      {
        title: "Spreadsheet Foundations",
        summary: "Navigate Excel confidently and structure data for analysis.",
        lessons: [
          {
            title: "Workbooks, Sheets & Clean Tables",
            summary: "Organize data in tables that formulas can trust.",
            content: `## Building a analysis-ready sheet\n\nStart with **one row = one record**. Avoid merged cells in data regions. Use **Excel Tables** (Insert → Table) so formulas expand automatically.\n\n### Core navigation\n- **Rows / columns** — addresses like \`B3\`\n- **Named ranges** — readable formula references\n- **Freeze panes** — keep headers visible while scrolling\n\n### Clean data habits\n- Consistent date formats\n- Separate columns for first name / last name / email\n- No totals mixed inside data rows\n\n### Try it\nImport a CSV of sales records. Convert to a Table. Add a filter on region.`,
          },
          {
            title: "Essential Formulas",
            summary: "Use SUM, AVERAGE, COUNTIF, and IF for everyday questions.",
            content: `## Formulas that answer business questions\n\n| Formula | Question it answers |\n|---------|---------------------|\n| \`=SUM(range)\` | Total revenue? |\n| \`=AVERAGE(range)\` | Typical order value? |\n| \`=COUNTIF(range,criteria)\` | How many East region rows? |\n| \`=IF(test,true,false)\` | Pass/fail flag? |\n\n### Relative vs absolute references\n- \`A1\` adjusts when copied\n- \`$A$1\` stays fixed — useful for tax rates in \`$B$1\`\n\n### Example\n\`=IF(D2>=1000,"High","Standard")\` classifies deals.\n\n### Practice\nAdd a column that flags orders over your team's target using IF.`,
          },
        ],
      },
      {
        title: "Charts & Visual Storytelling",
        summary: "Turn numbers into charts stakeholders understand.",
        lessons: [
          {
            title: "Choosing the Right Chart",
            summary: "Match chart type to the message.",
            content: `## Chart selection guide\n\n- **Line** — change over time\n- **Column/Bar** — compare categories\n- **Pie** — parts of a whole (use sparingly, few slices)\n- **Scatter** — relationship between two metrics\n\n### Design principles\n- Title states the insight, not just the metric\n- Remove chart junk (3D, heavy grids)\n- Label directly when possible\n- Use accessible color contrast\n\n### Pitfall\nA pie chart with 12 slices hides more than it reveals. Prefer a sorted bar chart.`,
          },
          {
            title: "PivotTables for Exploration",
            summary: "Summarize large datasets without rewriting formulas.",
            content: `## PivotTables in 5 steps\n\n1. Click inside your Table\n2. Insert → PivotTable\n3. Drag fields to Rows, Columns, Values\n4. Change aggregation (Sum, Count, Average)\n5. Refresh when source data updates\n\n### Use cases\n- Revenue by product and quarter\n- Support tickets by category\n- Course enrollments by skill level\n\n### Tip\nUse **Slicers** for interactive dashboards in presentations.`,
          },
        ],
      },
      {
        title: "Data-Driven Decisions",
        summary: "Interpret metrics responsibly and communicate findings.",
        lessons: [
          {
            title: "Asking Good Questions of Data",
            summary: "Frame questions before touching formulas.",
            content: `## Question-first analysis\n\nBad: "Let's make a dashboard."  \nGood: "Did onboarding changes reduce week-1 churn?"\n\n### SMART metrics\n- **Specific** — one clear definition\n- **Measurable** — data exists\n- **Actionable** — someone can change process\n- **Relevant** — tied to goal\n- **Time-bound** — weekly, monthly\n\n### Sanity checks\n- Compare to prior period\n- Look for outliers and data entry errors\n- Ask "does this number feel possible?"`,
          },
          {
            title: "Presenting Insights to Stakeholders",
            summary: "Lead with the recommendation, support with evidence.",
            content: `## Executive-friendly summaries\n\nStructure:\n1. **Headline** — the decision or risk\n2. **So what** — business impact\n3. **Evidence** — one chart or table\n4. **Next step** — owner and date\n\n### Avoid\n- Dumping raw exports\n- Jargon without definitions\n- Correlation presented as causation\n\n### Template\n"Completion rates rose **12%** after shorter lessons (see chart). Recommend rolling format to two more courses by Q3."`,
          },
        ],
      },
    ],
  },
  "Effective Communication at Work": {
    modules: [
      {
        title: "Clear Writing",
        summary: "Write emails and docs that get read and acted on.",
        lessons: [
          {
            title: "Structure for Busy Readers",
            summary: "Front-load the ask and use scannable formatting.",
            content: `## The BLUF pattern\n\n**Bottom Line Up Front** — state purpose in the first two lines.\n\n### Email template\n- **Subject:** Action needed — Q2 training roster by Friday\n- **Line 1:** Please approve the attached roster by EOD Friday.\n- **Context:** 2–3 bullets max\n- **Ask:** Single explicit request\n\n### Formatting wins\n- Short paragraphs\n- Bullets for lists\n- Bold for dates and owners\n\n### Rewrite exercise\nTurn a 400-word rambling update into 120 words with a clear ask.`,
          },
          {
            title: "Tone, Audience & Inclusivity",
            summary: "Adapt voice for context without losing clarity.",
            content: `## Audience-aware communication\n\nSame facts, different tone:\n- **Executive** — outcomes and risk\n- **Peer** — collaboration and detail\n- **Customer** — empathy and next steps\n\n### Inclusive language\n- Avoid idioms that don't translate globally\n- Use people's preferred names and pronouns\n- Describe behavior, not character ("the draft was late" vs "you're lazy")\n\n### Async respect\nAssume readers are in different time zones. Don't require instant replies unless truly urgent.`,
          },
        ],
      },
      {
        title: "Meetings & Presentations",
        summary: "Run meetings with purpose and present with confidence.",
        lessons: [
          {
            title: "Meetings That Earn Their Time",
            summary: "Agendas, notes, and decisions — or don't meet.",
            content: `## Meeting hygiene\n\nEvery meeting needs:\n- **Purpose** — decision, brainstorm, or sync?\n- **Agenda** shared 24h ahead\n- **Timebox** per topic\n- **Notes** with decisions and owners\n\n### Alternatives to meetings\n- Loom/video for updates\n- Shared doc for async comments\n- Slack thread with deadline\n\n### Facilitator script\n"We have 25 minutes. Goal: pick LMS rollout date. I'll timebox options, then we vote."`,
          },
          {
            title: "Presenting with Confidence",
            summary: "Tell a story: problem → insight → recommendation.",
            content: `## Presentation arc\n\n1. **Hook** — why this matters now\n2. **Context** — brief background\n3. **Insight** — data or customer signal\n4. **Recommendation** — specific proposal\n5. **Call to action** — what you need from the room\n\n### Delivery tips\n- Practice transitions, not word-for-word memorization\n- Pause after key numbers\n- End early; respect Q&A time\n\n### Slide rule\nOne idea per slide. If you need a paragraph, speak it — don't project it.`,
          },
        ],
      },
      {
        title: "Listening & Feedback",
        summary: "Build trust through active listening and useful feedback.",
        lessons: [
          {
            title: "Active Listening",
            summary: "Listen to understand, not just to reply.",
            content: `## Listening skills\n\n- **Paraphrase** — "So you're saying the timeline feels tight?"\n- **Ask clarifying questions** before solving\n- **Remove distractions** — close unrelated tabs in 1:1s\n\n### In remote work\n- Camera-on when possible for nuanced conversations\n- Summarize decisions in chat after calls\n- Confirm owners in writing\n\n### Barrier to avoid\nInterrupting with solutions before the speaker feels heard.`,
          },
          {
            title: "Giving & Receiving Feedback",
            summary: "Use SBI: Situation, Behavior, Impact.",
            content: `## SBI feedback model\n\n- **Situation** — "In yesterday's client demo…"\n- **Behavior** — "…you spoke over the customer's question twice."\n- **Impact** — "…they seemed frustrated and we missed a requirement."\n\n### Receiving feedback\n- Thank the person for candor\n- Ask for examples if vague\n- Agree on one change to try\n\n### Growth mindset\nFeedback is data about behavior in a moment — not a verdict on your worth.`,
          },
        ],
      },
    ],
  },
  "Getting Started with AI Tools": {
    modules: [
      {
        title: "AI Fundamentals for Work",
        summary: "Understand what modern AI assistants can and cannot do.",
        lessons: [
          {
            title: "What Generative AI Actually Does",
            summary: "AI predicts useful text — it does not truly 'understand' like humans.",
            content: `## How to think about LLMs\n\nLarge language models predict the next useful token based on patterns in training data. They excel at **drafting, summarizing, transforming, and brainstorming**. They can **hallucinate** — confident-sounding false facts.\n\n### Good fits\n- First drafts of emails and lesson outlines\n- Summarizing long documents\n- Explaining concepts in simpler language\n- Generating practice quiz questions for review\n\n### Poor fits\n- Legal/medical decisions without expert review\n- Confidential data in public tools without approval\n- Math-heavy work without verification`,
          },
          {
            title: "Responsible Use & Data Privacy",
            summary: "Follow company policy before pasting sensitive information.",
            content: `## Guardrails matter\n\nBefore using AI at work:\n1. Read your **organization's AI policy**\n2. Know if your tool is **enterprise** (data not used for training) vs consumer\n3. **Redact** customer PII, credentials, unreleased financials\n\n### Human-in-the-loop\nAI output is a **draft**. A knowledgeable human approves before publish, grades, or customer send.\n\n### Incident prevention\nNever paste API keys, passwords, or private health data into unapproved tools.`,
          },
        ],
      },
      {
        title: "Prompting & Workflows",
        summary: "Write prompts that produce usable results consistently.",
        lessons: [
          {
            title: "Prompt Patterns That Work",
            summary: "Role, context, task, format, constraints.",
            content: `## RCTFC framework\n\n- **Role** — "You are an instructional designer…"\n- **Context** — audience, constraints, source material\n- **Task** — the specific deliverable\n- **Format** — bullets, table, JSON, word count\n- **Constraints** — tone, reading level, things to avoid\n\n### Example\n"You are a corporate trainer. Audience: new managers. Task: 5-slide outline on giving feedback. Format: markdown bullets. Constraints: under 200 words, no jargon."\n\n### Iteration\nAsk for revisions: "Shorter opening" or "Add one activity per slide."`,
          },
          {
            title: "Building Repeatable Workflows",
            summary: "Chain AI steps into checklists you reuse.",
            content: `## Workflow design\n\n1. **Ingest** — paste or upload approved source\n2. **Transform** — summarize, quiz, translate\n3. **Verify** — fact-check names, numbers, policies\n4. **Publish** — LMS, email, doc\n\n### Templates save time\nKeep prompt templates per task: lesson summary, quiz generation, FAQ from transcript.\n\n### Measure quality\nTrack edit time — if you rewrite 90%, fix the prompt before scaling.`,
          },
        ],
      },
      {
        title: "AI in Learning & Teams",
        summary: "Apply AI to courses, coaching, and team productivity.",
        lessons: [
          {
            title: "AI for Learners & Instructors",
            summary: "Use AI as tutor and assistant, not replacement.",
            content: `## In the LMS context\n\nLearners can use AI to:\n- Clarify lesson concepts\n- Generate flashcards for review\n- Practice interview answers\n\nInstructors can use AI to:\n- Draft module outlines (then edit)\n- Create quiz question banks\n- Summarize forum threads\n\n### Academic integrity\nSet clear rules: AI-assisted is OK for brainstorming; submitting unedited AI work may not be.`,
          },
          {
            title: "Evaluating AI Output",
            summary: "Use a simple quality rubric before shipping.",
            content: `## QA rubric (1–5 each)\n\n- **Accuracy** — facts check out\n- **Relevance** — answers the actual task\n- **Clarity** — readable for audience\n- **Safety** — no harmful or biased content\n- **Policy** — no leaked secrets\n\n### When to reject\nScores below 3 on accuracy or policy — regenerate or write manually.\n\n### Continuous improvement\nSave great outputs as few-shot examples inside your prompts.`,
          },
        ],
      },
    ],
  },
};
