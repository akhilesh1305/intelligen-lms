import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getCourseWithContent } from "@/lib/courses";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { NewThreadForm } from "./new-thread-form";

export default async function ForumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  const course = await getCourseWithContent(id);

  if (!course || course.status !== "APPROVED") notFound();

  const threads = await db.forumThread.findMany({
    where: { courseId: id },
    include: {
      user: { select: { name: true } },
      _count: { select: { posts: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const isEnrolled = session
    ? course.enrollments.some((e) => e.userId === session.id)
    : false;
  const canPost =
    isEnrolled ||
    session?.id === course.instructorId ||
    session?.role === "ADMIN";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href={`/courses/${id}`}
        className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to course
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-ink">Discussion forum</h1>
      <p className="mt-1 text-muted">{course.title}</p>

      {canPost && session && (
        <div className="mt-8">
          <NewThreadForm courseId={id} />
        </div>
      )}

      <div className="mt-8 space-y-3">
        {threads.length === 0 ? (
          <p className="py-12 text-center text-muted">No discussions yet. Start one!</p>
        ) : (
          threads.map((thread) => (
            <Link
              key={thread.id}
              href={`/courses/${id}/forum/${thread.id}`}
              className="block rounded-sm border border-slate-200 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div className="flex items-start gap-3">
                <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                <div>
                  <h3 className="font-semibold text-ink">{thread.title}</h3>
                  <p className="mt-1 text-sm text-muted line-clamp-2">{thread.content}</p>
                  <p className="mt-2 text-xs text-muted">
                    {thread.user.name} · {formatDate(thread.createdAt)} ·{" "}
                    {thread._count.posts} replies
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
