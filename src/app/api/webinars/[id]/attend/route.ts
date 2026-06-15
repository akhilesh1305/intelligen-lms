import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { recordJoin, recordLeave } from "@/lib/webinars";
import { webinarAttendSchema } from "@/lib/validations";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const parsed = webinarAttendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  try {
    if (parsed.data.action === "join") {
      const attendance = await recordJoin(id, session.id);
      if (!attendance) {
        return NextResponse.json({ error: "Webinar not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, joinedAt: attendance.joinedAt });
    }

    const attendance = await recordLeave(id, session.id);
    if (!attendance) {
      return NextResponse.json({ error: "No attendance record" }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      durationMinutes: attendance.durationMinutes,
      present: attendance.present,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Attendance failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
