import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAttendanceReport } from "@/lib/webinars";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const report = await getAttendanceReport(id);
  if (!report) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isHost =
    report.webinar.hostId === session.id || session.role === "ADMIN";
  if (!isHost) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(report);
}
