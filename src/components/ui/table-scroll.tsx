import { cn } from "@/lib/utils";

export function TableScroll({
  children,
  className,
  hint = true,
}: {
  children: React.ReactNode;
  className?: string;
  hint?: boolean;
}) {
  return (
    <div className={cn("w-full", className)}>
      {hint ? (
        <p className="mb-2 text-xs text-muted md:hidden">
          Swipe horizontally to see all columns
        </p>
      ) : null}
      <div className="-mx-1 overflow-x-auto overscroll-x-contain px-1 pb-1 [webkit-overflow-scrolling:touch]">
        {children}
      </div>
    </div>
  );
}
