export type ChallengeQuizCategory = "GK" | "APTITUDE" | "TECHNICAL";

export const CHALLENGE_QUIZ_CATEGORIES: ChallengeQuizCategory[] = [
  "GK",
  "APTITUDE",
  "TECHNICAL",
];

export const CHALLENGE_TOPIC_POOLS: Record<ChallengeQuizCategory, string[]> = {
  GK: [
    "Current affairs and world news",
    "Indian and world geography",
    "World history and civilizations",
    "Science facts and discoveries",
    "Sports and tournaments",
    "Politics and government",
    "Arts, culture, and literature",
    "Environment and climate",
    "Famous personalities",
    "Economics and business basics",
  ],
  APTITUDE: [
    "Logical reasoning",
    "Percentages and profit-loss",
    "Ratios and proportions",
    "Number series and patterns",
    "Puzzles and brain teasers",
    "Verbal ability and analogies",
    "Data interpretation",
    "Time, speed, and distance",
    "Blood relations",
    "Coding-decoding",
  ],
  TECHNICAL: [
    "Programming fundamentals",
    "Data structures and algorithms",
    "Databases and SQL",
    "Web development",
    "Operating systems",
    "Computer networking",
    "Software engineering",
    "Cloud computing",
    "Cybersecurity basics",
    "Mobile and system design",
  ],
};

const CATEGORY_LABELS: Record<ChallengeQuizCategory, string> = {
  GK: "General Knowledge",
  APTITUDE: "Aptitude",
  TECHNICAL: "Technical",
};

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pickRandomTopic(category: ChallengeQuizCategory): string {
  const pool = CHALLENGE_TOPIC_POOLS[category];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function buildChallengeTopicContent(
  category: ChallengeQuizCategory,
  topic: string
): string {
  const label = CATEGORY_LABELS[category];

  const guidance: Record<ChallengeQuizCategory, string> = {
    GK: `Focus on factual general knowledge. Include well-known facts, dates, places, people, and concepts a well-read person should know. Avoid obscure trivia.`,
    APTITUDE: `Focus on aptitude-style multiple choice problems. Include numerical reasoning, logic, patterns, or verbal puzzles with one clearly correct answer.`,
    TECHNICAL: `Focus on core technical concepts for learners and professionals. Cover definitions, best practices, common tools, and how things work in computing and IT.`,
  };

  return `${label} quiz on ${topic}. ${guidance[category]} Questions should be self-contained and not require external materials.`;
}

export function pickChallengeTopic(category?: ChallengeQuizCategory): {
  category: ChallengeQuizCategory;
  topic: string;
  content: string;
} {
  const resolvedCategory =
    category ??
    CHALLENGE_QUIZ_CATEGORIES[
      Math.floor(Math.random() * CHALLENGE_QUIZ_CATEGORIES.length)
    ];
  const topic = pickRandomTopic(resolvedCategory);
  return {
    category: resolvedCategory,
    topic,
    content: buildChallengeTopicContent(resolvedCategory, topic),
  };
}

/** Spread questions evenly across GK, Aptitude, and Technical, then shuffle. */
export function distributeCategories(count: number): ChallengeQuizCategory[] {
  const base = Math.floor(count / CHALLENGE_QUIZ_CATEGORIES.length);
  const remainder = count % CHALLENGE_QUIZ_CATEGORIES.length;
  const slots: ChallengeQuizCategory[] = [];

  for (const category of CHALLENGE_QUIZ_CATEGORIES) {
    for (let i = 0; i < base; i++) slots.push(category);
  }

  const extras = shuffle([...CHALLENGE_QUIZ_CATEGORIES]).slice(0, remainder);
  slots.push(...extras);

  return shuffle(slots);
}

export function formatChallengeTopicLabel(
  category: ChallengeQuizCategory,
  topic: string
): string {
  return `${CATEGORY_LABELS[category]}: ${topic}`;
}

export function summarizeChallengeTopics(
  labels: string[]
): string {
  const categories = new Set(
    labels.map((label) => label.split(":")[0]?.trim()).filter(Boolean)
  );
  if (categories.size === 0) return "GK, Aptitude & Technical";
  return Array.from(categories).join(", ");
}
