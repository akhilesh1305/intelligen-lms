import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getWebinar } from "@/lib/webinars";
import { webinarSchema } from "@/lib/validations";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const webinar = await getWebinar(id);
  if (!webinar) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(webinar);
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const existing = await db.webinar.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.hostId !== session.id && session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = webinarSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (parsed.data.title) data.title = parsed.data.title;
  if (parsed.data.description) data.description = parsed.data.description;
  if (parsed.data.scheduledAt) {
    const d = new Date(parsed.data.scheduledAt);
    if (Number.isNaN(d.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }
    data.scheduledAt = d;
  }
  if (parsed.data.durationMinutes) data.durationMinutes = parsed.data.durationMinutes;
  if (parsed.data.meetingUrl !== undefined) {
    data.meetingUrl = parsed.data.meetingUrl || null;
  }
  if (parsed.data.courseId !== undefined) data.courseId = parsed.data.courseId;
  if (parsed.data.maxAttendees !== undefined) {
    data.maxAttendees = parsed.data.maxAttendees;
  }
  if (body.status === "CANCELLED" || body.status === "COMPLETED") {
    data.status = body.status;
  }

  const webinar = await db.webinar.update({ where: { id }, data });
  return NextResponse.json(webinar);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const existing = await db.webinar.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.hostId !== session.id && session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.webinar.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  return NextResponse.json({ success: true });
}
