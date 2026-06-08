import type { CourseSummary } from "./context";

export type RoadmapCourse = {
  id: string;
  title: string;
  level: string;
  reason: string;
};

export type RoadmapStep = {
  order: number;
  phase: string;
  description: string;
  courses: RoadmapCourse[];
  duration: string;
};

export type LearningRoadmap = {
  goal: string;
  summary: string;
  steps: RoadmapStep[];
  totalCourses: number;
};

const GOAL_PATTERNS: {
  keywords: RegExp;
  goal: string;
  summary: string;
  phases: {
    phase: string;
    description: string;
    duration: string;
    match: (c: CourseSummary) => boolean;
    reason: (c: CourseSummary) => string;
  }[];
}[] = [
  {
    keywords: /web\s*dev|frontend|full\s*stack|become\s*a\s*developer|learn\s*to\s*code|javascript|react/i,
    goal: "Web Developer",
    summary:
      "A structured path from HTML/CSS fundamentals to advanced React patterns for building modern web applications.",
    phases: [
      {
        phase: "Foundations",
        description: "Learn HTML, CSS, and core web concepts",
        duration: "2–3 weeks",
        match: (c) => /web development|introduction/i.test(c.title) && c.level === "Beginner",
        reason: () => "Essential starting point for all web developers",
      },
      {
        phase: "Advanced skills",
        description: "Master modern React and frontend architecture",
        duration: "3–4 weeks",
        match: (c) => /react|advanced/i.test(c.title.toLowerCase()),
        reason: () => "Build production-ready React applications",
      },
    ],
  },
  {
    keywords: /data\s*scien|machine\s*learn|ai\b|analytics|python\s*data/i,
    goal: "Data Scientist",
    summary:
      "Progress from Python fundamentals to machine learning with hands-on data analysis skills.",
    phases: [
      {
        phase: "Python & data basics",
        description: "Master Python for data manipulation and visualization",
        duration: "3–4 weeks",
        match: (c) => /python|data science/i.test(c.title.toLowerCase()),
        reason: () => "Core toolkit for every data scientist",
      },
      {
        phase: "Machine learning",
        description: "Learn ML algorithms and model evaluation",
        duration: "4–5 weeks",
        match: (c) => /machine learning/i.test(c.title.toLowerCase()),
        reason: () => "Apply ML to real-world prediction problems",
      },
    ],
  },
  {
    keywords: /design|ui\b|ux\b|user\s*experience|figma/i,
    goal: "UI/UX Designer",
    summary:
      "Develop user-centered design skills from research through prototyping and visual design.",
    phases: [
      {
        phase: "Design fundamentals",
        description: "Learn UX principles, wireframing, and prototyping",
        duration: "3–4 weeks",
        match: (c) => /design|ux/i.test(c.title.toLowerCase()),
        reason: () => "Foundation for creating intuitive interfaces",
      },
    ],
  },
  {
    keywords: /market|digital\s*market|seo|social\s*media|brand/i,
    goal: "Digital Marketer",
    summary:
      "Build skills in SEO, content marketing, and social media strategy to grow brands online.",
    phases: [
      {
        phase: "Marketing essentials",
        description: "Strategy, SEO, content, and social media",
        duration: "3–4 weeks",
        match: (c) => /marketing/i.test(c.title.toLowerCase()),
        reason: () => "Complete digital marketing toolkit",
      },
    ],
  },
  {
    keywords: /project\s*manage|agile|scrum|leadership|manager/i,
    goal: "Project Manager",
    summary:
      "Learn Agile methodologies, sprint planning, and stakeholder management to lead projects.",
    phases: [
      {
        phase: "Project management",
        description: "Agile, Scrum, risk management, and communication",
        duration: "2–3 weeks",
        match: (c) => /project|management/i.test(c.title.toLowerCase()),
        reason: () => "Essential PM skills for any industry",
      },
    ],
  },
];

function scoreCourseForGoal(course: CourseSummary, goalWords: string[]): number {
  const text = `${course.title} ${course.description} ${course.category}`.toLowerCase();
  return goalWords.reduce((score, word) => {
    if (word.length < 3) return score;
    return text.includes(word) ? score + 1 : score;
  }, 0);
}

export function detectGoal(message: string): string | null {
  for (const pattern of GOAL_PATTERNS) {
    if (pattern.keywords.test(message)) return pattern.goal;
  }
  return null;
}

export function wantsRoadmap(message: string): boolean {
  return /roadmap|learning\s*path|career\s*path|plan\s*to\s*learn|how\s*do\s*i\s*become|steps\s*to/i.test(
    message
  );
}

export function generateRoadmap(
  message: string,
  catalog: CourseSummary[],
  enrolledIds: Set<string> = new Set()
): LearningRoadmap | null {
  const matched =
    GOAL_PATTERNS.find((p) => p.keywords.test(message)) ??
    GOAL_PATTERNS.find((p) =>
      message.toLowerCase().includes(p.goal.toLowerCase().split(" ")[0])
    );

  if (matched) {
    const steps: RoadmapStep[] = [];
    const usedIds = new Set<string>();

    for (const phase of matched.phases) {
      const courses = catalog
        .filter((c) => phase.match(c) && !usedIds.has(c.id))
        .slice(0, 2)
        .map((c) => {
          usedIds.add(c.id);
          return {
            id: c.id,
            title: c.title,
            level: c.level,
            reason: enrolledIds.has(c.id)
              ? "Already enrolled — continue your progress!"
              : phase.reason(c),
          };
        });

      if (courses.length > 0) {
        steps.push({
          order: steps.length + 1,
          phase: phase.phase,
          description: phase.description,
          courses,
          duration: phase.duration,
        });
      }
    }

    if (steps.length > 0) {
      return {
        goal: matched.goal,
        summary: matched.summary,
        steps,
        totalCourses: steps.reduce((s, step) => s + step.courses.length, 0),
      };
    }
  }

  // Generic roadmap from keyword scoring
  const goalWords = message.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
  const ranked = [...catalog]
    .map((c) => ({ course: c, score: scoreCourseForGoal(c, goalWords) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  if (ranked.length === 0) return null;

  const beginner = ranked.filter((r) => r.course.level === "Beginner");
  const advanced = ranked.filter((r) => r.course.level !== "Beginner");

  const steps: RoadmapStep[] = [];

  if (beginner.length > 0) {
    steps.push({
      order: 1,
      phase: "Getting started",
      description: "Build foundational knowledge in your chosen area",
      duration: "2–4 weeks",
      courses: beginner.map((r) => ({
        id: r.course.id,
        title: r.course.title,
        level: r.course.level,
        reason: `Matches your goal: "${message.slice(0, 50)}"`,
      })),
    });
  }

  if (advanced.length > 0) {
    steps.push({
      order: steps.length + 1,
      phase: "Level up",
      description: "Deepen expertise with advanced topics",
      duration: "3–5 weeks",
      courses: advanced.map((r) => ({
        id: r.course.id,
        title: r.course.title,
        level: r.course.level,
        reason: "Next step after mastering the basics",
      })),
    });
  }

  return {
    goal: detectGoal(message) ?? "Your learning goal",
    summary: `A personalized path based on your interest in "${message.slice(0, 80)}"`,
    steps,
    totalCourses: steps.reduce((s, step) => s + step.courses.length, 0),
  };
}

export function answerCourseQuestion(
  message: string,
  catalog: CourseSummary[],
  userContext?: Awaited<ReturnType<typeof import("./context").getUserLearningContext>>
): string | null {
  const lower = message.toLowerCase();

  if (/what courses|available courses|catalog|list courses|show courses/i.test(lower)) {
    const list = catalog.map((c) => `• **${c.title}** (${c.level}) — ${c.category}`).join("\n");
    return `Here are all available courses on IntelliGen LMS:\n\n${list}\n\nAsk me for a roadmap in any area!`;
  }

  if (/my progress|how am i doing|enrolled/i.test(lower) && userContext) {
    if (userContext.enrollments.length === 0) {
      return `You're not enrolled in any courses yet. Browse the catalog or ask me for a learning roadmap!`;
    }
    const list = userContext.enrollments
      .map((e) => `• **${e.title}** — ${e.progress}% complete`)
      .join("\n");
    return `Here's your current progress, ${userContext.name}:\n\n${list}\n\nYou have **${userContext.points} points** and **${userContext.certificates.length} certificate(s)**.`;
  }

  if (/certificate/i.test(lower) && userContext) {
    if (userContext.certificates.length === 0) {
      return "You haven't earned a certificate yet. Complete all lessons, quizzes, and assignments in a course to earn one!";
    }
    return `Your certificates:\n${userContext.certificates.map((c) => `• ${c}`).join("\n")}`;
  }

  const courseMatch = catalog.find(
    (c) =>
      lower.includes(c.title.toLowerCase()) ||
      c.title.toLowerCase().split(" ").some((w) => w.length > 4 && lower.includes(w))
  );

  if (courseMatch) {
    return `**${courseMatch.title}**\n\n${courseMatch.description}\n\n• Level: ${courseMatch.level}\n• Category: ${courseMatch.category}\n• Lessons: ${courseMatch.lessonCount}\n• Instructor: ${courseMatch.instructor}\n\n[View course](/courses/${courseMatch.id})`;
  }

  if (/recommend|suggest|which course|what should i learn/i.test(lower)) {
    const notEnrolled = catalog.filter(
      (c) => !userContext?.enrollments.some((e) => e.courseId === c.id)
    );
    const top = notEnrolled
      .sort((a, b) => b.enrollments - a.enrollments)
      .slice(0, 3);
    if (top.length === 0) return "You're enrolled in all available courses — great work!";
    return `Based on popularity, I'd suggest:\n\n${top.map((c) => `• **${c.title}** (${c.level}) — [View](/courses/${c.id})`).join("\n")}\n\nOr tell me your career goal for a custom roadmap!`;
  }

  return null;
}
