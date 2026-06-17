import { InputHTMLAttributes, forwardRef, type ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const Checkbox = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label: React.ReactNode }
>(({ className, label, id, ...props }, ref) => (
  <label
    htmlFor={id}
    className={cn(
      "flex cursor-pointer items-start gap-3 text-sm text-muted",
      props.disabled && "cursor-not-allowed opacity-60",
      className
    )}
  >
    <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className="peer sr-only"
        {...props}
      />
      <span className="flex h-5 w-5 items-center justify-center rounded-[6px] border border-border bg-panel shadow-sm transition-colors peer-checked:border-brand-500 peer-checked:bg-brand-500 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/25 dark:bg-panel" />
      <Check className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
    </span>
    <span className="leading-relaxed">{label}</span>
  </label>
));
Checkbox.displayName = "Checkbox";
