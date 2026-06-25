import type { AchievementLevel } from "@prisma/client";
import type { getPublishedCourses } from "@/lib/courses";
import { DEMO_ORGANIZATION } from "./brand";

export type PublishedCourse = Awaited<ReturnType<typeof getPublishedCourses>>[number];

export type DemoCourse = {
  id: string;
  title: string;
  description: string;
  instructorName: string;
  lessonCount: number;
  skillLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  pricePaise: number;
  category: string;
  rating: number;
  reviewCount: number;
  enrollmentCount: number;
  avgProgress: number;
  certificateLabel: string;
};

export const DEMO_COURSES: DemoCourse[] = [
  {
    id: "demo-ai-fundamentals",
    title: "AI Fundamentals",
    description:
      "Master machine learning concepts, neural networks, and practical AI workflows. Build a foundation for enterprise AI adoption.",
    instructorName: "Dr. Ananya Rao",
    lessonCount: 24,
    skillLevel: "BEGINNER",
    pricePaise: 0,
    category: "Data Science",
    rating: 4.8,
    reviewCount: 142,
    enrollmentCount: 384,
    avgProgress: 72,
    certificateLabel: "AI Professional",
  },
  {
    id: "demo-leadership-excellence",
    title: "Leadership Excellence",
    description:
      "Develop executive presence, team coaching skills, and strategic decision-making for modern people leaders.",
    instructorName: "Marcus Chen",
    lessonCount: 18,
    skillLevel: "INTERMEDIATE",
    pricePaise: 299900,
    category: "Management",
    rating: 4.9,
    reviewCount: 98,
    enrollmentCount: 256,
    avgProgress: 68,
    certificateLabel: "Leadership Expert",
  },
  {
    id: "demo-cybersecurity-essentials",
    title: "Cybersecurity Essentials",
    description:
      "Threat modeling, secure architecture, incident response, and compliance fundamentals for every organization.",
    instructorName: "Sarah Okafor",
    lessonCount: 22,
    skillLevel: "INTERMEDIATE",
    pricePaise: 0,
    category: "Security",
    rating: 4.7,
    reviewCount: 87,
    enrollmentCount: 312,
    avgProgress: 61,
    certificateLabel: "Security Essentials",
  },
  {
    id: "demo-data-analytics-mastery",
    title: "Data Analytics Mastery",
    description:
      "SQL, dashboards, statistical analysis, and storytelling with data — from raw datasets to executive insights.",
    instructorName: "James Whitfield",
    lessonCount: 26,
    skillLevel: "ADVANCED",
    pricePaise: 399900,
    category: "Data Science",
    rating: 4.8,
    reviewCount: 116,
    enrollmentCount: 198,
    avgProgress: 54,
    certificateLabel: "Data Analytics Specialist",
  },
  {
    id: "demo-product-management-basics",
    title: "Product Management Basics",
    description:
      "Roadmapping, user research, prioritization frameworks, and launch execution for aspiring product managers.",
    instructorName: "Elena Vasquez",
    lessonCount: 16,
    skillLevel: "BEGINNER",
    pricePaise: 199900,
    category: "Management",
    rating: 4.6,
    reviewCount: 74,
    enrollmentCount: 167,
    avgProgress: 58,
    certificateLabel: "Learning Excellence",
  },
  {
    id: "demo-generative-ai-business",
    title: "Generative AI for Business",
    description:
      "Deploy LLMs responsibly — prompt engineering, RAG pipelines, governance, and ROI measurement for enterprise teams.",
    instructorName: "Dr. Ananya Rao",
    lessonCount: 20,
    skillLevel: "INTERMEDIATE",
    pricePaise: 449900,
    category: "Data Science",
    rating: 4.9,
    reviewCount: 129,
    enrollmentCount: 421,
    avgProgress: 79,
    certificateLabel: "AI Professional",
  },
];

export const DEMO_CERTIFICATE_TYPES = [
  {
    slug: "ai-professional",
    label: "AI Professional",
    courseIds: ["demo-ai-fundamentals", "demo-generative-ai-business"],
  },
  {
    slug: "leadership-expert",
    label: "Leadership Expert",
    courseIds: ["demo-leadership-excellence"],
  },
  {
    slug: "security-essentials",
    label: "Security Essentials",
    courseIds: ["demo-cybersecurity-essentials"],
  },
  {
    slug: "learning-excellence",
    label: "Learning Excellence",
    courseIds: ["demo-product-management-basics"],
  },
  {
    slug: "data-analytics-specialist",
    label: "Data Analytics Specialist",
    courseIds: ["demo-data-analytics-mastery"],
  },
] as const;

/** Catalog row shape compatible with courses page + countLessons */
export function getDemoCoursesForCatalog(): Awaited<ReturnType<typeof getPublishedCourses>> {
  const now = new Date("2026-01-15");
  return DEMO_COURSES.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    pricePaise: c.pricePaise,
    thumbnail: null as string | null,
    skillLevel: c.skillLevel,
    createdAt: now,
    updatedAt: now,
    published: true,
    status: "APPROVED" as const,
    visibility: "PUBLIC" as const,
    organizationId: null,
    instructorId: "demo-instructor",
    organization: null,
    instructor: { name: c.instructorName },
    modules: [
      {
        id: `${c.id}-m0`,
        createdAt: now,
        updatedAt: now,
        title: "Main module",
        courseId: c.id,
        order: 0,
        lessons: Array.from({ length: c.lessonCount }, (_, i) => ({
          id: `${c.id}-l${i}`,
          createdAt: now,
          updatedAt: now,
          title: `Lesson ${i + 1}`,
          content: "",
          order: i,
          videoUrl: null,
          moduleId: `${c.id}-m0`,
        })),
      },
    ],
    _count: { enrollments: c.enrollmentCount },
  })) as Awaited<ReturnType<typeof getPublishedCourses>>;
}

export function getDemoReviewStats() {
  const map = new Map<string, { rating: number; count: number }>();
  for (const c of DEMO_COURSES) {
    map.set(c.id, { rating: c.rating, count: c.reviewCount });
  }
  return map;
}

export function getDemoCourseById(id: string): DemoCourse | undefined {
  return DEMO_COURSES.find((c) => c.id === id);
}

export type DemoEnrollment = {
  id: string;
  courseId: string;
  progress: number;
  enrolledAt: Date;
  lessonCount: number;
  course: {
    id: string;
    title: string;
    description: string;
    pricePaise: number;
    thumbnail: string | null;
    skillLevel: DemoCourse["skillLevel"];
    instructor: { name: string };
  };
};

export function getDemoStudentEnrollments(userName: string): DemoEnrollment[] {
  void userName;

  const enrolled = [
    { courseId: "demo-ai-fundamentals", progress: 100 },
    { courseId: "demo-leadership-excellence", progress: 100 },
    { courseId: "demo-cybersecurity-essentials", progress: 18 },
    { courseId: "demo-generative-ai-business", progress: 45 },
  ];

  return enrolled.map((e, i) => {
    const course = DEMO_COURSES.find((c) => c.id === e.courseId)!;
    return {
      id: `demo-enrollment-${i + 1}`,
      courseId: course.id,
      progress: e.progress,
      enrolledAt: new Date(Date.now() - (i + 1) * 14 * 24 * 60 * 60 * 1000),
      lessonCount: course.lessonCount,
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
        pricePaise: course.pricePaise,
        thumbnail: null,
        skillLevel: course.skillLevel,
        instructor: { name: course.instructorName },
      },
    };
  });
}

export function getDemoRecommendations() {
  return DEMO_COURSES.filter((c) =>
    ["demo-data-analytics-mastery", "demo-product-management-basics"].includes(c.id)
  ).map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    instructor: { name: c.instructorName },
    modules: [{ lessons: Array(c.lessonCount).fill({}) }],
    pricePaise: c.pricePaise,
    thumbnail: null,
    skillLevel: c.skillLevel,
    matchReason: `Recommended for ${DEMO_ORGANIZATION.department} at ${DEMO_ORGANIZATION.name}`,
    confidence: 91,
  }));
}

export function getDemoUserBadges() {
  return [
    { id: "demo-badge-1", badge: { id: "b1", name: "AI Professional", icon: "🧠" } },
    { id: "demo-badge-2", badge: { id: "b2", name: "Leadership Expert", icon: "🏆" } },
    { id: "demo-badge-3", badge: { id: "b3", name: "Quiz Champion", icon: "🎯" } },
    { id: "demo-badge-4", badge: { id: "b4", name: "7-Day Streak", icon: "🔥" } },
  ];
}

export function getDemoInstructorCourses(instructorName: string) {
  void instructorName;

  const now = new Date();
  return DEMO_COURSES.slice(0, 4).map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      published: true,
      pricePaise: c.pricePaise,
      thumbnail: null,
      skillLevel: c.skillLevel,
      modules: [{ lessons: Array.from({ length: c.lessonCount }, (_, j) => ({ id: `${c.id}-l${j}` })) }],
      updatedAt: now,
    }));
}

export function getDemoInstructorAnalytics() {
  return {
    courseCount: 4,
    totalStudents: 186,
    avgProgress: 71,
    courses: DEMO_COURSES.slice(0, 4).map((c) => ({
      id: c.id,
      title: c.title,
      status: "APPROVED" as const,
      enrollments: c.enrollmentCount,
      avgProgress: c.avgProgress,
    })),
  };
}

export function getDemoAchievementLevel(points: number): AchievementLevel {
  if (points >= 275) return "PLATINUM";
  if (points >= 130) return "GOLD";
  if (points >= 50) return "SILVER";
  return "BRONZE";
}
