"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import {
  HOME_DESCRIPTION,
  HOME_EYEBROW,
  HOME_INNER,
  HOME_SECTION,
  HOME_SECTION_CENTERED,
  HOME_TITLE,
  homeStaggerDelay,
} from "@/components/home/home-polish";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PRIMARY_FAQS = [
  {
    id: "ai-generation",
    q: "How does AI course generation work?",
    a: "Upload PDFs, documents, or video transcripts and IntelliGen structures modules, lessons, and quizzes automatically. Instructors review and publish when ready.",
  },
  {
    id: "enterprise",
    q: "Is IntelliGen suitable for enterprise teams?",
    a: "Yes. Organization workspaces, private catalogs, member imports, branded certificates, and admin analytics are built for L&D teams at scale.",
  },
  {
    id: "free-trial",
    q: "What does the free trial include?",
    a: "Create an account at no cost, explore free courses, AI-assisted learning, and engagement rewards. Paid courses and All Access plans unlock with subscription or per-course purchase.",
  },
  {
    id: "security",
    q: "How is learner data protected?",
    a: "Role-based access, audit logs, 2FA for admins, device management, and GDPR export/delete tools help meet enterprise security expectations.",
  },
  {
    id: "branding",
    q: "Can we use our own branding on certificates?",
    a: "Organization admins can upload logos and digital signatures. Certificates render with your brand alongside IntelliGen verification.",
  },
] as const;

const MORE_FAQS = [
  {
    id: "all-access",
    q: "What's included in All Access?",
    a: "Every paid course on IntelliGen LMS while your subscription is active, plus certificates on completion and access to new courses as they're published.",
  },
  {
    id: "single-course",
    q: "Can I buy a single course instead?",
    a: "Yes. Open any course page and purchase individually. Free courses remain free forever.",
  },
  {
    id: "cancel",
    q: "How do I cancel my subscription?",
    a: "Manage or cancel anytime from your Razorpay account. Access continues until the end of your billing period.",
  },
  {
    id: "payments",
    q: "Is payment secure?",
    a: "Payments are processed by Razorpay with industry-standard encryption. We never store your card details.",
  },
] as const;

type FaqItem = (typeof PRIMARY_FAQS)[number] | (typeof MORE_FAQS)[number];

function FaqItemRow({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-panel/80 shadow-sm">
      <button
        type="button"
        id={`${panelId}-trigger`}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left sm:px-5"
      >
        <span className="text-sm font-semibold text-ink sm:text-base">{item.q}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted transition-transform duration-300",
            isOpen && "rotate-180 text-brand-500"
          )}
          aria-hidden
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={`${panelId}-trigger`}
        className={cn(
          "grid transition-all duration-300 ease-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <p className="border-t border-border px-4 pb-3.5 pt-2 text-sm leading-relaxed text-muted sm:px-5 sm:pb-4">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

export function HomeFaq() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);

  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className={cn("border-t border-border bg-canvas", HOME_SECTION)}>
      <div className={HOME_INNER}>
        <div className="mx-auto max-w-3xl">
          <AnimateOnScroll className={HOME_SECTION_CENTERED}>
          <p className={HOME_EYEBROW}>FAQ</p>
          <h2 className={cn("mt-2", HOME_TITLE)}>Frequently asked questions</h2>
          <p className={HOME_DESCRIPTION}>
            Quick answers for teams evaluating IntelliGen LMS
          </p>
        </AnimateOnScroll>

        <div className="mt-8 space-y-2.5">
          {PRIMARY_FAQS.map((item, i) => (
            <AnimateOnScroll key={item.id} delay={homeStaggerDelay(i, 40)} animation="fade-up">
              <FaqItemRow
                item={item}
                isOpen={openId === item.id}
                onToggle={() => toggle(item.id)}
              />
            </AnimateOnScroll>
          ))}
        </div>

        <div
          className={cn(
            "grid transition-all duration-300 ease-out",
            showMore ? "mt-2.5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <div className="space-y-2.5 pt-0">
              {MORE_FAQS.map((item) => (
                <FaqItemRow
                  key={item.id}
                  item={item}
                  isOpen={openId === item.id}
                  onToggle={() => toggle(item.id)}
                />
              ))}
            </div>
          </div>
        </div>

        <AnimateOnScroll delay={120} className="mt-5 text-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowMore((value) => !value)}
            aria-expanded={showMore}
          >
            {showMore ? "Show fewer questions" : "View more questions"}
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                showMore && "rotate-180"
              )}
            />
          </Button>
        </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
