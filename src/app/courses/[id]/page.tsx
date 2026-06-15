import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Globe,
  MessageSquare,
  PlayCircle,
  User,
} from "lucide-react";
import { getCourseAccess } from "@/lib/access";
import { formatInr, isFreeCourse } from "@/lib/currency";
import { getCourseProgressDetails } from "@/lib/progress";
import { ProgressTracker } from "@/components/courses/progress-tracker";
import { getSession } from "@/lib/auth";
import { getCourseWithContent } from "@/lib/courses";
import { canUserViewCourse } from "@/lib/organizations";
import { isRazorpayConfigured } from "@/lib/razorpay";
import { getPrerequisiteStatus } from "@/lib/prerequisites";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { CourseThumbnail } from "@/components/courses/course-thumbnail";
import { EnrollButton } from "./enroll-button";
import { CourseReviewsSection } from "@/components/courses/course-reviews-section";
import {
  getCourseCategory,
  getCourseDuration,
  getCourseGradient,
  getCourseLevel,
} from "@/lib/course-visuals";
import { getCourseReviewStats } from "@/lib/reviews";
import { cn } from "@/lib/utils";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  const course = await getCourseWithContent(id);

  if (
    !course ||
    !(await canUserViewCourse(
      session ? { id: session.id, role: session.role } : null,
      course
    ))
  ) {
    notFound();
  }

  const lessonCount = course.modules.reduce(
    (sum, m) => sum + m.lessons.length,
    0
  );

  const access = session
    ? await getCourseAccess(session.id, id, session.role)
    : null;
  const isEnrolled = access?.enrolled ?? false;
  const canLearn = access?.canLearn ?? false;
  const isFree = isFreeCourse(course.pricePaise);
  const paymentsEnabled = isRazorpayConfigured();

  const isInstructor = session?.id === course.instructorId;

  const progressDetails =
    canLearn && session
      ? await getCourseProgressDetails(session.id, id)
      : null;
  const gradient = getCourseGradient(course.id);
  const category = getCourseCategory(course.title);
  const { rating, count: reviewCount } = await getCourseReviewStats(course.id);
  const duration = getCourseDuration(lessonCount);
  const level = getCourseLevel(course.title, course.skillLevel);
  const prereqStatus =
    session && session.role === "STUDENT"
      ? await getPrerequisiteStatus(session.id, id)
      : null;

  const learningPoints = [
    "Core concepts explained with real-world examples",
    "Hands-on lessons you can apply immediately",
    "Structured modules for step-by-step learning",
    "Progress tracking to keep you on course",
  ];

  return (
    <div>
      {/* Hero banner */}
      <section className={cn("bg-gradient-to-br text-white", gradient)}>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge className="bg-white/20 text-white ring-white/30">
                {category}
              </Badge>
              {course.visibility === "ORGANIZATION" && course.organization ? (
                <Badge className="bg-white/20 text-white ring-white/30">
                  {course.organization.name} only
                </Badge>
              ) : null}
            </div>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {course.title}
            </h1>
            <p className="mt-4 text-lg text-white/90">{course.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/80">
              {rating != null && reviewCount > 0 ? (
                <StarRating
                  rating={rating}
                  reviewCount={reviewCount}
                  className="[&_span]:text-white [&_.text-amber-500]:text-amber-300"
                />
              ) : (
                <span className="text-white/70">No reviews yet</span>
              )}
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {course.instructor.name}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {duration}
              </span>
              <span>{course.enrollments.length} learners enrolled</span>
            </div>
          </div>
        </div>
      </section>

      {/* Two-column layout */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
          {/* Sticky enroll card — first on mobile */}
          <aside className="order-first lg:order-none lg:w-96">
            <div className="lg:sticky lg:top-36 rounded-sm border border-slate-200 bg-white shadow-elevated">
              <div
                className={cn(
                  "relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br sm:h-44",
                  gradient
                )}
              >
                {course.thumbnail ? (
                  <CourseThumbnail
                    thumbnail={course.thumbnail}
                    alt={course.title}
                    fill
                  />
                ) : null}
                <div className="absolute inset-0 bg-black/20" />
                {!course.thumbnail ? (
                  <BookOpen className="relative h-14 w-14 text-white/80 sm:h-16 sm:w-16" />
                ) : null}
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap gap-2">
                  <Badge>{level}</Badge>
                  <Badge variant="info">{category}</Badge>
                </div>

                <div className="mt-4 space-y-3 text-sm text-muted">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>English</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{duration}</span>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-4">
                  <p className="text-3xl font-bold text-ink">
                    {isFree ? "Free" : formatInr(course.pricePaise)}
                  </p>
                  {!isFree && access?.hasSubscription ? (
                    <p className="mt-1 text-sm text-brand-600">
                      Included in your subscription
                    </p>
                  ) : !isFree ? (
                    <p className="mt-1 text-sm text-muted">
                      Or unlock all paid courses on{" "}
                      <Link href="/pricing" className="font-semibold text-brand-600 hover:underline">
                        Pricing
                      </Link>
                    </p>
                  ) : null}
                </div>

                {prereqStatus?.required && !prereqStatus.met && prereqStatus.prerequisite ? (
                  <div className="mt-4 rounded-sm border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
                    Complete{" "}
                    <Link
                      href={`/courses/${prereqStatus.prerequisite.id}`}
                      className="font-semibold underline"
                    >
                      {prereqStatus.prerequisite.title}
                    </Link>{" "}
                    before enrolling in this course.
                  </div>
                ) : null}

                <div className="mt-6">
                  {isInstructor && (
                    <Link href={`/instructor/courses/${course.id}`} className="mb-3 block">
                      <Button variant="outline" className="w-full">
                        Manage course
                      </Button>
                    </Link>
                  )}
                  {canLearn ? (
                    <Link href={`/learn/${course.id}`}>
                      <Button className="w-full" size="lg">
                        {isEnrolled ? "Continue learning" : "Start learning"}
                      </Button>
                    </Link>
                  ) : session && session.role === "STUDENT" ? (
                    prereqStatus?.required && !prereqStatus.met ? (
                      <Button className="w-full" size="lg" disabled>
                        Prerequisite required
                      </Button>
                    ) : (
                      <EnrollButton
                        courseId={course.id}
                        pricePaise={course.pricePaise}
                        paymentsEnabled={paymentsEnabled}
                        className="w-full"
                      />
                    )
                  ) : !session ? (
                    <Link href="/login">
                      <Button className="w-full" size="lg">
                        Log in to enroll
                      </Button>
                    </Link>
                  ) : null}
                </div>

                <p className="mt-4 text-center text-xs text-muted">
                  {isFree
                    ? "Free enrollment · Learn at your own pace"
                    : "Secure payment via Razorpay · Instant access"}
                </p>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="order-last min-w-0 flex-1 lg:order-none">
            <section>
              <h2 className="text-2xl font-bold text-ink">What you&apos;ll learn</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {learningPoints.map((point) => (
                  <div key={point} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                    <span className="text-sm text-muted">{point}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-bold text-ink">Course content</h2>
              <p className="mt-2 text-sm text-muted">
                {course.modules.length} modules · {lessonCount} lessons · {duration}
              </p>

              <div className="mt-6 space-y-3">
                {course.modules.map((mod, idx) => (
                  <details
                    key={mod.id}
                    className="group rounded-sm border border-slate-200 bg-white shadow-card"
                    open={idx === 0}
                  >
                    <summary className="flex cursor-pointer items-center justify-between px-5 py-4 font-semibold text-ink hover:bg-slate-50">
                      <span>
                        Module {idx + 1}: {mod.title}
                      </span>
                      <span className="text-sm font-normal text-muted">
                        {mod.lessons.length} lessons
                      </span>
                    </summary>
                    <ul className="border-t border-slate-100">
                      {mod.lessons.map((lesson, lessonIdx) => (
                        <li
                          key={lesson.id}
                          className="flex items-center gap-3 border-b border-slate-50 px-5 py-3 last:border-0"
                        >
                          {lesson.videoUrl ? (
                            <PlayCircle className="h-4 w-4 shrink-0 text-muted" />
                          ) : (
                            <BookOpen className="h-4 w-4 shrink-0 text-muted" />
                          )}
                          <span className="text-sm text-ink">
                            {lessonIdx + 1}. {lesson.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </section>

            {progressDetails && (
              <section className="mt-12">
                <ProgressTracker progress={progressDetails} />
              </section>
            )}

            <section className="mt-12">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-ink">Community</h2>
                <Link
                  href={`/courses/${id}/forum`}
                  className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline"
                >
                  <MessageSquare className="h-4 w-4" />
                  Discussion forum
                </Link>
              </div>
            </section>

            <CourseReviewsSection
              courseId={id}
              userId={session?.id}
              isEnrolled={isEnrolled}
            />

            <section className="mt-12">
              <h2 className="text-2xl font-bold text-ink">Instructor</h2>
              <div className="mt-6 flex items-start gap-4 rounded-sm border border-slate-200 bg-white p-6 shadow-card">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-700">
                  {course.instructor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-ink">{course.instructor.name}</h3>
                  <p className="mt-1 text-sm text-muted">Course Instructor</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    Expert educator passionate about helping learners master new
                    skills and advance their careers through practical, engaging
                    course content.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
