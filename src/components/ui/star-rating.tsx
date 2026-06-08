import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  reviewCount,
  size = "sm",
  className,
}: {
  rating: string | number;
  reviewCount?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const num = typeof rating === "string" ? parseFloat(rating) : rating;
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const textSize = size === "sm" ? "text-sm" : "text-base";

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className={cn("font-bold text-amber-500", textSize)}>{num.toFixed(1)}</span>
      <Star className={cn(iconSize, "fill-amber-400 text-amber-400")} />
      {reviewCount !== undefined && (
        <span className={cn("text-muted", textSize)}>
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}
