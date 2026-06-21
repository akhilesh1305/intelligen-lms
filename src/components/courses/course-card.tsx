import Link from "next/link";
import { Clock, User } from "lucide-react";
import { CourseThumbnail } from "@/components/courses/course-thumbnail";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StarRating } from "@/components/ui/star-rating";
import { formatInr, isFreeCourse } from "@/lib/currency";
import { cn } from "@/lib/utils";
import {
  getCourseCategory,
  getCourseDuration,
  getCourseGradient,
  getCourseLevel,
} from "@/lib/course-visuals";

type CourseCardProps = {
  id: string;
  title: string;
  description: string;
  instructorName: string;
  lessonCount: number;
  enrolled?: boolean;
  progress?: number;
  published?: boolean;
  pricePaise?: number;
  thumbnail?: string | null;
  skillLevel?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  variant?: "default" | "compact";
  href?: string;
  rating?: number | null;
  reviewCount?: number;
};

export function CourseCard({
  id,
  title,
  description,
  instructorName,
  lessonCount,
  enrolled,
  progress,
  published,
  pricePaise = 0,
  thumbnail,
  skillLevel,
  variant = "default",
  href: hrefOverride,
  rating = null,
  reviewCount = 0,
}: CourseCardProps) {
  const href = hrefOverride ?? (enrolled ? `/learn/${id}` : `/courses/${id}`);
  const gradient = getCourseGradient(id);
  const category = getCourseCategory(title);
  const duration = getCourseDuration(lessonCount);
  const level = getCourseLevel(title, skillLevel);

  return (
    <Link href={href} className="group block h-full">
      <article
        data-cursor-hover
        className={cn(
          "group flex h-full flex-col overflow-hidden rounded-[20px] border border-border bg-panel/90 shadow-card backdrop-blur-sm transition-all duration-300 motion-safe:hover:-translate-y-2 motion-safe:hover:border-brand-400/40 motion-safe:hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:bg-panel/80",
          variant === "compact" && "flex-row"
        )}
      >
        <div
          className={cn(
            "relative flex shrink-0 items-end overflow-hidden bg-gradient-to-br p-4",
            gradient,
            variant === "default" ? "h-40" : "h-auto w-36 sm:w-44"
          )}
        >
          {thumbnail ? (
            <CourseThumbnail
              thumbnail={thumbnail}
              alt={title}
              fill
              className="transition-transform duration-700 group-hover:scale-110"
            />
          ) : null}
          <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/5" />
          <div className="relative w-full">
            <Badge variant="brand" className="bg-white/20 text-white ring-white/30">
              {category}
            </Badge>
            {published === false && (
              <Badge variant="warning" className="ml-2">
                Draft
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="mb-1 flex items-center gap-2">
            <Badge className="normal-case tracking-normal">{level}</Badge>
            {enrolled && <Badge variant="success">Enrolled</Badge>}
          </div>

          <h3 className="line-clamp-2 text-base font-bold leading-snug text-ink transition-colors group-hover:text-brand-600">
            {title}
          </h3>

          <p className="mt-1.5 line-clamp-2 text-sm text-muted">{description}</p>

          <div className="mt-3 flex items-center gap-1 text-sm text-muted">
            <User className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{instructorName}</span>
            <span className="text-border">·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {duration}
            </span>
          </div>

          <div className="mt-auto border-t border-border pt-3">
            <div className="flex items-center justify-between gap-2">
              {rating != null && reviewCount > 0 ? (
                <StarRating rating={rating} reviewCount={reviewCount} />
              ) : (
                <span className="text-xs text-muted">No reviews yet</span>
              )}
              <span className="text-sm font-bold text-ink">
                {isFreeCourse(pricePaise) ? "Free" : formatInr(pricePaise)}
              </span>
            </div>
          </div>

          {enrolled && progress !== undefined && (
            <div className="mt-4 border-t border-border pt-4">
              <div className="mb-1.5 flex justify-between text-xs font-semibold text-muted">
                <span>Your progress</span>
                <span className="text-brand-600">{progress}%</span>
              </div>
              <ProgressBar value={progress} />
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
