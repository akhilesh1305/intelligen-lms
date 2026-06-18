"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Clock, User } from "lucide-react";
import { CourseThumbnail } from "@/components/courses/course-thumbnail";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import {
  HOME_CARD,
  HOME_CARD_FOCUS,
  HOME_DESCRIPTION,
  HOME_EYEBROW,
  HOME_GRID,
  HOME_INNER,
  HOME_SECTION,
  HOME_TITLE,
  homeStaggerDelay,
} from "@/components/home/home-polish";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StarRating } from "@/components/ui/star-rating";
import { formatInr, isFreeCourse } from "@/lib/currency";
import {
  getCourseCategory,
  getCourseDuration,
  getCourseGradient,
  getCourseLevel,
} from "@/lib/course-visuals";
import { cn } from "@/lib/utils";

export type FeaturedCourse = {
  id: string;
  title: string;
  description: string;
  instructorName: string;
  lessonCount: number;
  pricePaise: number;
  thumbnail: string | null;
  skillLevel?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  rating?: number | null;
  reviewCount?: number;
};

const MAX_FEATURED = 4;

function FeaturedLeadCard({ course }: { course: FeaturedCourse }) {
  const gradient = getCourseGradient(course.id);
  const category = getCourseCategory(course.title);
  const level = getCourseLevel(course.title, course.skillLevel);
  const duration = getCourseDuration(course.lessonCount);

  return (
    <Link
      href={`/courses/${course.id}`}
      className={cn("group block h-full", HOME_CARD_FOCUS)}
    >
      <article className={cn(HOME_CARD, "flex h-full flex-col overflow-hidden p-0")}>
        <div
          className={cn(
            "relative flex h-36 shrink-0 items-end overflow-hidden bg-gradient-to-br p-4 sm:h-40",
            gradient
          )}
        >
          {course.thumbnail ? (
            <CourseThumbnail
              thumbnail={course.thumbnail}
              alt={course.title}
              fill
              className="transition-transform duration-500 motion-safe:group-hover:scale-105"
            />
          ) : null}
          <div className="absolute inset-0 bg-black/15 transition-colors group-hover:bg-black/10" />
          <div className="relative flex flex-wrap gap-2">
            <Badge variant="brand" className="bg-white/20 text-white ring-white/30">
              Featured
            </Badge>
            <Badge variant="brand" className="bg-white/20 text-white ring-white/30">
              {category}
            </Badge>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <Badge className="w-fit normal-case tracking-normal">{level}</Badge>
          <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-ink transition-colors group-hover:text-brand-600">
            {course.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted">{course.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
            <span className="inline-flex items-center gap-1">
              <User className="h-3.5 w-3.5 shrink-0" />
              {course.instructorName}
            </span>
            <span className="text-border">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {duration}
            </span>
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
            {course.rating != null && (course.reviewCount ?? 0) > 0 ? (
              <StarRating rating={course.rating} reviewCount={course.reviewCount} />
            ) : (
              <span className="text-xs text-muted">New course</span>
            )}
            <span className="text-base font-bold text-ink">
              {isFreeCourse(course.pricePaise) ? "Free" : formatInr(course.pricePaise)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function FeaturedCompactCard({ course }: { course: FeaturedCourse }) {
  const gradient = getCourseGradient(course.id);
  const level = getCourseLevel(course.title, course.skillLevel);
  const duration = getCourseDuration(course.lessonCount);

  return (
    <Link
      href={`/courses/${course.id}`}
      className={cn("group block", HOME_CARD_FOCUS)}
    >
      <article className={cn(HOME_CARD, "flex overflow-hidden p-0 motion-safe:hover:-translate-y-0.5")}>
        <div
          className={cn(
            "relative w-24 shrink-0 self-stretch min-h-[5.5rem] overflow-hidden bg-gradient-to-br sm:w-28",
            gradient
          )}
        >
          {course.thumbnail ? (
            <CourseThumbnail
              thumbnail={course.thumbnail}
              alt={course.title}
              fill
              className="transition-transform duration-500 motion-safe:group-hover:scale-105"
            />
          ) : null}
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 p-3">
          <div className="flex items-center justify-between gap-2">
            <Badge className="normal-case tracking-normal">{level}</Badge>
            <span className="shrink-0 text-sm font-bold text-ink">
              {isFreeCourse(course.pricePaise) ? "Free" : formatInr(course.pricePaise)}
            </span>
          </div>
          <h3 className="line-clamp-1 text-sm font-bold text-ink transition-colors group-hover:text-brand-600">
            {course.title}
          </h3>
          <p className="line-clamp-1 text-xs text-muted">
            {course.instructorName} · {duration}
          </p>
        </div>
      </article>
    </Link>
  );
}

export function HomeFeaturedCourses({ courses }: { courses: FeaturedCourse[] }) {
  const featured = courses.slice(0, MAX_FEATURED);
  const [lead, ...rest] = featured;

  return (
    <section className={cn("border-y border-border bg-panel/50 dark:bg-panel/30", HOME_SECTION)}>
      <div className={HOME_INNER}>
        <AnimateOnScroll className="max-w-2xl">
          <p className={HOME_EYEBROW}>Start learning</p>
          <h2 className={cn("mt-2", HOME_TITLE)}>Featured courses</h2>
          <p className={HOME_DESCRIPTION}>
            A curated pick of our best-rated training — explore the full catalog when
            you&apos;re ready.
          </p>
        </AnimateOnScroll>

        {featured.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Courses coming soon"
            description="New expert-led courses are being added. Check back shortly or create your own."
            action={{ label: "View all courses", href: "/courses" }}
            secondaryAction={{ label: "Become an instructor", href: "/register" }}
            className="mt-8"
          />
        ) : (
          <>
            <div
              className={cn(
                HOME_GRID,
                rest.length > 0 ? "lg:grid-cols-5 lg:items-stretch" : "max-w-2xl"
              )}
            >
              <AnimateOnScroll
                className={rest.length > 0 ? "lg:col-span-2" : undefined}
                animation="fade-up"
              >
                <FeaturedLeadCard course={lead} />
              </AnimateOnScroll>

              {rest.length > 0 ? (
                <div className="flex flex-col gap-3 lg:col-span-3">
                  {rest.map((course, i) => (
                    <AnimateOnScroll key={course.id} delay={homeStaggerDelay(i + 1)} animation="fade-up">
                      <FeaturedCompactCard course={course} />
                    </AnimateOnScroll>
                  ))}
                </div>
              ) : null}
            </div>

            <AnimateOnScroll delay={180} className="mt-6 flex justify-center">
              <Link href="/courses">
                <Button size="lg" className="motion-safe:hover:scale-[1.02]">
                  View all courses
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </AnimateOnScroll>
          </>
        )}
      </div>
    </section>
  );
}
