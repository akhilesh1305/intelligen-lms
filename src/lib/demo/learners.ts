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
};

const FIRST = [
  "Priya", "Arjun", "Meera", "Rohan", "Ananya", "Vikram", "Kavya", "Aditya",
  "Neha", "Sanjay", "Divya", "Karthik", "Pooja", "Rahul", "Isha", "Amit",
  "Sneha", "Nikhil", "Tanvi", "Varun", "Lakshmi", "Deepak", "Shreya", "Manish",
  "Anjali", "Gaurav", "Ritu", "Harsh", "Nidhi", "Suresh", "Aisha", "Pranav",
  "Kiran", "Swati", "Yash", "Preeti", "Akash", "Bhavna", "Dev", "Maya",
  "Omar", "Fatima", "James", "Emily", "Carlos", "Sofia", "Wei", "Yuki",
  "Amara", "Noah", "Zara", "Ethan", "Leila", "Marcus", "Chloe",
];

const LAST = [
  "Sharma", "Patel", "Reddy", "Iyer", "Gupta", "Singh", "Nair", "Menon",
  "Kapoor", "Desai", "Joshi", "Rao", "Verma", "Khan", "Das", "Pillai",
  "Chopra", "Malhotra", "Bose", "Mehta", "Saxena", "Agarwal", "Banerjee",
  "Chatterjee", "Mukherjee", "Fernandes", "D'Souza", "Thomas", "Williams",
  "Johnson", "Chen", "Kim", "Martinez", "Garcia", "Ali", "Hassan",
];

const BADGE_POOL = ["🎯", "🔥", "⭐", "🏆", "📚", "🧠", "💡", "🛡️", "📊", "🚀"];

function buildLearners(): DemoLearner[] {
  const learners: DemoLearner[] = [];

  for (let i = 0; i < 55; i++) {
    const first = FIRST[i % FIRST.length];
    const last = LAST[(i * 7 + 3) % LAST.length];
    const suffix = i >= FIRST.length ? ` ${Math.floor(i / FIRST.length) + 1}` : "";
    const name = `${first} ${last}${suffix}`;
    const id = `demo-learner-${i + 1}`;
    const seed = `learner-${id}`;

    const xp = seededInt(seed + "-xp", 120, 4850);
    const progressPercent = seededInt(seed + "-prog", 12, 100);
    const certificatesEarned = seededInt(seed + "-cert", 0, 4);
    const quizzesCompleted = seededInt(seed + "-quiz", 1, 28);
    const gamesCompleted = seededInt(seed + "-game", 0, 16);
    const badgeCount = seededInt(seed + "-badges", 1, 4);

    learners.push({
      id,
      name,
      avatarSeed: name.replace(/\s+/g, "-").toLowerCase(),
      avatarHue: seededInt(seed + "-hue", 200, 320),
      xp,
      progressPercent,
      certificatesEarned,
      quizzesCompleted,
      gamesCompleted,
      badges: BADGE_POOL.slice(0, badgeCount),
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
