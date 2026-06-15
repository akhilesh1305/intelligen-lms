import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ensurePathEnrollment } from "@/lib/learning-paths";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const path = await db.learningPath.findUnique({ where: { slug } });

  if (!path || !path.published) {
    return NextResponse.json({ error: "Path not found" }, { status: 404 });
  }

  await ensurePathEnrollment(session.id, path.id);

  return NextResponse.json({ success: true, pathId: path.id });
}
