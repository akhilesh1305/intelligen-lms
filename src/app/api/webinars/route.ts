import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { instructorApiGuard } from "@/lib/instructor";
import { db } from "@/lib/db";
import { getWebinars } from "@/lib/webinars";
import { webinarSchema } from "@/lib/validations";
import { createNotification } from "@/lib/notifications";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") as "upcoming" | "past" | "all" | null;
  const webinars = await getWebinars(filter ?? "upcoming");
  return NextResponse.json(webinars);
}

export async function POST(request: Request) {
  const session = await instructorApiGuard(await getSession());
  if (session instanceof NextResponse) return session;

  const body = await request.json();
  const parsed = webinarSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const scheduledAt = new Date(parsed.data.scheduledAt);
  if (Number.isNaN(scheduledAt.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  if (parsed.data.courseId) {
    const course = await db.course.findUnique({
      where: { id: parsed.data.courseId },
    });
    if (
      !course ||
      (course.instructorId !== session.id && session.role !== "ADMIN")
    ) {
      return NextResponse.json({ error: "Invalid course" }, { status: 400 });
    }
  }

  const webinar = await db.webinar.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      scheduledAt,
      durationMinutes: parsed.data.durationMinutes,
      meetingUrl: parsed.data.meetingUrl || null,
      courseId: parsed.data.courseId || null,
      maxAttendees: parsed.data.maxAttendees ?? null,
      hostId: session.id,
    },
  });

  const students = await db.user.findMany({
    where: { role: "STUDENT" },
    select: { id: true },
    take: 50,
  });

  for (const student of students) {
    await createNotification({
      userId: student.id,
      type: "WEBINAR_SCHEDULED",
      title: `New webinar: ${webinar.title}`,
      message: `Scheduled for ${scheduledAt.toLocaleString()}`,
      link: `/webinars/${webinar.id}`,
    });
  }

  return NextResponse.json({ id: webinar.id }, { status: 201 });
}
