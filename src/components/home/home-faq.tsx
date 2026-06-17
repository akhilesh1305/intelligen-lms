"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "How does AI course generation work?",
    a: "Upload PDFs, documents, or video transcripts and IntelliGen structures modules, lessons, and quizzes automatically. Instructors review and publish when ready.",
  },
  {
    q: "Is IntelliGen suitable for enterprise teams?",
    a: "Yes. Organization workspaces, private catalogs, member imports, branded certificates, and admin analytics are built for L&D teams at scale.",
  },
  {
    q: "Can we use our own branding on certificates?",
    a: "Organization admins can upload logos and digital signatures. Certificates render with your brand alongside IntelliGen verification.",
  },
  {
    q: "What does the free trial include?",
    a: "Create an account at no cost, explore free courses, AI tools, and gamification. Paid courses and All Access plans unlock with subscription or per-course purchase.",
  },
  {
    q: "How is learner data protected?",
    a: "Role-based access, audit logs, 2FA for admins, device management, and GDPR export/delete tools help meet enterprise security expectations.",
  },
];

export function HomeFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <AnimateOnScroll>
          <SectionHeader
            gradient
            title="Frequently asked questions"
            description="Everything teams ask before rolling out AI-powered learning."
            className="text-center [&_h2]:mx-auto [&_p]:mx-auto"
          />
        </AnimateOnScroll>

        <div className="mt-12 space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <AnimateOnScroll key={item.q} delay={i * 50} animation="fade-up">
                <div className="overflow-hidden rounded-[20px] border border-border bg-panel/80 shadow-card backdrop-blur-sm">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-semibold text-ink">{item.q}</span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-muted transition-transform duration-300",
                        isOpen && "rotate-180"
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
                      <p className="px-6 pb-5 text-sm leading-relaxed text-muted">{item.a}</p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
