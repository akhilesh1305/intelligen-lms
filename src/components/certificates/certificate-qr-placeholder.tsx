import { cn } from "@/lib/utils";

export function CertificateQrPlaceholder({
  certificateNo,
  className,
}: {
  certificateNo: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-[14px] border border-border/80 bg-panel/60 p-4 backdrop-blur-sm",
        className
      )}
    >
      <div
        className="relative grid h-28 w-28 grid-cols-8 grid-rows-8 gap-px rounded-lg border border-border bg-white p-1.5 dark:bg-slate-900"
        aria-hidden
      >
        {Array.from({ length: 64 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "rounded-[1px]",
              [0, 1, 2, 7, 8, 14, 15, 16, 48, 49, 55, 56, 57, 58, 59, 60, 61, 62, 63].includes(
                i
              ) || i % 7 === 3
                ? "bg-ink dark:bg-white"
                : "bg-transparent"
            )}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 rounded border-2 border-ink bg-white dark:border-white dark:bg-slate-900" />
        </div>
      </div>
      <p className="text-center text-[10px] font-semibold uppercase tracking-wider text-muted">
        Scan to verify
      </p>
      <p className="max-w-[9rem] break-all text-center font-mono text-[10px] text-muted">
        {certificateNo}
      </p>
    </div>
  );
}
