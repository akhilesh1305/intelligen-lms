import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkAndAwardBadges } from "@/lib/gamification";
import { createNotification } from "@/lib/notifications";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { threadId, content } = await request.json();

  if (!threadId || !content?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const thread = await db.forumThread.findUnique({
    where: { id: threadId },
    include: { course: true },
  });

  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  const post = await db.forumPost.create({
    data: { threadId, userId: session.id, content },
  });

  if (thread.userId !== session.id) {
    await createNotification({
      userId: thread.userId,
      type: "FORUM_REPLY",
      title: "New reply to your discussion",
      message: content.slice(0, 100),
      link: `/courses/${thread.courseId}/forum/${threadId}`,
    });
  }

  await checkAndAwardBadges(session.id);

  return NextResponse.json({ id: post.id }, { status: 201 });
}
