import Image from "next/image";
import { cn } from "@/lib/utils";

type CourseThumbnailProps = {
  thumbnail?: string | null;
  alt: string;
  className?: string;
  fill?: boolean;
};

export function CourseThumbnail({
  thumbnail,
  alt,
  className,
  fill = false,
}: CourseThumbnailProps) {
  if (!thumbnail) return null;

  if (thumbnail.startsWith("data:")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- data URLs from DB uploads
      <img
        src={thumbnail}
        alt={alt}
        className={cn(fill ? "absolute inset-0 h-full w-full object-cover" : className)}
      />
    );
  }

  return (
    <Image
      src={thumbnail}
      alt={alt}
      fill={fill}
      width={fill ? undefined : 640}
      height={fill ? undefined : 360}
      unoptimized={thumbnail.startsWith("/uploads/")}
      className={cn(fill && "object-cover", className)}
    />
  );
}
