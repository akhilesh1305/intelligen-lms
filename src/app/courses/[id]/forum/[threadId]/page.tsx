import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { ReplyForm } from "./reply-form";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ id: string; threadId: string }>;
}) {
  const { id, threadId } = await params;
  const session = await getSession();

  const thread = await db.forumThread.findUnique({
    where: { id: threadId },
    include: {
      user: { select: { name: true } },
      course: { include: { enrollments: true } },
      posts: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!thread || thread.courseId !== id) notFound();

  const isEnrolled = session
    ? thread.course.enrollments.some((e) => e.userId === session.id)
    : false;
  const canReply =
    isEnrolled ||
    session?.id === thread.course.instructorId ||
    session?.role === "ADMIN";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href={`/courses/${id}/forum`}
        className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to forum
      </Link>

      <article className="mt-6 rounded-sm border border-slate-200 bg-white p-6 shadow-card">
        <h1 className="text-xl font-bold text-ink">{thread.title}</h1>
        <p className="mt-4 whitespace-pre-wrap text-ink/90">{thread.content}</p>
        <p className="mt-4 text-xs text-muted">
          {thread.user.name} · {formatDate(thread.createdAt)}
        </p>
      </article>

      <div className="mt-6 space-y-3">
        <h2 className="font-semibold text-ink">
          Replies ({thread.posts.length})
        </h2>
        {thread.posts.map((post) => (
          <div
            key={post.id}
            className="rounded-sm border border-slate-100 bg-slate-50 p-4"
          >
            <p className="whitespace-pre-wrap text-sm text-ink/90">{post.content}</p>
            <p className="mt-2 text-xs text-muted">
              {post.user.name} · {formatDate(post.createdAt)}
            </p>
          </div>
        ))}
      </div>

      {canReply && session && (
        <div className="mt-8">
          <ReplyForm threadId={threadId} />
        </div>
      )}
    </div>
  );
}
