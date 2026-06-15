import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCourseReviews, getUserCourseReview } from "@/lib/reviews";

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(10).max(2000).optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const reviews = await getCourseReviews(id);
  return NextResponse.json({ reviews });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: courseId } = await params;

  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.id, courseId } },
  });
  if (!enrollment) {
    return NextResponse.json(
      { error: "Enroll in this course before leaving a review" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const existing = await getUserCourseReview(session.id, courseId);
  const review = await db.courseReview.upsert({
    where: { userId_courseId: { userId: session.id, courseId } },
    create: {
      userId: session.id,
      courseId,
      rating: parsed.data.rating,
      comment: parsed.data.comment ?? null,
    },
    update: {
      rating: parsed.data.rating,
      comment: parsed.data.comment ?? null,
    },
  });

  return NextResponse.json({
    review,
    created: !existing,
  });
}
