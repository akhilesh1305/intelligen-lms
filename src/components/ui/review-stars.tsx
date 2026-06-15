import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReviewStars({
  rating,
  size = "sm",
  className,
}: {
  rating: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            iconSize,
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-border dark:text-slate-600"
          )}
        />
      ))}
    </div>
  );
}
