import type { CorporateGameSlug } from "@/lib/corporate-game-types";
import type { LegacyGameScenario } from "@/lib/corporate-scenario-normalize";

const P = 10;
const Q = 4;

function o(
  best: string,
  bestFb: string,
  ok: string,
  okFb: string,
  bad: string,
  badFb: string
) {
  return [
    { text: best, points: P, feedback: bestFb },
    { text: ok, points: Q, feedback: okFb },
    { text: bad, points: 0, feedback: badFb },
  ];
}

/** Alternate scenario sets (sets 2–4). Set 1 is the rich base set in corporate-base-scenarios.ts */
export const ALT_SCENARIO_POOLS: Record<CorporateGameSlug, LegacyGameScenario[][]> = {
  "cybersecurity-escape": [
    [
      {
        id: "phish-b1",
        phase: "Spear phishing",
        prompt: "CEO emails you from a personal Gmail asking for an urgent wire transfer. Action?",
        context: '"Need $50k sent today — in meetings all day. Reply only here."',
        options: o(
          "Verify via known phone number and report to security",
          "CEO fraud uses urgency and alternate channels. Always verify out-of-band.",
          "Reply to the Gmail asking for more details",
          "Engaging the attacker confirms your email is active.",
          "Process the transfer — it's the CEO",
          "Authority impersonation is a top BEC tactic. Never wire on email alone."
        ),
      },
      {
        id: "vuln-b1",
        phase: "Cloud misconfiguration",
        prompt: "You find a public S3 bucket listing customer records in a dev environment.",
        options: o(
          "Restrict access immediately and open a security incident ticket",
          "Exposed PII requires rapid containment and incident response.",
          "Download a copy for your records first",
          "Copying data may violate policy and contaminate evidence.",
          "Assume dev data is fake and ignore it",
          "Dev environments often contain real data snapshots. Treat as production risk."
        ),
      },
      {
        id: "puzzle-b1",
        phase: "Password policy",
        prompt: "A vendor portal requires a 6-character password with no MFA. You need access today.",
        options: o(
          "Use a unique generated password, enable MFA if offered, and flag weak policy to procurement",
          "Unique credentials limit blast radius; escalate weak vendor controls.",
          "Reuse your corporate password for speed",
          "Password reuse lets one breach compromise multiple systems.",
          "Share the team login in Slack",
          "Shared credentials remove accountability and violate policy."
        ),
      },
      {
        id: "phish-b2",
        phase: "Smishing",
        prompt: "SMS: 'Your package failed delivery. Click link to reschedule.' You weren't expecting a package.",
        options: o(
          "Delete and report — unexpected delivery links are smishing",
          "Smishing mimics carriers to steal credentials or install malware.",
          "Click to see which package it is",
          "Curiosity clicks are how smishing succeeds.",
          "Forward to friends as a warning with the link included",
          "Forwarding malicious links spreads the attack."
        ),
      },
    ],
    [
      {
        id: "phish-c1",
        phase: "QR code phishing",
        prompt: "A poster in the break room has a QR code: 'Scan for free lunch vouchers.'",
        options: o(
          "Report to facilities/security — QR codes can redirect to phishing sites",
          "Quishing exploits trust in physical spaces. Verify with official comms.",
          "Scan it — lunch vouchers are harmless",
          "Malicious QR codes can capture device access or credentials.",
          "Print your own QR over it as a joke",
          "Tampering creates confusion and doesn't fix the security risk."
        ),
      },
      {
        id: "vuln-c1",
        phase: "USB drop",
        prompt: "You find a labelled USB drive in the parking lot: 'Q4 Salaries — Confidential'.",
        options: o(
          "Hand it to security without plugging it in",
          "USB drops are a classic attack vector for malware installation.",
          "Plug it into your work laptop in a VM",
          "Even VMs can have escape vulnerabilities. Never plug unknown USBs.",
          "Take it home to check on a personal PC",
          "Personal devices may sync to cloud and spread malware."
        ),
      },
      {
        id: "puzzle-c1",
        phase: "VPN alert",
        prompt: "Pop-up says your VPN certificate expired and asks you to re-authenticate via a new link.",
        options: o(
          "Close the pop-up and connect through the official VPN client only",
          "Fake VPN prompts harvest credentials. Use approved software paths.",
          "Enter credentials in the pop-up to restore access quickly",
          "Credential harvesting pages mimic corporate branding.",
          "Disable antivirus so the VPN can install",
          "Disabling protections is never a legitimate IT request."
        ),
      },
      {
        id: "phish-c2",
        phase: "Voice phishing",
        prompt: "Caller claims to be IT and asks you to read your authenticator code aloud.",
        options: o(
          "Hang up and report via the official IT helpdesk number",
          "Vishing uses live calls to bypass email filters. Verify through known channels.",
          "Read the code — IT needs it to fix your account",
          "No legitimate IT team requests live MFA codes.",
          "Give them your employee ID instead",
          "Partial info still aids social engineering attacks."
        ),
      },
    ],
    [
      {
        id: "phish-d1",
        phase: "Calendar invite",
        prompt: "Unknown sender invites you to 'Mandatory Security Training' with a link to join.",
        options: o(
          "Decline, report phishing, and use the official LMS for training",
          "Malicious calendar invites bypass some email filters.",
          "Accept to see what the training covers",
          "Accepting may confirm your address and expose calendar metadata.",
          "Forward invite to your whole team",
          "Mass forwarding amplifies phishing reach."
        ),
      },
      {
        id: "vuln-d1",
        phase: "Tailgating",
        prompt: "Someone without a badge follows you through the secure door carrying boxes.",
        options: o(
          "Politely stop them and direct to reception for badge issuance",
          "Tailgating defeats physical access controls.",
          "Hold the door — they look like delivery staff",
          "Appearance is not authentication. Verify every entry.",
          "Ignore it — not your job",
          "Security culture is everyone's responsibility."
        ),
      },
      {
        id: "puzzle-d1",
        phase: "Wi-Fi risk",
        prompt: "At a café you see 'CorpGuest-Free-WiFi' with no password while travelling.",
        options: o(
          "Use corporate VPN on trusted cellular or verified hotel Wi-Fi only",
          "Evil twin hotspots capture traffic and credentials.",
          "Connect without VPN for faster email",
          "Unencrypted public Wi-Fi exposes session tokens.",
          "Turn off MFA since the network is slow",
          "MFA is especially important on untrusted networks."
        ),
      },
      {
        id: "phish-d2",
        phase: "Attachment scam",
        prompt: "HR email with 'Updated Benefits.pdf.exe' from hr-benefits-update@external-mail.com",
        options: o(
          "Quarantine and report — double extension and external domain are red flags",
          "Executable disguised as PDF is a common malware delivery method.",
          "Rename the file to .pdf and open it",
          "Renaming doesn't remove executable content.",
          "Reply asking HR to resend",
          "Replying confirms your mailbox is active to attackers."
        ),
      },
    ],
  ],
  "compliance-detective": [
    [
      {
        id: "comp-b1",
        phase: "Gift policy",
        prompt: "A vendor offers front-row sports tickets worth $800 after you approve their contract.",
        options: o(
          "Decline and disclose per gifts & entertainment policy",
          "High-value gifts can constitute bribery and audit violations.",
          "Accept but don't tell anyone",
          "Undisclosed gifts breach ethics codes and SOX controls.",
          "Accept and split with the team",
          "Sharing doesn't reduce compliance risk — disclosure is required."
        ),
      },
      {
        id: "comp-b2",
        phase: "Data retention",
        prompt: "Legal hold is active but a manager asks you to delete old customer emails to free storage.",
        options: o(
          "Refuse and escalate to Legal — hold overrides routine deletion",
          "Destroying hold data creates spoliation liability.",
          "Delete emails older than 30 days as usual",
          "Routine retention policies pause during legal holds.",
          "Export to personal drive then delete from server",
          "Circumventing holds via personal storage is a serious violation."
        ),
      },
      {
        id: "comp-b3",
        phase: "Insider trading",
        prompt: "You learn of an unpublished acquisition in a leadership meeting. A friend asks if they should buy stock.",
        options: o(
          "Decline to discuss and remind yourself of MNPI policies",
          "Material non-public information trading is illegal.",
          "Hint that 'good things are coming' without details",
          "Even vague tips can constitute insider trading facilitation.",
          "Tell them to buy — they'll find out soon anyway",
          "Trading on MNPI carries criminal and civil penalties."
        ),
      },
      {
        id: "comp-b4",
        phase: "Whistleblower",
        prompt: "You overhear falsified safety test results being discussed. What first?",
        options: o(
          "Report through ethics hotline with factual notes, no confrontation",
          "Protected reporting channels exist for exactly this scenario.",
          "Confront the engineers in the hallway",
          "Confrontation can alert wrongdoers to destroy evidence.",
          "Post anonymously on social media",
          "Public posts may violate policy and harm investigations."
        ),
      },
    ],
    [
      {
        id: "comp-c1",
        phase: "Conflict of interest",
        prompt: "You're asked to evaluate a vendor owned by your cousin.",
        options: o(
          "Disclose relationship and recuse from the decision",
          "Undisclosed conflicts undermine fair procurement.",
          "Rate them highly — family businesses are reliable",
          "Personal relationships bias objective evaluation.",
          "Hide the relationship — no one will know",
          "Concealed conflicts are a top audit finding."
        ),
      },
      {
        id: "comp-c2",
        phase: "Export controls",
        prompt: "A overseas client requests technical docs that may include controlled encryption details.",
        options: o(
          "Route request through export compliance for classification review",
          "Export regulations restrict technology transfer by country.",
          "Email the full documentation — they are a paying client",
          "Unauthorized export can trigger government penalties.",
          "Send a redacted version without checking",
          "Self-redaction without review still risks violations."
        ),
      },
      {
        id: "comp-c3",
        phase: "Anti-bribery",
        prompt: "Local agent insists a 'facilitation payment' is required to release shipped goods.",
        options: o(
          "Escalate to Legal/Compliance — facilitation payments may violate FCPA",
          "Even small payments to officials can be illegal in many jurisdictions.",
          "Pay in cash to avoid delays",
          "Cash payments without documentation are audit and legal risks.",
          "Ask another employee to pay so it's not on you",
          "Routing prohibited payments through others is still a violation."
        ),
      },
      {
        id: "comp-c4",
        phase: "Record keeping",
        prompt: "Sales wants to keep deal terms only in WhatsApp to 'move faster.'",
        options: o(
          "Insist on CRM/contracts per record-keeping policy",
          "Off-channel deals create discovery and revenue recognition risk.",
          "Agree — speed matters more than paperwork",
          "Informal records fail audits and dispute resolution.",
          "Delete chats after deals close",
          "Destroying business records may violate retention rules."
        ),
      },
    ],
    [
      {
        id: "comp-d1",
        phase: "Accessibility",
        prompt: "Marketing launches a campaign video with no captions despite ADA-related complaints.",
        options: o(
          "Pause launch until captions and accessibility review complete",
          "Accessibility gaps create legal exposure and exclude users.",
          "Ship now and add captions if someone complains again",
          "Reactive fixes still leave a window of non-compliance.",
          "Say captions aren't needed for B2B products",
          "Accessibility requirements apply broadly, not only B2C."
        ),
      },
      {
        id: "comp-d2",
        phase: "Vendor due diligence",
        prompt: "A cheap cloud vendor has no SOC 2 report but offers 50% savings.",
        options: o(
          "Require security questionnaire and risk acceptance from InfoSec",
          "Vendor risk must be assessed before handling company data.",
          "Sign immediately — savings justify the risk",
          "Cost savings don't offset breach liability.",
          "Use them only for non-production then migrate prod quietly",
          "Shadow production use violates vendor management policy."
        ),
      },
      {
        id: "comp-d3",
        phase: "Workplace safety",
        prompt: "Employees report blocked fire exits due to stored boxes.",
        options: o(
          "Clear exits immediately and report to facilities/safety officer",
          "Blocked egress violates safety codes and endangers lives.",
          "Wait until next week's cleanup schedule",
          "Safety hazards require immediate remediation.",
          "Move boxes to another hallway exit",
          "Moving the hazard doesn't solve egress compliance."
        ),
      },
      {
        id: "comp-d4",
        phase: "Privacy request",
        prompt: "A customer emails asking for all personal data deleted under privacy law.",
        options: o(
          "Log request in privacy system and follow verified deletion workflow",
          "Regulated deletion requests have defined timelines and verification.",
          "Delete their account manually in 5 minutes",
          "Ad-hoc deletion may miss backups and third-party processors.",
          "Ignore — email might be spam",
          "Unanswered privacy requests can trigger regulatory fines."
        ),
      },
    ],
  ],
  "customer-service": [
    [
      {
        id: "cs-b1",
        phase: "Billing dispute",
        prompt: "Customer claims double charge but your system shows one payment.",
        options: o(
          "Review payment logs with them, acknowledge frustration, and open a billing investigation",
          "Transparent investigation builds trust even when systems disagree.",
          "Insist the system is never wrong",
          "Dismissing customers escalates complaints and churn.",
          "Offer refund without checking",
          "Unauthorized refunds create financial leakage."
        ),
      },
      {
        id: "cs-b2",
        phase: "Language barrier",
        prompt: "Caller struggles with English describing a technical outage.",
        options: o(
          "Slow down, use simple words, offer chat translation or callback with bilingual agent",
          "Inclusive support improves resolution and CSAT.",
          "Transfer to hold repeatedly until they give up",
          "Avoidance tactics destroy satisfaction scores.",
          "Tell them to email instead and hang up",
          "Abandoning callers violates service standards."
        ),
      },
      {
        id: "cs-b3",
        phase: "Social media complaint",
        prompt: "Tweet: '@YourCompany ruined my wedding photos — storage failed!'",
        options: o(
          "Reply publicly with empathy, move to DM, and escalate to technical support",
          "Public empathy + private resolution protects brand and CSAT.",
          "Reply publicly that they're lying",
          "Defensive public replies go viral for the wrong reasons.",
          "Ignore social media — not a real channel",
          "Social complaints influence prospects and retention."
        ),
      },
      {
        id: "cs-b4",
        phase: "Repeat caller",
        prompt: "Third call this week about the same unresolved ticket. Customer is exhausted.",
        options: o(
          "Take ownership, summarise history, set concrete next step with timeline",
          "Ownership and clarity restore confidence after repeated failures.",
          "Tell them to keep waiting — engineering is busy",
          "Vague delays increase churn and negative reviews.",
          "Create a duplicate ticket to reset SLA",
          "Gaming SLAs erodes trust and internal metrics integrity."
        ),
      },
    ],
    [
      {
        id: "cs-c1",
        phase: "Product outage",
        prompt: "Platform is down during customer's board presentation.",
        options: o(
          "Apologise, confirm incident status, offer live bridge with support lead",
          "High-stakes moments need senior attention and transparency.",
          "Say it's probably their internet",
          "Blame deflects accountability during outages.",
          "Promise compensation you can't approve",
          "Unauthorized promises create legal and finance issues."
        ),
      },
      {
        id: "cs-c2",
        phase: "Abusive language",
        prompt: "Customer uses slurs after a shipping delay.",
        options: o(
          "Set respectful boundary, focus on solving issue, involve supervisor if abuse continues",
          "De-escalation with boundaries protects agents and may retain customers.",
          "Hang up immediately without warning",
          "Abrupt termination without policy steps may violate guidelines.",
          "Respond with matching hostility",
          "Escalation loops damage brand and agent wellbeing."
        ),
      },
      {
        id: "cs-c3",
        phase: "Wrong item",
        prompt: "Customer received a cheaper item than ordered — wants upgrade kept free.",
        options: o(
          "Arrange prepaid return of wrong item and expedite correct shipment",
          "Fair resolution within policy maintains satisfaction.",
          "Let them keep both as goodwill without approval",
          "Inventory shrink without approval is a compliance issue.",
          "Blame warehouse and end chat",
          "Passing blame without resolution fails CS goals."
        ),
      },
      {
        id: "cs-c4",
        phase: "Loyalty request",
        prompt: "10-year customer asks for legacy pricing after plan increase.",
        options: o(
          "Review loyalty options, explain changes, offer retention discount if eligible",
          "Retention offers within authority protect long-term value.",
          "Refuse — new prices apply to everyone",
          "Rigid responses push loyal customers to competitors.",
          "Promise lifetime old pricing verbally",
          "Undocumented promises create billing disputes."
        ),
      },
    ],
    [
      {
        id: "cs-d1",
        phase: "Accessibility need",
        prompt: "Blind customer can't complete checkout with screen reader.",
        options: o(
          "Assist completing order by phone and file accessibility bug with priority",
          "Immediate help plus root-cause fix serves CS and compliance.",
          "Suggest they ask a friend to order for them",
          "Shifting burden excludes customers and may violate accessibility law.",
          "Say the site works fine on your computer",
          "Dismissing assistive technology reports damages trust."
        ),
      },
      {
        id: "cs-d2",
        phase: "Subscription cancel",
        prompt: "Customer wants to cancel but mentions financial hardship.",
        options: o(
          "Explore pause/downgrade options and empathetic cancellation if no fit",
          "Flexible options reduce churn and protect brand reputation.",
          "Use aggressive save tactics and hidden fees",
          "Dark patterns create chargebacks and public backlash.",
          "Cancel silently but keep billing",
          "Continued billing after cancel request is fraud."
        ),
      },
      {
        id: "cs-d3",
        phase: "Enterprise SLA",
        prompt: "Enterprise client threatens contract exit over missed 99.9% SLA last month.",
        options: o(
          "Pull SLA report, acknowledge gap, present remediation and service credit per contract",
          "Data-driven accountability preserves enterprise relationships.",
          "Deny SLA breach without data",
          "Denial without evidence erodes enterprise trust.",
          "Offer personal gifts to the buyer",
          "Gifts to decision-makers may violate ethics policies."
        ),
      },
      {
        id: "cs-d4",
        phase: "Chatbot handoff",
        prompt: "Bot gave wrong return address; customer already shipped package.",
        options: o(
          "Intercept package if possible, cover reship costs per policy, fix bot knowledge base",
          "Full recovery plus KB fix prevents repeat failures.",
          "Tell customer it's their fault for trusting the bot",
          "Blaming customers guarantees public complaints.",
          "Close ticket — package is in transit",
          "Unresolved misroutes destroy satisfaction and increase cost."
        ),
      },
    ],
  ],
  "sales-negotiation": [
    [
      {
        id: "sales-b1",
        phase: "Price objection",
        prompt: "Prospect says competitor is 30% cheaper for similar features.",
        options: o(
          "Compare value drivers, implementation cost, and TCO — offer phased scope",
          "Value selling addresses price gaps with evidence.",
          "Match price immediately without approval",
          "Unapproved discounting erodes margin and credibility.",
          "Attack competitor's product quality publicly",
          "Negative selling damages your professional reputation."
        ),
      },
      {
        id: "sales-b2",
        phase: "Procurement gate",
        prompt: "Procurement demands 60-day payment terms and unlimited liability cap removal.",
        options: o(
          "Trade terms for scope, liability limits, and executive sponsor alignment",
          "Structured give-get preserves deal economics.",
          "Accept all terms to get signature this quarter",
          "One-sided concessions set bad precedent.",
          "Walk away without counterproposal",
          "Premature walk-away loses deals that could close with trade-offs."
        ),
      },
      {
        id: "sales-b3",
        phase: "Technical buyer",
        prompt: "Engineering lead wants API docs and security review before any commercial talk.",
        options: o(
          "Provide technical pack, schedule architecture review, align on success criteria",
          "Technical buyers need proof before commercial discussions.",
          "Push for contract signature first",
          "Skipping technical validation stalls enterprise deals.",
          "Send marketing brochure only",
          "Generic materials don't satisfy technical diligence."
        ),
      },
      {
        id: "sales-b4",
        phase: "Stalled deal",
        prompt: "Champion went silent after strong demo 3 weeks ago.",
        options: o(
          "Multi-thread: reach ops/finance, share relevant case study, propose bounded pilot",
          "Multi-threading reduces single-point-of-failure risk.",
          "Send daily 'just checking in' emails",
          "Low-value follow-ups train buyers to ignore you.",
          "Assume deal is dead and remove from pipeline",
          "Silent champions often need internal alignment help."
        ),
      },
    ],
    [
      {
        id: "sales-c1",
        phase: "Budget freeze",
        prompt: "CFO announces hiring and vendor freeze mid-cycle.",
        options: o(
          "Reframe as cost-avoidance ROI, propose deferred start, seek smaller land deal",
          "Budget freezes still fund high-ROI priorities.",
          "Demand they sign before freeze takes effect",
          "Pressure during freezes damages relationships.",
          "Stop all communication until next fiscal year",
          "Disengagement lets competitors fill the vacuum."
        ),
      },
      {
        id: "sales-c2",
        phase: "Multi-stakeholder",
        prompt: "Legal approves, IT blocks integration timeline.",
        options: o(
          "Facilitate joint workshop mapping integration phases and shared milestones",
          "Cross-functional alignment unblocks enterprise deals.",
          "Sell around IT to the business sponsor only",
          "Bypassing IT creates implementation failure risk.",
          "Offer to integrate without IT involvement",
          "Shadow IT deals collapse at deployment."
        ),
      },
      {
        id: "sales-c3",
        phase: "Pilot request",
        prompt: "Buyer wants 6-month free pilot with full enterprise features.",
        options: o(
          "Offer time-boxed paid pilot with success metrics and conversion path",
          "Bounded pilots protect value and qualify intent.",
          "Agree to free unlimited pilot",
          "Extended free pilots signal low commitment and drain resources.",
          "Refuse any trial whatsoever",
          "Rigid no-trial policies lose evaluative buyers."
        ),
      },
      {
        id: "sales-c4",
        phase: "Last look",
        prompt: "Prospect asks for 'best and final' but you know two vendors remain.",
        options: o(
          "Submit disciplined final offer with clear expiration and mutual close plan",
          "Final offers need deadlines and defined decision process.",
          "Undercut by 50% without executive approval",
          "Desperation pricing trains buyers to always squeeze.",
          "Refuse to participate in final round",
          "Withdrawal without strategy forfeits winnable deals."
        ),
      },
    ],
    [
      {
        id: "sales-d1",
        phase: "Upsell moment",
        prompt: "Happy customer on basic tier needs features only in premium.",
        options: o(
          "Demonstrate premium ROI on their metrics and offer upgrade path with training",
          "Value-based upsell during success moments converts naturally.",
          "Enable premium features without contract change",
          "Unauthorized feature access creates revenue leakage.",
          "Ignore — they're fine on basic",
          "Unaddressed needs invite competitor upsell."
        ),
      },
      {
        id: "sales-d2",
        phase: "Global rollout",
        prompt: "HQ in US wants global deal but EU subsidiary demands local DPA.",
        options: o(
          "Coordinate global framework with regional DPAs and local currency terms",
          "Global deals need regional compliance packages.",
          "Send US contract to EU entity only",
          "Ignoring regional compliance blocks signature and creates GDPR risk.",
          "Let each country negotiate alone without coordination",
          "Fragmented negotiations delay rollout and confuse pricing."
        ),
      },
      {
        id: "sales-d3",
        phase: "Reference request",
        prompt: "Prospect wants customer reference but your best reference is a competitor's client.",
        options: o(
          "Offer anonymised case study + reference call with similar industry client",
          "Curated references within policy still build credibility.",
          "Fabricate a reference customer",
          "False references destroy trust and may be fraudulent.",
          "Refuse any reference request",
          "Over-restriction slows enterprise trust building."
        ),
      },
      {
        id: "sales-d4",
        phase: "Renewal risk",
        prompt: "Renewal in 30 days; usage dropped 40% after champion left.",
        options: o(
          "Conduct value review, identify new champion, propose success plan before renewal",
          "Proactive value recovery saves renewals after champion loss.",
          "Auto-renew without conversation",
          "Silent renewals fail when value isn't demonstrated.",
          "Threaten service cutoff to force renewal",
          "Coercion damages long-term account health."
        ),
      },
    ],
  ],
  "leadership-challenge": [
    [
      {
        id: "lead-b1",
        phase: "Underperformer",
        prompt: "A team member misses deadlines but is well-liked socially.",
        options: o(
          "Private performance conversation with clear expectations and support plan",
          "Direct feedback with support balances fairness and morale.",
          "Ignore misses to preserve team harmony",
          "Avoidance hurts team output and high performers.",
          "Publicly call them out in standup",
          "Public shaming destroys psychological safety."
        ),
      },
      {
        id: "lead-b2",
        phase: "Hiring decision",
        prompt: "Two finalists: one skilled but poor culture fit, one junior but high growth.",
        options: o(
          "Use structured scorecard weighting skills, values, and role requirements",
          "Structured hiring reduces bias and mis-hires.",
          "Hire the friend of a director",
          "Nepotism undermines team trust and diversity goals.",
          "Flip a coin — both are fine",
          "Critical hires need evidence-based decisions."
        ),
      },
      {
        id: "lead-b3",
        phase: "Feedback upward",
        prompt: "Your skip-level asks for unfiltered feedback on your VP's strategy.",
        options: o(
          "Share constructive observations with examples; offer to discuss with your manager first",
          "Thoughtful upward feedback respects chain while being honest.",
          "Vent all frustrations anonymously",
          "Unconstructive venting damages your credibility.",
          "Praise everything to stay safe",
          "Fake positivity prevents organisational learning."
        ),
      },
      {
        id: "lead-b4",
        phase: "Recognition",
        prompt: "Team shipped a major release but only leads were praised in company all-hands.",
        options: o(
          "Correct recognition in team channel and ask comms to credit contributors",
          "Equitable recognition sustains motivation and retention.",
          "Say nothing — leads deserve the spotlight",
          "Selective praise breeds resentment on teams.",
          "Complain bitterly in public Slack",
          "Public bitterness undermines your leadership brand."
        ),
      },
    ],
    [
      {
        id: "lead-c1",
        phase: "Ethics pressure",
        prompt: "Sales leader asks you to backdate a contract to hit quarterly quota.",
        options: o(
          "Refuse and escalate to Legal/Finance — backdating is fraudulent",
          "Revenue recognition integrity overrides short-term targets.",
          "Backdate quietly — it's a small change",
          "Fraud exposes the company and you personally to liability.",
          "Quit on the spot without reporting",
          "Leaving without escalation may let misconduct continue."
        ),
      },
      {
        id: "lead-c2",
        phase: "Diversity tension",
        prompt: "Interview panel wants to skip diverse candidate because 'culture fit.'",
        options: o(
          "Re-center on competencies, mitigate bias, ensure diverse panel participation",
          "Bias challenges require process discipline, not gut feel.",
          "Agree — culture fit is most important",
          "Vague culture fit often masks homogeneity bias.",
          "Cancel interviews for all candidates",
          "Avoidance doesn't fix systemic hiring issues."
        ),
      },
      {
        id: "lead-c3",
        phase: "Delegation",
        prompt: "You're overwhelmed but hesitate to delegate critical client work.",
        options: o(
          "Delegate with clear outcomes, checkpoints, and coaching time",
          "Structured delegation develops team and scales leadership.",
          "Work 80-hour weeks indefinitely",
          "Unsustainable heroics cause burnout and bottlenecks.",
          "Dump tasks without context Friday at 5pm",
          "Drive-by delegation sets up failure and resentment."
        ),
      },
      {
        id: "lead-c4",
        phase: "Change resistance",
        prompt: "Team resists new agile process after years of waterfall.",
        options: o(
          "Co-create rollout, pilot with volunteers, share early wins and training",
          "Participatory change management reduces resistance.",
          "Mandate compliance with threats",
          "Fear-based mandates breed quiet sabotage.",
          "Abandon change after first complaint",
          "Abandoning change confirms cynicism about leadership."
        ),
      },
    ],
    [
      {
        id: "lead-d1",
        phase: "Succession",
        prompt: "Your top performer wants your role but you're not leaving soon.",
        options: o(
          "Discuss career paths, stretch assignments, and transparent timeline",
          "Honest career conversations retain ambitious talent.",
          "Tell them to stop aiming for your job",
          "Blocking ambition drives top talent away.",
          "Promise promotion by a date you can't control",
          "False promises destroy trust when missed."
        ),
      },
      {
        id: "lead-d2",
        phase: "Cross-team conflict",
        prompt: "Your team blames another team for missed launch.",
        options: o(
          "Facilitate blameless postmortem focused on system fixes",
          "Blameless reviews improve cross-team collaboration.",
          "Escalate war with their manager publicly",
          "Public blame wars harm both teams' reputations.",
          "Take all blame to protect your team",
          "False ownership prevents root-cause fixes."
        ),
      },
      {
        id: "lead-d3",
        phase: "Remote fairness",
        prompt: "In-office staff get more visibility with executives than remote staff.",
        options: o(
          "Rotate exec updates, document decisions async, equalize high-visibility projects",
          "Intentional inclusion prevents remote career penalties.",
          "Require everyone back to office immediately",
          "Forced RTO without dialogue damages retention.",
          "Ignore — remote staff should adapt",
          "Unaddressed proximity bias erodes engagement."
        ),
      },
      {
        id: "lead-d4",
        phase: "Crisis comms",
        prompt: "Data breach rumor spreading internally before official statement.",
        options: o(
          "Coordinate with comms/legal, share verified facts quickly, designate Q&A channel",
          "Timely accurate internal comms reduce panic and leaks.",
          "Tell team to say nothing and speculate is fine",
          "Information vacuums fill with harmful rumors.",
          "Confirm unverified details to seem transparent",
          "Premature confirmation can be legally and PR damaging."
        ),
      },
    ],
  ],
  "project-management": [
    [
      {
        id: "pm-b1",
        phase: "Scope creep",
        prompt: "Stakeholder adds 'small' features daily without change control.",
        options: o(
          "Introduce change request process with impact on timeline/budget",
          "Formal change control protects delivery commitments.",
          "Accept everything to keep stakeholder happy",
          "Uncontrolled scope guarantees missed deadlines.",
          "Ignore new requests silently",
          "Silent ignore breeds stakeholder mistrust."
        ),
      },
      {
        id: "pm-b2",
        phase: "Vendor delay",
        prompt: "Critical API vendor slips 2 weeks; launch in 10 days.",
        options: o(
          "Activate contingency: mock service, descope, or parallel vendor path",
          "Contingency plans turn delays into managed risks.",
          "Hope they deliver on original date",
          "Hope is not a project strategy.",
          "Blame vendor in client email without plan",
          "Blame without mitigation damages client confidence."
        ),
      },
      {
        id: "pm-b3",
        phase: "Team velocity",
        prompt: "Velocity dropped 30% after two seniors left.",
        options: o(
          "Re-baseline sprint, prioritize knowledge transfer, request backfill or scope cut",
          "Capacity-based re-planning sets realistic expectations.",
          "Keep original commitment dates",
          "Ignoring capacity data sets teams up to fail.",
          "Mandate overtime for the whole quarter",
          "Sustained overtime reduces quality and increases attrition."
        ),
      },
      {
        id: "pm-b4",
        phase: "Stakeholder alignment",
        prompt: "Marketing and Engineering disagree on launch feature set.",
        options: o(
          "Facilitate prioritisation workshop against shared business goals",
          "Aligned prioritisation resolves cross-functional conflict.",
          "Let loudest stakeholder win",
          "Volume-based decisions optimize politics, not outcomes.",
          "Split into two launches without coordination",
          "Uncoordinated launches confuse customers and support."
        ),
      },
    ],
    [
      {
        id: "pm-c1",
        phase: "Budget overrun",
        prompt: "Project at 80% budget with 50% work remaining.",
        options: o(
          "Forecast EAC, present options to sponsors: scope cut, funds, or timeline",
          "Transparent forecasting enables sponsor decisions.",
          "Hide overrun until project end",
          "Surprise overruns destroy stakeholder trust.",
          "Cut QA to save money immediately",
          "QA cuts increase costly post-launch defects."
        ),
      },
      {
        id: "pm-c2",
        phase: "Quality gate",
        prompt: "QA reports P1 defects; business insists on launch for conference demo.",
        options: o(
          "Present defect severity, demo-only build option, and full GA date",
          "Separated demo vs GA paths balance risk and marketing needs.",
          "Launch full product with known P1s",
          "P1 defects at launch damage brand and support load.",
          "Cancel conference demo entirely",
          "Cancellation without alternatives wastes marketing investment."
        ),
      },
      {
        id: "pm-c3",
        phase: "Distributed team",
        prompt: "APAC team consistently misses handoffs to US team.",
        options: o(
          "Adjust overlap hours, clarify Definition of Ready/Done, improve async docs",
          "Process and timezone design fix handoff failures.",
          "Blame APAC work ethic in retros",
          "Cultural blame destroys psychological safety.",
          "Move all work to US-only hours",
          "Ignoring APAC capacity burns out one region."
        ),
      },
      {
        id: "pm-c4",
        phase: "Risk materialized",
        prompt: "Key subcontractor declares bankruptcy mid-project.",
        options: o(
          "Execute vendor risk plan: legal review, alternate supplier, timeline rebaseline",
          "Pre-identified risk responses minimize panic decisions.",
          "Pause project indefinitely",
          "Indefinite pause wastes sunk costs and stakeholder confidence.",
          "Continue paying bankrupt vendor",
          "Payments without deliverables need legal/finance guidance."
        ),
      },
    ],
    [
      {
        id: "pm-d1",
        phase: "Agile ceremony",
        prompt: "Sprint planning consistently runs 4 hours with no clear sprint goal.",
        options: o(
          "Timebox prep, enforce sprint goal, use backlog refinement separately",
          "Ceremony discipline improves predictability.",
          "Cancel planning — team knows what to do",
          "Without goals, sprints lack focus and measurable outcomes.",
          "Extend meetings until everything is perfect",
          "Perfectionism in planning delays all delivery."
        ),
      },
      {
        id: "pm-d2",
        phase: "Dependencies",
        prompt: "Your project depends on another team's API due Friday; they're at risk.",
        options: o(
          "Escalate dependency risk early, define MVP without API, daily sync with partner team",
          "Early escalation and decoupling protect critical path.",
          "Wait until Friday to see if they deliver",
          "Last-minute surprises compress quality and stress teams.",
          "Publicly shame partner team in status report",
          "Public shaming harms cross-team relationships."
        ),
      },
      {
        id: "pm-d3",
        phase: "Documentation",
        prompt: "Team skips docs to 'move fast'; support is flooded post-launch.",
        options: o(
          "Add docs/runbooks to Definition of Done for customer-facing work",
          "Operational readiness is part of delivery, not overhead.",
          "Hire more support staff and keep skipping docs",
          "Scaling support without fixes doesn't address root cause.",
          "Blame support for not knowing the product",
          "Internal blame loops don't improve delivery quality."
        ),
      },
      {
        id: "pm-d4",
        phase: "Executive demo",
        prompt: "CEO wants live demo of unfinished feature in 48 hours.",
        options: o(
          "Propose stable demo script on staging with known limitations disclosed",
          "Controlled demos manage executive expectations safely.",
          "Demo production with feature flags untested",
          "Untested demos risk public failures.",
          "Refuse any executive interaction",
          "Disengagement from executives reduces project air cover."
        ),
      },
    ],
  ],
};
