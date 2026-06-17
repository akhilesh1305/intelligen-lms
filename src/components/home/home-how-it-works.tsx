"use client";

import { Award, BookOpen, UserPlus } from "lucide-react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import { SectionHeader } from "@/components/ui/section-header";

const STEPS = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create your account",
    description: "Sign up in minutes. Invite your team or start solo — no credit card required.",
    gradient: "from-brand-500 to-violet-600",
  },
  {
    icon: BookOpen,
    step: "02",
    title: "Enroll & learn with AI",
    description: "Browse courses, get AI tutoring, quizzes, and personalized learning paths.",
    gradient: "from-cyan-500 to-brand-500",
  },
  {
    icon: Award,
    step: "03",
    title: "Earn credentials",
    description: "Complete courses, collect badges, and issue branded certificates to your team.",
    gradient: "from-emerald-500 to-cyan-500",
  },
];

export function HomeHowItWorks() {
  return (
    <section className="border-y border-border bg-panel/40 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimateOnScroll>
          <SectionHeader
            gradient
            title="How it works"
            description="From signup to certified teams in three steps."
            className="text-center [&_h2]:mx-auto [&_p]:mx-auto"
          />
        </AnimateOnScroll>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map((item, i) => (
            <AnimateOnScroll key={item.step} delay={i * 80} animation="fade-up">
              <article className="glass-card relative h-full rounded-[20px] p-6">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-500">
                  Step {item.step}
                </span>
                <div
                  className={`mt-4 flex h-12 w-12 items-center justify-center rounded-[14px] bg-gradient-to-br ${item.gradient} text-white shadow-lg`}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
