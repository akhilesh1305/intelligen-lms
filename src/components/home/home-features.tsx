"use client";

import {
  Award,
  BarChart3,
  Bot,
  Brain,
  Building2,
  Map,
  Sparkles,
  Users,
} from "lucide-react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import { FeatureCard } from "@/components/ui/feature-card";
import { GradientOrbs } from "@/components/decorative/gradient-orbs";
import { SectionHeader } from "@/components/ui/section-header";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Course Generator",
    description:
      "Turn PDFs, videos, and docs into structured courses with modules and lessons in minutes.",
    gradient: "from-brand-500 to-violet-600",
  },
  {
    icon: Brain,
    title: "AI Quiz Builder",
    description:
      "Auto-generate assessments from your content with difficulty tuning and instant feedback.",
    gradient: "from-violet-500 to-brand-500",
  },
  {
    icon: Map,
    title: "AI Learning Paths",
    description:
      "Personalized roadmaps that adapt to skills, roles, and completion goals.",
    gradient: "from-cyan-500 to-brand-500",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description:
      "Real-time dashboards for completion, engagement, and course performance.",
    gradient: "from-emerald-500 to-cyan-500",
  },
  {
    icon: Award,
    title: "Certificates",
    description:
      "Branded, verifiable credentials with org signatures and partnership seals.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Building2,
    title: "Team Management",
    description:
      "Org workspaces, member imports, role-based access, and private catalogs.",
    gradient: "from-brand-600 to-indigo-600",
  },
  {
    icon: Users,
    title: "Skill Gap Analysis",
    description:
      "Identify competency gaps and assign targeted learning automatically.",
    gradient: "from-rose-500 to-violet-500",
  },
  {
    icon: Bot,
    title: "AI Tutor Assistant",
    description:
      "24/7 coaching, summaries, career guidance, and in-context help for learners.",
    gradient: "from-brand-500 to-accent-cyan",
  },
];

export function HomeFeatures() {
  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      <GradientOrbs variant="section" className="opacity-50" />
      <div className="relative mx-auto max-w-7xl">
        <AnimateOnScroll>
          <SectionHeader
            gradient
            title="Everything you need to scale learning"
            description="Enterprise-grade AI tools that help L&D teams ship training faster and prove impact."
            className="text-center [&_h2]:mx-auto [&_p]:mx-auto"
          />
        </AnimateOnScroll>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <AnimateOnScroll key={feature.title} delay={i * 60} animation="fade-up">
              <FeatureCard {...feature} className="glass-card h-full rounded-[20px]" />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
