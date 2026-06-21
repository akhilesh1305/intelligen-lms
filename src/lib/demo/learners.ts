import { DEMO_LEARNER_NAME, DEMO_ORGANIZATION } from "./brand";
import { seededInt } from "./seed";

export type DemoLearner = {
  id: string;
  name: string;
  avatarSeed: string;
  avatarHue: number;
  xp: number;
  progressPercent: number;
  certificatesEarned: number;
  quizzesCompleted: number;
  gamesCompleted: number;
  badges: string[];
  department?: string;
};

const BADGE_POOL = ["🎯", "🔥", "⭐", "🏆", "📚", "🧠", "💡", "🛡️", "📊", "🚀"];

/** Named Acme Corporation employees — anchors leaderboard and analytics demos. */
const ACME_TEAM: Array<{
  name: string;
  department: string;
  xp: number;
  progressPercent: number;
  certificatesEarned: number;
  quizzesCompleted: number;
  gamesCompleted: number;
  badges: string[];
}> = [
  {
    name: "Marcus Rivera",
    department: DEMO_ORGANIZATION.department,
    xp: 4850,
    progressPercent: 94,
    certificatesEarned: 3,
    quizzesCompleted: 26,
    gamesCompleted: 14,
    badges: ["🏆", "🔥", "📊"],
  },
  {
    name: "Emily Parker",
    department: DEMO_ORGANIZATION.department,
    xp: 4120,
    progressPercent: 88,
    certificatesEarned: 2,
    quizzesCompleted: 22,
    gamesCompleted: 11,
    badges: ["⭐", "🧠", "🎯"],
  },
  {
    name: DEMO_LEARNER_NAME,
    department: DEMO_ORGANIZATION.department,
    xp: 3840,
    progressPercent: 76,
    certificatesEarned: 2,
    quizzesCompleted: 18,
    gamesCompleted: 8,
    badges: ["🧠", "🏆", "🔥"],
  },
  {
    name: "David Okonkwo",
    department: "Customer Success",
    xp: 3620,
    progressPercent: 81,
    certificatesEarned: 2,
    quizzesCompleted: 16,
    gamesCompleted: 9,
    badges: ["📚", "💡"],
  },
  {
    name: "Rachel Kim",
    department: DEMO_ORGANIZATION.department,
    xp: 3480,
    progressPercent: 72,
    certificatesEarned: 1,
    quizzesCompleted: 15,
    gamesCompleted: 7,
    badges: ["🎯", "🛡️"],
  },
  {
    name: "James Whitfield",
    department: "Engineering",
    xp: 3210,
    progressPercent: 68,
    certificatesEarned: 2,
    quizzesCompleted: 14,
    gamesCompleted: 10,
    badges: ["🛡️", "📊"],
  },
  {
    name: "Nina Patel",
    department: "Marketing",
    xp: 2980,
    progressPercent: 64,
    certificatesEarned: 1,
    quizzesCompleted: 12,
    gamesCompleted: 6,
    badges: ["🔥", "⭐"],
  },
  {
    name: "Chris Brennan",
    department: DEMO_ORGANIZATION.department,
    xp: 2750,
    progressPercent: 59,
    certificatesEarned: 1,
    quizzesCompleted: 11,
    gamesCompleted: 5,
    badges: ["📚"],
  },
  {
    name: "Olivia Martinez",
    department: "People Operations",
    xp: 2540,
    progressPercent: 55,
    certificatesEarned: 1,
    quizzesCompleted: 10,
    gamesCompleted: 4,
    badges: ["💡", "🎯"],
  },
  {
    name: "Tyler Hughes",
    department: "Finance",
    xp: 2310,
    progressPercent: 48,
    certificatesEarned: 0,
    quizzesCompleted: 8,
    gamesCompleted: 3,
    badges: ["📊"],
  },
];

const EXTENDED_FIRST = [
  "Amanda", "Brian", "Catherine", "Derek", "Fiona", "Greg", "Hannah", "Ian",
  "Julia", "Kevin", "Laura", "Megan", "Nathan", "Paula", "Quinn", "Ryan",
  "Sophie", "Thomas", "Uma", "Victor", "Wendy", "Xavier", "Yolanda", "Zach",
  "Alice", "Ben", "Claire", "Daniel", "Eva", "Frank", "Grace", "Henry",
  "Isabel", "Jack", "Kate", "Liam", "Mia", "Noah", "Paige", "Reed",
  "Sasha", "Trevor", "Ursula", "Vince", "Willa", "Xander",
];

const EXTENDED_LAST = [
  "Anderson", "Brooks", "Campbell", "Diaz", "Edwards", "Foster", "Graham",
  "Hayes", "Ingram", "Jensen", "Keller", "Lopez", "Mitchell", "Nelson",
  "Owens", "Price", "Quinn", "Reed", "Stewart", "Turner", "Underwood",
  "Vaughn", "Wallace", "Young", "Zimmerman", "Adams", "Baker", "Clark",
  "Davis", "Evans", "Fisher", "Green", "Harris", "Irving", "Jackson",
  "King", "Lewis", "Moore", "Nguyen", "O'Brien", "Perry", "Roberts",
  "Scott", "Taylor", "Walker", "Wright",
];

const DEPARTMENTS = [
  DEMO_ORGANIZATION.department,
  "Customer Success",
  "Engineering",
  "Marketing",
  "People Operations",
  "Finance",
  "Legal & Compliance",
];

function buildLearners(): DemoLearner[] {
  const learners: DemoLearner[] = ACME_TEAM.map((member, i) => ({
    id: `demo-learner-${i + 1}`,
    name: member.name,
    avatarSeed: member.name.replace(/\s+/g, "-").toLowerCase(),
    avatarHue: 210 + i * 11,
    xp: member.xp,
    progressPercent: member.progressPercent,
    certificatesEarned: member.certificatesEarned,
    quizzesCompleted: member.quizzesCompleted,
    gamesCompleted: member.gamesCompleted,
    badges: member.badges,
    department: member.department,
  }));

  for (let i = 0; i < 45; i++) {
    const first = EXTENDED_FIRST[i % EXTENDED_FIRST.length];
    const last = EXTENDED_LAST[(i * 5 + 2) % EXTENDED_LAST.length];
    const suffix = i >= EXTENDED_FIRST.length ? ` ${Math.floor(i / EXTENDED_FIRST.length) + 1}` : "";
    const name = `${first} ${last}${suffix}`;
    const id = `demo-learner-${ACME_TEAM.length + i + 1}`;
    const seed = `learner-${id}`;
    const department = DEPARTMENTS[i % DEPARTMENTS.length];

    learners.push({
      id,
      name,
      avatarSeed: name.replace(/\s+/g, "-").toLowerCase(),
      avatarHue: seededInt(seed + "-hue", 200, 320),
      xp: seededInt(seed + "-xp", 120, 2200),
      progressPercent: seededInt(seed + "-prog", 12, 85),
      certificatesEarned: seededInt(seed + "-cert", 0, 2),
      quizzesCompleted: seededInt(seed + "-quiz", 1, 18),
      gamesCompleted: seededInt(seed + "-game", 0, 10),
      badges: BADGE_POOL.slice(0, seededInt(seed + "-badges", 1, 3)),
      department,
    });
  }

  return learners.sort((a, b) => b.xp - a.xp);
}

export const DEMO_LEARNERS = buildLearners();

export function getDemoLearnerAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}`;
}

export function getDemoLearnerById(id: string): DemoLearner | undefined {
  return DEMO_LEARNERS.find((l) => l.id === id);
}
