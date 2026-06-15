import { z } from "zod";
import type { ChallengeQuizCategory } from "@/lib/challenge-quiz-topics";

export type GeneratedQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

export type QuizGenerationResult = {
  questions: GeneratedQuestion[];
  source: "openai" | "local";
};

const questionSchema = z.object({
  question: z.string().min(10),
  options: z.array(z.string().min(1)).min(2).max(6),
  correctIndex: z.number().int().min(0),
});

const responseSchema = z.object({
  questions: z.array(questionSchema).min(1),
});

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function extractSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.replace(/^[-•*]\s*/, "").trim())
    .filter((s) => s.length > 40 && s.length < 300);
}

function extractTerms(text: string): string[] {
  const terms = new Set<string>();
  const patterns = [
    /`([^`]+)`/g,
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g,
    /\b(HTML|CSS|JavaScript|Python|React|API|SQL|JSON|HTTP|URL|DOM|UI|UX|ML|AI)\b/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const term = match[1] || match[0];
      if (term.length > 2 && term.length < 40) terms.add(term);
    }
  }

  return Array.from(terms);
}

function sentenceToQuestion(sentence: string, allSentences: string[]): GeneratedQuestion | null {
  const terms = extractTerms(sentence);
  if (terms.length === 0) return null;

  const term = terms[0];
  const question = `Which statement best describes "${term}" based on the course content?`;

  const correct = sentence.length > 120 ? sentence.slice(0, 117) + "..." : sentence;

  const distractors = allSentences
    .filter((s) => s !== sentence)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((s) => (s.length > 100 ? s.slice(0, 97) + "..." : s));

  while (distractors.length < 3) {
    distractors.push(`This concept is unrelated to ${term} in this course.`);
  }

  const options = shuffle([correct, ...distractors.slice(0, 3)]);
  const correctIndex = options.indexOf(correct);

  return { question, options, correctIndex };
}

function fillBlankQuestion(sentence: string, terms: string[]): GeneratedQuestion | null {
  const term = terms.find((t) => sentence.includes(t));
  if (!term) return null;

  const question = sentence.replace(term, "_____");
  if (question === sentence) return null;

  const otherTerms = terms.filter((t) => t !== term);
  const distractors = shuffle(otherTerms).slice(0, 3);
  while (distractors.length < 3) {
    distractors.push(`None of the above`);
  }

  const options = shuffle([term, ...distractors.slice(0, 3)]);
  return {
    question: `Fill in the blank: ${question}`,
    options,
    correctIndex: options.indexOf(term),
  };
}

export function generateQuestionsLocally(
  content: string,
  count: number
): GeneratedQuestion[] {
  const sentences = extractSentences(content);
  const terms = extractTerms(content);
  const questions: GeneratedQuestion[] = [];
  const used = new Set<string>();

  for (const sentence of shuffle(sentences)) {
    if (questions.length >= count) break;

    const q =
      questions.length % 2 === 0
        ? fillBlankQuestion(sentence, terms)
        : sentenceToQuestion(sentence, sentences);

    if (q && !used.has(q.question)) {
      used.add(q.question);
      questions.push(q);
    }
  }

  // Fallback if not enough content
  if (questions.length < count && sentences.length > 0) {
    for (const sentence of sentences) {
      if (questions.length >= count) break;
      const q = {
        question: "Which of the following is taught in this course?",
        options: shuffle([
          sentence.slice(0, 80),
          ...sentences.filter((s) => s !== sentence).slice(0, 3).map((s) => s.slice(0, 80)),
        ]).slice(0, 4),
        correctIndex: 0,
      };
      q.correctIndex = q.options.indexOf(sentence.slice(0, 80));
      if (q.correctIndex >= 0 && !used.has(q.question + sentence)) {
        used.add(q.question + sentence);
        questions.push(q);
      }
    }
  }

  return questions.slice(0, count);
}

const CHALLENGE_LOCAL_BANK: Record<
  ChallengeQuizCategory,
  { question: string; options: string[]; correctIndex: number }[]
> = {
  GK: [
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctIndex: 1,
    },
    {
      question: "What is the capital of Japan?",
      options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
      correctIndex: 2,
    },
    {
      question: "Who wrote the play Romeo and Juliet?",
      options: [
        "Charles Dickens",
        "William Shakespeare",
        "Jane Austen",
        "Mark Twain",
      ],
      correctIndex: 1,
    },
    {
      question: "Which gas do plants absorb from the atmosphere during photosynthesis?",
      options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
      correctIndex: 2,
    },
    {
      question: "The Great Wall is located in which country?",
      options: ["India", "China", "Egypt", "Peru"],
      correctIndex: 1,
    },
  ],
  APTITUDE: [
    {
      question: "What is 25% of 200?",
      options: ["25", "40", "50", "75"],
      correctIndex: 2,
    },
    {
      question: "If 3 pencils cost 12 rupees, what is the cost of 5 pencils?",
      options: ["15", "18", "20", "24"],
      correctIndex: 2,
    },
    {
      question: "Complete the series: 2, 4, 8, 16, ?",
      options: ["20", "24", "32", "36"],
      correctIndex: 2,
    },
    {
      question: "BOOK is to READ as FOOD is to ?",
      options: ["Cook", "Eat", "Buy", "Serve"],
      correctIndex: 1,
    },
    {
      question:
        "A train travels 60 km in 1 hour. How far will it travel in 2.5 hours at the same speed?",
      options: ["120 km", "130 km", "150 km", "180 km"],
      correctIndex: 2,
    },
  ],
  TECHNICAL: [
    {
      question: "Which data structure uses FIFO (First In, First Out) order?",
      options: ["Stack", "Queue", "Tree", "Graph"],
      correctIndex: 1,
    },
    {
      question: "What does HTTP stand for?",
      options: [
        "HyperText Transfer Protocol",
        "High Transfer Text Protocol",
        "Hyperlink Text Transmission Process",
        "Host Transfer Terminal Program",
      ],
      correctIndex: 0,
    },
    {
      question: "Which SQL clause is used to filter rows before grouping?",
      options: ["ORDER BY", "HAVING", "WHERE", "GROUP BY"],
      correctIndex: 2,
    },
    {
      question: "In programming, what is a bug?",
      options: [
        "A hardware failure",
        "An error or defect in code",
        "A type of virus",
        "A backup file",
      ],
      correctIndex: 1,
    },
    {
      question: "Which layer of the OSI model handles routing between networks?",
      options: ["Data Link", "Transport", "Network", "Session"],
      correctIndex: 2,
    },
  ],
};

function generateChallengeQuestionsLocally(
  category: ChallengeQuizCategory,
  topic: string,
  count: number
): GeneratedQuestion[] {
  const bank = shuffle([...CHALLENGE_LOCAL_BANK[category]]);
  const questions: GeneratedQuestion[] = [];
  const used = new Set<string>();

  for (const item of bank) {
    if (questions.length >= count) break;
    if (used.has(item.question)) continue;
    used.add(item.question);
    questions.push({
      question: item.question,
      options: [...item.options],
      correctIndex: item.correctIndex,
    });
  }

  while (questions.length < count) {
    const template = bank[questions.length % bank.length];
    questions.push({
      question: template.question,
      options: [...template.options],
      correctIndex: template.correctIndex,
    });
  }

  return questions.slice(0, count);
}

async function generateChallengeWithOpenAI(
  category: ChallengeQuizCategory,
  topic: string,
  content: string,
  count: number
): Promise<GeneratedQuestion[] | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const categoryGuide: Record<ChallengeQuizCategory, string> = {
    GK: "General Knowledge — factual questions about the world, history, science, geography, and current affairs.",
    APTITUDE:
      "Aptitude — reasoning, percentages, ratios, puzzles, patterns, and verbal ability with solvable multiple-choice answers.",
    TECHNICAL:
      "Technical — programming, databases, networking, OS, web development, and core IT concepts.",
  };

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You generate multiple-choice quiz questions for a learning platform challenge game. Return ONLY valid JSON with this shape:
{"questions":[{"question":"string","options":["A","B","C","D"],"correctIndex":0}]}
Rules: exactly 4 options per question, correctIndex 0-3, questions must be self-contained, factual, and appropriate for the category. No trick questions.`,
          },
          {
            role: "user",
            content: `Category: ${category} (${categoryGuide[category]})\nTopic: ${topic}\n\nGenerate ${count} quiz questions:\n\n${content}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const validated = responseSchema.safeParse(parsed);
    if (!validated.success) return null;

    return validated.data.questions.map((q) => ({
      question: q.question,
      options: q.options.slice(0, 4),
      correctIndex: Math.min(q.correctIndex, q.options.length - 1),
    }));
  } catch {
    return null;
  }
}

export async function generateChallengeQuizQuestions(
  category: ChallengeQuizCategory,
  topic: string,
  content: string,
  questionCount: number
): Promise<QuizGenerationResult> {
  const count = Math.min(Math.max(questionCount, 1), 10);

  const aiQuestions = await generateChallengeWithOpenAI(
    category,
    topic,
    content,
    count
  );
  if (aiQuestions && aiQuestions.length > 0) {
    return { questions: aiQuestions.slice(0, count), source: "openai" };
  }

  const localQuestions = generateChallengeQuestionsLocally(
    category,
    topic,
    count
  );
  return { questions: localQuestions, source: "local" };
}

async function generateWithOpenAI(
  courseTitle: string,
  content: string,
  count: number
): Promise<GeneratedQuestion[] | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const trimmed = content.slice(0, 12000);

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You generate multiple-choice quiz questions for an LMS. Return ONLY valid JSON with this shape:
{"questions":[{"question":"string","options":["A","B","C","D"],"correctIndex":0}]}
Rules: exactly 4 options per question, correctIndex 0-3, questions must test understanding of the provided content, no trick questions.`,
          },
          {
            role: "user",
            content: `Course: ${courseTitle}\n\nGenerate ${count} quiz questions from this content:\n\n${trimmed}`,
          },
        ],
        temperature: 0.6,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const validated = responseSchema.safeParse(parsed);
    if (!validated.success) return null;

    return validated.data.questions.map((q) => ({
      question: q.question,
      options: q.options.slice(0, 4),
      correctIndex: Math.min(q.correctIndex, q.options.length - 1),
    }));
  } catch {
    return null;
  }
}

export async function generateQuizFromContent(
  courseTitle: string,
  content: string,
  questionCount: number
): Promise<QuizGenerationResult> {
  const count = Math.min(Math.max(questionCount, 3), 15);

  if (!content.trim()) {
    throw new Error("No course content available to generate questions from.");
  }

  const aiQuestions = await generateWithOpenAI(courseTitle, content, count);
  if (aiQuestions && aiQuestions.length > 0) {
    return { questions: aiQuestions.slice(0, count), source: "openai" };
  }

  const localQuestions = generateQuestionsLocally(content, count);
  if (localQuestions.length === 0) {
    throw new Error("Could not generate questions. Add more lesson content first.");
  }

  return { questions: localQuestions, source: "local" };
}

export function buildCourseContentText(
  modules: {
    id: string;
    title: string;
    lessons: { title: string; content: string }[];
  }[],
  moduleId?: string
): string {
  const toProcess = moduleId
    ? modules.filter((m) => m.id === moduleId)
    : modules;

  if (toProcess.length === 0) return "";

  return toProcess
    .map(
      (mod) =>
        `## ${mod.title}\n` +
        mod.lessons.map((l) => `### ${l.title}\n${l.content}`).join("\n\n")
    )
    .join("\n\n");
}
