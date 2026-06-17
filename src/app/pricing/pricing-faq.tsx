"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "What's included in All Access?",
    a: "Every paid course on IntelliGen LMS while your subscription is active, plus certificates on completion and access to new courses as they're published.",
  },
  {
    q: "Can I buy a single course instead?",
    a: "Yes. Open any course page and purchase individually. Free courses remain free forever.",
  },
  {
    q: "How do I cancel?",
    a: "Manage or cancel your subscription anytime from your Razorpay account. Access continues until the end of your billing period.",
  },
  {
    q: "Is payment secure?",
    a: "Payments are processed by Razorpay with industry-standard encryption. We never store your card details.",
  },
];

export function PricingFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {FAQS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className={cn(
              "overflow-hidden rounded-[20px] border border-border bg-panel shadow-card transition-all duration-200",
              isOpen && "shadow-card-hover ring-1 ring-brand-500/10"
            )}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-surface/80 dark:hover:bg-slate-800/40"
            >
              <span className="text-base font-semibold text-ink">{item.q}</span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-muted transition-transform duration-300 ease-out",
                  isOpen && "rotate-180 text-brand-500"
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="border-t border-border px-5 pb-5 pt-3 text-sm leading-relaxed text-muted">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
