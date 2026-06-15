import type { CorporateGameSlug } from "@/lib/corporate-game-types";
import { q, scenario } from "@/lib/corporate-game-scenario-builder";

export const BASE_SCENARIOS: Record<CorporateGameSlug, ReturnType<typeof scenario>[]> = {
  "cybersecurity-escape": [
    scenario(
      "phish-1",
      "Phishing email",
      `Monday morning, your inbox shows an unread message from IT-Support@intelligen-helpdesk.net with the subject "URGENT: Password expires today." The body warns that your corporate account will be locked within two hours unless you click a link to "verify" your credentials. The link points to a domain that is similar to, but not identical to, your company's real SSO portal. Your calendar is full of client calls, and a colleague in the next cubicle mentions they received something similar. Security awareness training last month highlighted look-alike domains and artificial urgency as top phishing tactics.`,
      [
        q(
          "What is the safest immediate action when you receive this email?",
          "Report it to the security team via the official phishing button and delete the message",
          "Correct! Look-alike domains plus urgency are classic phishing. Reporting helps protect everyone.",
          "Forward the email to your team chat asking if others got it",
          "Forwarding spreads malicious links and images. Use the official report channel only.",
          "Click the link and reset your password before the deadline",
          "Attackers clone login pages to harvest credentials. Never click unsolicited links."
        ),
        q(
          "Which indicators in the scenario suggest this is likely phishing rather than legitimate IT mail?",
          "External look-alike domain, unrealistic deadline pressure, and unsolicited credential request",
          "All three are standard phishing indicators taught in security awareness.",
          "The email arrived on a Monday morning",
          "Timing alone does not prove legitimacy or fraud.",
          "The message mentions password expiry, which IT sometimes does",
          "Real IT notices come from verified internal domains without credential-harvest links."
        ),
        q(
          "How should you support colleagues who may have received the same message?",
          "Advise them not to click, report via security channels, and confirm guidance with official IT comms",
          "Coordinated response reduces successful attacks across the team.",
          "Share a screenshot of the link so they know which URL to avoid",
          "Screenshots can still expose malicious URLs and train users to engage with phishing.",
          "Tell them to ignore it without reporting — only you need to act",
          "Silent victims allow campaigns to continue. Collective reporting stops outbreaks."
        ),
      ]
    ),
    scenario(
      "vuln-1",
      "Security vulnerability",
      `During a walk-through audit of the open-plan office, you pass a hot-desk area used by travelling sales staff. A laptop is logged into the CRM, screen unlocked, with a visible pipeline worth several million in active deals. The owner left for an impromptu client lunch without locking the device. Badge-access logs show vendors were signed in at reception earlier today. Company policy classifies CRM data as confidential and requires automatic screen lock within five minutes. You have five minutes before your own meeting starts.`,
      [
        q(
          "What is the most appropriate first response to the unlocked CRM session?",
          "Lock the workstation, note the time and desk, and notify security and the device owner per policy",
          "Physical access plus unlocked sessions are a leading cause of data breaches.",
          "Log out of CRM and leave a sticky note asking them to be more careful",
          "A note alone does not meet incident-reporting requirements.",
          "Ignore it — the sales team manages their own devices",
          "Everyone shares responsibility for protecting confidential customer data."
        ),
        q(
          "Why is this situation especially risky given the office context described?",
          "Vendors were on-site and confidential pipeline data was exposed on an unattended device",
          "Third-party presence increases insider and opportunistic access risk.",
          "Hot desks are always insecure so nothing can be done",
          "Policy and quick action still reduce risk even in shared spaces.",
          "CRM data is low sensitivity compared to payroll",
          "CRM pipelines often contain pricing, contacts, and strategy — highly sensitive."
        ),
      ]
    ),
    scenario(
      "puzzle-1",
      "Social engineering",
      `A familiar coworker messages you on chat: "Hey, I'm locked out of the VPN and IT is swamped. Can you read me your MFA code? I'll buy you coffee." They sound stressed and mention an executive demo in thirty minutes. Your organisation's acceptable-use policy explicitly forbids sharing MFA codes, even with colleagues. Last quarter, a similar request turned out to be a compromised chat account used in a social-engineering chain.`,
      [
        q(
          "How do you respond to the MFA code request?",
          "Refuse, verify their identity through a known channel, and report the request to security",
          "MFA codes must never be shared — legitimate IT never asks for them.",
          "Share the code since they are on your team and under pressure",
          "Insider-style social engineering often starts with small urgent favours.",
          "Send your password instead so they can skip MFA entirely",
          "Sharing credentials violates policy and enables full account takeover."
        ),
        q(
          "What additional step helps determine whether the chat account itself is compromised?",
          "Call the colleague on a known phone number or speak in person before taking any action",
          "Out-of-band verification breaks many impersonation attacks.",
          "Reply in chat asking them to prove who they are by describing yesterday's meeting",
          "Attackers with mailbox access can read calendar details. Use voice verification.",
          "Assume it is legitimate because the display name matches",
          "Display names are trivial to spoof in compromised or cloned accounts."
        ),
      ]
    ),
    scenario(
      "phish-2",
      "Malicious attachment",
      `Accounts payable receives an invoice email from an unknown vendor domain with a file named Invoice_March.exe attached. The message references a purchase order number that does not match any record in your procurement system. The sender insists payment is overdue and copies a generic "finance@" address that is not on your internal directory. Your security tools quarantined similar attachments twice last week. Finance is under month-end pressure to clear the queue.`,
      [
        q(
          "What should accounts payable do with this message and attachment?",
          "Quarantine the email, do not open the file, and alert security operations",
          "Executable attachments from unknown senders are a primary malware vector.",
          "Open the attachment in a sandbox on a personal laptop",
          "Personal devices may lack controls and can bridge malware into corporate networks.",
          "Open it briefly to verify whether finance already approved it",
          "Never open suspicious executables. Malware can deploy without obvious symptoms."
        ),
        q(
          "Which mismatch in the scenario should raise the highest fraud concern?",
          "Unknown vendor domain, non-matching PO number, and unfamiliar finance copy address",
          "Multiple inconsistencies suggest spoofing or BEC rather than a real invoice.",
          "The email mentions month-end pressure",
          "Attackers exploit busy periods, but pressure alone is not proof of fraud.",
          "The attachment uses an .exe extension only",
          "The extension is one signal; combined with sender and PO issues it is critical."
        ),
      ]
    ),
  ],
  "compliance-detective": [
    scenario(
      "policy-1",
      "Policy violation",
      `Internal audit is reviewing expense controls this quarter. While reconciling receipts, you notice that a department manager has approved twelve of their own expense reports over three months, each below the threshold that triggers secondary review. The amounts include client dinners and ride-shares on weekends. Segregation-of-duties policy requires that approvers cannot authorise their own spend. The manager is well regarded and recently defended your team's budget in a leadership meeting.`,
      [
        q(
          "What is the compliant way to address the self-approval pattern?",
          "Report through the ethics hotline or compliance channel with documented examples",
          "Self-approval violates internal controls regardless of seniority or intent.",
          "Mention it casually at lunch to see if others noticed",
          "Informal gossip does not create the audit trail regulators expect.",
          "Ignore it because they are senior and helped your team",
          "No role is exempt from compliance. Retaliation policies protect good-faith reporters."
        ),
        q(
          "Why might small repeated amounts still matter to auditors?",
          "Split transactions can evade review thresholds while still breaching segregation of duties",
          "Pattern behaviour is as important as individual transaction size.",
          "Only amounts above $10,000 require action",
          "Policy violations are not defined solely by dollar thresholds.",
          "Weekend expenses are automatically personal and irrelevant",
          "Context and approval chain matter; weekend client spend may still be legitimate but must be properly approved."
        ),
      ]
    ),
    scenario(
      "investigate-1",
      "Workplace investigation",
      `An employee emails you, their team lead, alleging repeated inappropriate comments in team meetings and after-work messages. They ask you to keep it quiet because they fear career impact. HR's poster in the break room states that harassment reports must be escalated promptly. The accused employee is a peer lead on a critical release. Legal has warned that mishandling complaints increases liability.`,
      [
        q(
          "As team lead, what is your required first step?",
          "Document the report factually and escalate to HR immediately through official channels",
          "Timely HR escalation protects the complainant and the organisation.",
          "Meet the accused alone to hear their side before telling anyone",
          "Solo confrontations can contaminate investigations and create retaliation risk.",
          "Tell the complainant to resolve it directly with the colleague",
          "Harassment claims require formal process, not peer mediation."
        ),
        q(
          "How do you respond if the complainant asks you not to involve HR yet?",
          "Explain that you must follow policy, offer support resources, and avoid promising secrecy you cannot keep",
          "Leaders cannot withhold required escalations even when employees are fearful.",
          "Agree to keep it confidential between the two of you",
          "Private agreements may violate policy and fail the employee if behaviour continues.",
          "Wait until you gather more examples over the next month",
          "Delays can be interpreted as negligence and allow harm to continue."
        ),
      ]
    ),
    scenario(
      "policy-2",
      "Data privacy",
      `Marketing proposes a campaign to 40,000 contacts purchased from a third-party data broker, promising strong segment targeting for a new product launch. The list includes emails, job titles, and inferred income bands. Your privacy officer has not reviewed the vendor. GDPR-style rules in your operating regions require documented consent and a lawful basis for processing. The launch date is three weeks away and leadership wants momentum.`,
      [
        q(
          "What should you decide about using the purchased list?",
          "Block the campaign until documented consent and lawful basis are verified",
          "Unconsented lists violate privacy law and erode customer trust.",
          "Allow it if the list was expensive and well targeted",
          "Cost does not override consent requirements; fines can be severe.",
          "Send a small test batch to measure open rates first",
          "Even a test send without proper consent is a compliance breach."
        ),
        q(
          "What alternative helps marketing meet business goals more safely?",
          "Use opted-in first-party contacts, paid ads with proper consent flows, or approved partners",
          "Lawful acquisition channels protect both conversion and compliance.",
          "Buy a larger list from a different broker without paperwork",
          "Switching vendors without due diligence repeats the same risk.",
          "Remove income bands so the list becomes anonymous and therefore legal",
          "Anonymisation does not replace consent for direct marketing contact."
        ),
      ]
    ),
    scenario(
      "investigate-2",
      "Time fraud",
      `Payroll flags irregularities in a distribution centre's timesheets. Two employees appear to clock in for each other on night shifts when CCTV shows only one vehicle in the car park. Overtime on those nights increased 18% last month. Union representatives are sensitive about accusations. You manage the roster system and can export raw badge and timesheet data.`,
      [
        q(
          "What is the appropriate next step when you see buddy-punching indicators?",
          "Preserve records and notify HR/Compliance for a formal impartial investigation",
          "Time fraud requires evidence preservation and structured review.",
          "Warn the employees privately to stop without telling HR",
          "Private warnings do not address fraud or protect the company in disputes.",
          "Adjust the timesheets yourself to correct the hours",
          "Altering records may constitute evidence tampering."
        ),
        q(
          "Why should CCTV and badge data be secured before interviews begin?",
          "They are objective evidence that supports fair outcomes for employees and the company",
          "Documentation prevents he-said-she-said outcomes and legal challenges.",
          "Video should be deleted quickly to protect employee privacy",
          "Relevant investigation evidence must be retained per policy and law.",
          "Only HR needs data — managers should not export logs",
          "Managers who own systems often must secure exports under investigation protocols."
        ),
      ]
    ),
  ],
  "customer-service": [
    scenario(
      "cs-1",
      "Angry customer",
      `A long-time customer calls after their enterprise order is five days late. They raise their voice, mention switching to a competitor, and say they missed a client deadline because of your shipping partner. Order notes show weather delays and a missed scan at a hub. Your CSAT target is 90% and this caller has premium support. Company policy allows goodwill gestures within defined limits when delays exceed SLA.`,
      [
        q(
          "How do you open the conversation?",
          '"I understand how frustrating this delay is, especially with your client deadline. Let me pull up your order and options right now."',
          "Empathy plus immediate ownership de-escalates angry customers.",
          '"Delays are the carrier\'s fault — we shipped on time from our warehouse."',
          "Blame shifting increases anger even when partially true.",
          '"Please calm down or I will end this call."',
          "Threatening to hang up damages satisfaction and escalations."
        ),
        q(
          "After verifying the delay, what resolution best balances policy and retention?",
          "Apologise, confirm a new delivery window, offer tracking credits or fee waiver per guidelines, and log root cause",
          "Structured recovery improves CSAT and feeds operations improvements.",
          "Promise overnight replacement without checking inventory",
          "Unverified promises create second failures and compliance issues.",
          "Offer nothing because weather is a force majeure event",
          "Force majeure may limit liability but premium support still expects recovery gestures."
        ),
      ]
    ),
    scenario(
      "cs-2",
      "Complex refund",
      `A VIP client requests a full refund on a customised product delivered twenty days ago, outside the thirty-day window but inside the ninety-day warranty for defects. Finance notes the item was personalised and cannot be resold. The client threatens social media exposure. Your playbook allows supervisors to offer partial credit and priority support for strategic accounts.`,
      [
        q(
          "What resolution fits guidelines while protecting margin?",
          "Offer partial credit, expedited replacement review, and supervisor escalation with documented approval",
          "Creative bounded solutions retain high-value clients.",
          "Flatly refuse — policy is thirty days with no exceptions",
          "Rigid answers harm satisfaction with strategic accounts.",
          "Approve a full refund without inventory or finance checks",
          "Unauthorized refunds create financial and audit problems."
        ),
        q(
          "How should you handle the social media threat during the call?",
          "Stay professional, focus on solving the issue, and follow escalation if abuse continues",
          "Document threats and involve supervisor channels without reacting emotionally.",
          "Offer extra refund immediately to prevent any post",
          "Capitulating to threats encourages repeat pressure tactics.",
          "Tell them posting online violates your terms and hang up",
          "Aggressive responses become screenshots that amplify reputational harm."
        ),
      ]
    ),
    scenario(
      "cs-3",
      "Satisfaction recovery",
      `A chat customer rates 2/5 after your shipping bot quoted an outdated delivery date. The package actually arrives on time, but the customer cancelled a meeting based on the bot message. Logs show the bot pulled from an old FAQ chunk. Product wants to promote AI support more heavily next quarter.`,
      [
        q(
          "What recovery approach addresses both CSAT and the root cause?",
          "Apologise, correct the information, apply an approved goodwill gesture, and file a bot-content bug",
          "Recovery plus root-cause logging prevents repeat failures.",
          "Explain that bots are experimental and move on",
          "Dismissive tone guarantees poor reviews and churn.",
          "Transfer them back to the same bot flow",
          "Repeating the failure destroys trust in automation."
        ),
        q(
          "What should be communicated to product about this incident?",
          "Include chat transcript, FAQ source ID, and customer impact in the internal quality ticket",
          "Actionable reports help fix knowledge bases before wider AI rollout.",
          "Only mention that the customer was angry",
          "Without technical detail, engineering cannot fix retrieval issues.",
          "Recommend shutting down chat entirely",
          "Targeted fixes are preferable to removing a channel customers expect."
        ),
      ]
    ),
    scenario(
      "cs-4",
      "Feature gap",
      `An enthusiastic prospect on a renewal call asks for SSO with a niche identity provider you do not support yet. They need an answer today to secure internal security sign-off. Roadmap shows SSO expansion in two quarters. A competitor claims immediate support. The account represents 8% of your region's ARR.`,
      [
        q(
          "How do you respond honestly while defending the relationship?",
          "Acknowledge the gap, share roadmap timing, propose interim workaround, and offer a technical scoping call",
          "Honesty with alternatives maintains trust on considered purchases.",
          "Promise the feature will ship next week to save the deal",
          "Overpromising creates escalations and damages credibility.",
          "Tell them to use a competitor if SSO is critical",
          "Never push competitors — articulate value you deliver today."
        ),
        q(
          "Which internal team should be looped in before committing to any interim workaround?",
          "Security architecture and engineering to validate feasibility and risk",
          "Workarounds affecting authentication need formal review.",
          "Sales leadership only — they own the number",
          "Technical commitments require engineering validation.",
          "No one — verbal assurances are enough for strategic accounts",
          "Undocumented promises become contractual expectations."
        ),
      ]
    ),
  ],
  "sales-negotiation": [
    scenario(
      "sales-1",
      "Analytical buyer",
      `You are in week three of an enterprise deal with a manufacturer. The CFO joins the call and says your proposal is 20% above a competitor's quote. She asks for a line-by-line justification and will not decide on rapport alone. Your solution includes implementation, training, and three years of support bundled together. The competitor quote allegedly excludes onboarding and uses a lower user tier.`,
      [
        q(
          "How do you respond to the 20% price challenge?",
          "Present ROI case studies, total-cost-of-ownership comparison, and phased rollout options",
          "Analytical buyers need quantified value, not enthusiasm alone.",
          "Offer 40% discount immediately to close today",
          "Deep early discounts erode margin and signal desperation.",
          "Insist they do not understand enterprise value",
          "Condescension ends deals with data-driven stakeholders."
        ),
        q(
          "What should you clarify before comparing quotes?",
          "Scope, user counts, support tiers, and implementation assumptions in both proposals",
          "Apples-to-apples comparisons expose hidden competitor gaps.",
          "Assume all vendors include the same services",
          "Bundling differences often explain headline price gaps.",
          "Refuse to discuss the competitor entirely",
          "Ignoring the benchmark makes you appear evasive to analytical buyers."
        ),
      ]
    ),
    scenario(
      "sales-2",
      "Aggressive negotiator",
      `Forty minutes into negotiation, the buyer's procurement lead says: "Final offer in ten minutes or we walk." They demand free professional services, unlimited users, and a one-year exit clause. Your manager is unavailable. The deal would make quarter if signed tonight, but services margin is already thin.`,
      [
        q(
          "What tactic preserves leverage under artificial urgency?",
          "Pause, confirm decision criteria, and propose a bounded package with explicit trade-offs",
          "Structured options beat reactive concession spirals.",
          "Match aggression and threaten to walk first",
          "Escalation loops rarely close complex enterprise agreements.",
          "Accept every demand to save the quarter",
          "Unconditional concessions train buyers to squeeze harder next time."
        ),
        q(
          "Which concession is riskiest to grant without executive approval?",
          "Unlimited users with free professional services and a one-year exit clause combined",
          "Stacked concessions destroy margin and lock-in simultaneously.",
          "A standard payment-term adjustment",
          "Minor terms can be traded when bounded and documented.",
          "Adding one extra training session",
          "Low-cost items can be trading chips if margin stays protected."
        ),
      ]
    ),
    scenario(
      "sales-3",
      "Relationship buyer",
      `A director you have worked with for years says: "We go way back — throw in free onboarding or I cannot get this signed." The deal is mid-size but politically important for a reference logo. Services teams report onboarding backlog of six weeks. Finance allows discounted onboarding but not free multi-week work.`,
      [
        q(
          "How do you protect margin while honouring the relationship?",
          "Offer valued-client onboarding at defined scope with mutual success milestones and documented approval",
          "Relationships close deals when boundaries stay clear.",
          "Give everything free because the relationship is everything",
          "Free work sets unsustainable expectations for future deals.",
          "Refuse any flexibility — policy is policy",
          "Rigid responses damage rapport with relationship-oriented buyers."
        ),
        q(
          "What document should anchor any onboarding concession?",
          "Statement of work with hours, deliverables, and expiry if milestones slip",
          "Written scope prevents scope creep and services overload.",
          "A verbal promise during the call",
          "Verbal deals become disputed when teams change.",
          'An email saying "we will figure it out later"',
          "Vague commitments create delivery and revenue recognition issues."
        ),
      ]
    ),
    scenario(
      "sales-4",
      "Closing conversation",
      `After a strong demo, the economic buyer says they need to "think about it" and will get back to you. Internal champion likes the product but warns that two competitors are presenting next week. No mutual action plan exists. Your pipeline review is tomorrow.`,
      [
        q(
          "What is the best next step to maintain momentum?",
          "Schedule follow-up, summarise agreed pains, send tailored proposal with timeline and stakeholders",
          "Structured next steps keep deals alive without high pressure.",
          "Call every hour until they answer",
          "Pressure tactics backfire on considered purchases.",
          "Send a generic brochure and wait",
          "Passive follow-up invites competitors to define the narrative."
        ),
        q(
          'What question uncovers the real blocker behind "think about it"?',
          '"Besides price, what else would you need to see to recommend this internally?"',
          "Open questions reveal hidden objections you can address.",
          '"Why are you wasting my time if you are not ready?"',
          "Hostility ends champion support.",
          '"Can I speak to your boss without you?"',
          "Bypassing your champion damages trust and internal politics."
        ),
      ]
    ),
  ],
  "leadership-challenge": [
    scenario(
      "lead-1",
      "Team conflict",
      `Two high performers on your product squad publicly disagree in sprint planning about who owns the checkout redesign. Slack threads became sharp over the weekend. Both have strong track records and neither wants to report to the other. Delivery is two weeks from a committed release. HR asks whether interpersonal issues are affecting velocity.`,
      [
        q(
          "How do you address ownership conflict as their manager?",
          "Facilitate a joint session to define roles, success metrics, and escalation paths",
          "Structured conflict resolution preserves performance and morale.",
          "Pick your favourite and assign all ownership to them",
          "Perceived bias destroys trust and retention.",
          "Ignore it — high performers will self-sort",
          "Unresolved conflict spreads and slows delivery."
        ),
        q(
          "What should be documented after the facilitation session?",
          "RACI-style ownership, decision deadlines, and how disagreements escalate to you",
          "Written clarity prevents repeat public disputes.",
          "Only verbal agreements to be nice in meetings",
          "Without documentation, patterns repeat under pressure.",
          "A performance warning for both immediately",
          "Punitive action before facilitation often backfires with strong contributors."
        ),
      ]
    ),
    scenario(
      "lead-2",
      "Burnout vs deadline",
      `Your team completed two crunch cycles this quarter. Sentiment survey scores dropped sharply. Leadership still wants a major feature in the current sprint to match a marketing announcement. Velocity data shows 30% overtime for three weeks. Two engineers have flagged stress in skip-levels.`,
      [
        q(
          "How do you represent the team to leadership?",
          "Present capacity data, propose scope trade-offs, and negotiate timeline with stakeholders",
          "Evidence-based pushback protects sustainable performance.",
          "Mandate overtime without discussion",
          "Burnout drives attrition, defects, and long-term slowdown.",
          "Cancel the feature silently without telling stakeholders",
          "Unilateral decisions erode trust up and down the chain."
        ),
        q(
          "What short-term support helps the team while renegotiating scope?",
          "Remove low-value meetings, shield focus time, and sequence work to reduce context switching",
          "Operational relief complements timeline negotiations.",
          "Promise promotions to everyone if they push through",
          "Empty promises do not replace workload management.",
          "Replace engineers who complain about hours",
          "Retaliatory staffing changes destroy psychological safety."
        ),
      ]
    ),
    scenario(
      "lead-3",
      "Virtual team",
      `A skilled engineer in another timezone has missed four standups in two weeks. They deliver strong async updates but overlap hours with HQ are limited. Other team members complain about uneven visibility. Company policy expects live participation unless approved alternatives exist.`,
      [
        q(
          "What leadership approach fits a distributed team?",
          "Discuss barriers 1:1, adjust meeting windows, and document async update norms",
          "Inclusive scheduling plus async norms support distributed performance.",
          "Put them on a performance plan immediately",
          "Punitive action before understanding context harms inclusion.",
          "Remove them from the project",
          "Removal without coaching fails leadership and succession goals."
        ),
        q(
          "How do you address fairness concerns from HQ-based teammates?",
          "Clarify that outcomes and documented updates matter, not presence alone, and align rituals for overlap",
          "Transparent standards reduce perceived favouritism.",
          "Force the remote engineer onto HQ hours permanently",
          "Rigid hours may cause attrition without improving collaboration.",
          "Excuse all absences without team communication",
          "Unexplained exceptions breed resentment."
        ),
      ]
    ),
    scenario(
      "lead-4",
      "Crisis decision",
      `Friday 6 p.m., checkout error rates spike to 15%. Customers are posting on social media. Half your team has already left for the weekend. Executive leadership wants hourly updates. On-call runbooks exist but have not been practised recently.`,
      [
        q(
          "What is effective crisis leadership in this moment?",
          "Activate incident roster, rotate on-call fairly, communicate status to executives",
          "Crisis leadership balances urgency with sustainable response.",
          "Let everyone leave and fix Monday",
          "Extended outages damage customers and revenue over the weekend.",
          "Handle everything alone as the manager",
          "Hero culture burns out leaders and hides team capability gaps."
        ),
        q(
          "What communication should go to customers while engineering works?",
          "Acknowledge impact, state investigation status, and provide next update time",
          "Transparent status reduces speculation and support load.",
          "Stay silent until a full postmortem is ready",
          "Silence during outages amplifies frustration and churn.",
          "Blame engineering publicly in the status page",
          "Internal blame in public channels damages morale and brand."
        ),
      ]
    ),
  ],
  "project-management": [
    scenario(
      "pm-1",
      "Resource allocation",
      `Two critical workstreams — security patching and a revenue feature — both need your only senior backend engineer full-time this week. The feature is tied to a partner demo. The patches address a known vulnerability with public discussion on security forums. Neither task can be fully descoped without stakeholder pain.`,
      [
        q(
          "How do you allocate the senior engineer?",
          "Prioritise by business and security impact, pair a junior on lower-risk portions, adjust scope",
          "Transparent prioritisation with pairing optimises scarce skills.",
          "Assign both tasks fully and hope they finish",
          "Overallocation guarantees missed deadlines and quality issues.",
          "Hire a contractor without budget or security approval",
          "Unapproved spend and access create compliance risk."
        ),
        q(
          "Who must be informed if the partner demo date slips?",
          "Partner manager, security lead, and executive sponsor with revised timeline",
          "Stakeholder alignment prevents surprise escalations.",
          "Only the engineering team",
          "Hidden slips surface as contractual or security incidents.",
          "Nobody until the sprint ends",
          "Late surprises destroy trust and limit mitigation options."
        ),
      ]
    ),
    scenario(
      "pm-2",
      "Deadline pressure",
      `A vendor API dependency slips three days due to their outage. Your launch is in five days and marketing assets are live. Integration tests cover only happy paths. Stakeholders have not been told about the slip yet.`,
      [
        q(
          "What project plan adjustment is most responsible?",
          "Re-baseline schedule, communicate risk early, descope non-critical features",
          "Proactive re-planning protects the committed launch quality.",
          "Hide the delay until launch day",
          "Surprise misses destroy stakeholder trust.",
          "Ship on time with untested integration paths",
          "Quality debt creates costly post-launch incidents."
        ),
        q(
          "Which test gap poses the greatest launch risk?",
          "Failure modes and rollback when the vendor API is degraded",
          "Happy-path-only testing misses real-world outage behaviour.",
          "UI colour contrast on the landing page",
          "Important for brand but secondary to integration reliability.",
          "Employee badge photo sizes",
          "Unrelated to the dependency risk described."
        ),
      ]
    ),
    scenario(
      "pm-3",
      "Risk handling",
      `Your product depends on a single vendor API for identity verification. The vendor had two partial outages last month. Legal requires uptime evidence for renewal. Engineering proposes launching without a fallback to meet date. Risk register entry is overdue.`,
      [
        q(
          "What mitigation belongs in the risk register?",
          "Fallback provider, caching layer, incident runbook, and vendor SLA review",
          "Layered mitigations reduce single-point-of-failure exposure.",
          "Ignore outages — the vendor promised 99.9% in marketing",
          "Marketing SLAs do not replace integration resilience planning.",
          "Cancel the project entirely",
          "Cancellation without analysis wastes investment and business need."
        ),
        q(
          "If launch proceeds before fallback is ready, what guardrail is essential?",
          "Feature flag, manual verification path, and executive-signed risk acceptance",
          "Documented acceptance clarifies accountability if outages hit users.",
          "Launch globally at full volume immediately",
          "Blast-radius control limits customer impact during instability.",
          "Disable monitoring to avoid alert noise",
          "Hiding failures delays response and breaches operational duty."
        ),
      ]
    ),
    scenario(
      "pm-4",
      "Sprint trade-off",
      `QA reports two severity-1 defects on launch eve. Sales already emailed customers about tomorrow's go-live. Marketing scheduled a livestream. Fixing issues needs at least one extra day of regression.`,
      [
        q(
          "What go/no-go decision balances stakeholders?",
          "Gate launch on sev-1 fixes, publish hotfix plan, align comms with sales and marketing",
          "Balanced decisions protect brand and customers.",
          "Ship anyway and patch in production overnight",
          "Known critical bugs at launch damage reputation and support load.",
          "Delay silently without updating external audiences",
          "Communication failures amplify stakeholder and customer damage."
        ),
        q(
          "How should sales adjust customer messaging if launch slips one day?",
          "Coordinated revised timeline with talking points and apology for inconvenience",
          "Aligned messaging prevents contradictory customer communications.",
          "Tell customers the product shipped and hope QA was wrong",
          "Misrepresentation creates legal and support escalations.",
          "Blame QA publicly in customer emails",
          "Throwing internal teams under the bus erodes culture and trust."
        ),
      ]
    ),
  ],
};
