import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  buildCourseContentText,
  generateQuizFromContent,
} from "@/lib/quiz-generator";

const schema = z.object({
  title: z.string().min(3).max(200).optional(),
  questionCount: z.number().int().min(3).max(15).default(5),
  passingScore: z.number().int().min(50).max(100).default(70),
  moduleId: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !["INSTRUCTOR", "ADMIN"].includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: courseId } = await params;
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" } },
        },
      },
    },
  });

  if (!course || (course.instructorId !== session.id && session.role !== "ADMIN")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const { questionCount, passingScore, moduleId } = parsed.data;

  const modulesWithId = course.modules.map((m) => ({
    id: m.id,
    title: m.title,
    lessons: m.lessons.map((l) => ({ title: l.title, content: l.content })),
  }));

  if (moduleId && !modulesWithId.some((m) => m.id === moduleId)) {
    return NextResponse.json({ error: "Module not found" }, { status: 404 });
  }

  const content = buildCourseContentText(modulesWithId, moduleId);

  if (!content.trim()) {
    return NextResponse.json(
      { error: "Add lesson content before generating a quiz." },
      { status: 400 }
    );
  }

  try {
    const { questions, source } = await generateQuizFromContent(
      course.title,
      content,
      questionCount
    );

    const moduleTitle = moduleId
      ? modulesWithId.find((m) => m.id === moduleId)?.title
      : null;

    const title =
      parsed.data.title ??
      (moduleTitle ? `${moduleTitle} Quiz` : `${course.title} Quiz`);

    const quiz = await db.quiz.create({
      data: {
        courseId,
        title,
        passingScore,
        questions: {
          create: questions.map((q, i) => ({
            question: q.question,
            options: JSON.stringify(q.options),
            correctIndex: q.correctIndex,
            order: i + 1,
          })),
        },
      },
      include: { questions: { orderBy: { order: "asc" } } },
    });

    return NextResponse.json({
      id: quiz.id,
      title: quiz.title,
      questionCount: quiz.questions.length,
      source,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        question: q.question,
        options: JSON.parse(q.options) as string[],
        correctIndex: q.correctIndex,
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
