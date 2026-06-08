import Link from "next/link";
import { Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StarRating } from "@/components/ui/star-rating";
import { cn } from "@/lib/utils";
import {
  getCourseCategory,
  getCourseDuration,
  getCourseGradient,
  getCourseLevel,
  getCourseRating,
  getCourseReviewCount,
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
  variant?: "default" | "compact";
  href?: string;
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
  variant = "default",
  href: hrefOverride,
}: CourseCardProps) {
  const href = hrefOverride ?? (enrolled ? `/learn/${id}` : `/courses/${id}`);
  const gradient = getCourseGradient(id);
  const category = getCourseCategory(title);
  const rating = getCourseRating(id);
  const reviewCount = getCourseReviewCount(id);
  const duration = getCourseDuration(lessonCount);
  const level = getCourseLevel(title);

  return (
    <Link href={href} className="group block h-full">
      <article
        className={cn(
          "flex h-full flex-col overflow-hidden rounded-sm border border-slate-200/80 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover",
          variant === "compact" && "flex-row"
        )}
      >
        <div
          className={cn(
            "relative flex shrink-0 items-end bg-gradient-to-br p-4",
            gradient,
            variant === "default" ? "h-40" : "h-auto w-36 sm:w-44"
          )}
        >
          <div className="absolute inset-0 bg-black/10" />
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

          <h3 className="line-clamp-2 font-bold leading-snug text-ink group-hover:text-brand-600">
            {title}
          </h3>

          <p className="mt-1.5 line-clamp-2 text-sm text-muted">{description}</p>

          <div className="mt-3 flex items-center gap-1 text-sm text-muted">
            <User className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{instructorName}</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
            <StarRating rating={rating} reviewCount={reviewCount} />
            <span className="flex items-center gap-1 text-sm text-muted">
              <Clock className="h-3.5 w-3.5" />
              {duration}
            </span>
          </div>

          {enrolled && progress !== undefined && (
            <div className="mt-4 border-t border-slate-100 pt-4">
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
