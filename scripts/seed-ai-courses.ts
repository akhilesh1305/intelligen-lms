/**
 * Generate and publish AI courses on production.
 * Run: npx tsx scripts/seed-ai-courses.ts
 *
 * Requires DATABASE_URL and OPENAI_API_KEY in the environment.
 */

import { PrismaClient, type SkillLevel } from "@prisma/client";
import { generateCourseOutline } from "../src/lib/ai/course-generator";
import { applyCourseOutline } from "../src/lib/ai/apply-course-outline";
import { CURATED_COURSE_OUTLINES } from "./data/curated-course-outlines";

const db = new PrismaClient();

const AI_COURSES: {
  title: string;
  description: string;
  topic: string;
  skillLevel: SkillLevel;
  moduleCount: number;
  lessonsPerModule: number;
  pricePaise: number;
}[] = [
  {
    title: "Cybersecurity Essentials for Teams",
    description:
      "Learn practical security habits, threat awareness, password hygiene, and safe remote work practices for modern workplaces.",
    topic: "Workplace cybersecurity fundamentals",
    skillLevel: "BEGINNER",
    moduleCount: 3,
    lessonsPerModule: 2,
    pricePaise: 0,
  },
  {
    title: "Excel & Data Literacy for Professionals",
    description:
      "Build confidence with spreadsheets, formulas, charts, and data-driven decision making — no prior analytics experience required.",
    topic: "Excel and business data literacy",
    skillLevel: "BEGINNER",
    moduleCount: 3,
    lessonsPerModule: 2,
    pricePaise: 0,
  },
  {
    title: "Effective Communication at Work",
    description:
      "Master clear writing, confident presentations, active listening, and feedback skills for high-performing teams.",
    topic: "Professional workplace communication",
    skillLevel: "BEGINNER",
    moduleCount: 3,
    lessonsPerModule: 2,
    pricePaise: 0,
  },
  {
    title: "Getting Started with AI Tools",
    description:
      "A practical introduction to using AI assistants responsibly — prompts, workflows, ethics, and productivity tips for learners and teams.",
    topic: "AI tools for productivity and learning",
    skillLevel: "INTERMEDIATE",
    moduleCount: 3,
    lessonsPerModule: 2,
    pricePaise: 0,
  },
];

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY not set — courses will use local fallback outlines.");
  }

  const instructor = await db.user.findUnique({
    where: { email: "instructor@intelligen.lms" },
    select: { id: true },
  });

  if (!instructor) {
    throw new Error("Instructor account not found (instructor@intelligen.lms). Run db:seed first.");
  }

  const admin = await db.user.findUnique({
    where: { email: "admin@intelligen.lms" },
    select: { id: true },
  });

  console.log(`Generating ${AI_COURSES.length} AI courses...\n`);

  for (const spec of AI_COURSES) {
    const existing = await db.course.findFirst({
      where: { title: spec.title },
      include: { _count: { select: { modules: true } } },
    });

    if (existing && existing._count.modules > 0) {
      if (process.env.FORCE_REGENERATE === "1") {
        await db.module.deleteMany({ where: { courseId: existing.id } });
        console.log(`Regenerating: ${spec.title}`);
      } else {
        console.log(`Skip (already exists): ${spec.title}`);
        continue;
      }
    }

    let courseId = existing?.id;

    if (!courseId) {
      const created = await db.course.create({
        data: {
          title: spec.title,
          description: spec.description,
          instructorId: instructor.id,
          skillLevel: spec.skillLevel,
          pricePaise: spec.pricePaise,
          published: false,
          status: "DRAFT",
        },
      });
      courseId = created.id;
      console.log(`Created shell: ${spec.title}`);
    } else {
      console.log(`Using existing shell: ${spec.title}`);
    }

    console.log(`  Generating outline with AI...`);
    let outline = await generateCourseOutline(
      spec.topic,
      spec.description,
      spec.moduleCount,
      spec.lessonsPerModule
    );

    const curated = CURATED_COURSE_OUTLINES[spec.title];
    if (outline.source === "local" && curated) {
      outline = {
        ...outline,
        title: curated.title ?? spec.title,
        description: curated.description ?? spec.description,
        modules: curated.modules,
        source: "local",
      };
      console.log(`  Using curated lesson content (OpenAI unavailable or quota exceeded).`);
    }

    const modulesCreated = await applyCourseOutline(courseId, outline);
    const lessonCount = outline.modules.reduce((n, m) => n + m.lessons.length, 0);

    await db.course.update({
      where: { id: courseId },
      data: {
        title: outline.title?.trim() || spec.title,
        description: outline.description?.trim() || spec.description,
        published: true,
        status: "APPROVED",
        approvedAt: new Date(),
        approvedById: admin?.id ?? null,
        skillLevel: spec.skillLevel,
        pricePaise: spec.pricePaise,
      },
    });

    console.log(
      `  ✓ Published: ${outline.title || spec.title} (${modulesCreated} modules, ${lessonCount} lessons, source: ${outline.source})\n`
    );
  }

  const total = await db.course.count({ where: { published: true, status: "APPROVED" } });
  console.log(`Done. ${total} published course(s) in catalog.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
