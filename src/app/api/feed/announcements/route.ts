import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { instructorApiGuard } from "@/lib/instructor";
import { createAnnouncementPost } from "@/lib/feed";
import { announcementSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const rawSession = await getSession();
  if (!rawSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let session = rawSession;
  if (session.role === "INSTRUCTOR") {
    const auth = await instructorApiGuard(session);
    if (auth instanceof NextResponse) return auth;
    session = auth;
  } else if (session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = announcementSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const post = await createAnnouncementPost(
    session.id,
    parsed.data.title,
    parsed.data.content
  );

  return NextResponse.json({ id: post.id }, { status: 201 });
}
