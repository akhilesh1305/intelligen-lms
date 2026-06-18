"use client";

import {
  Award,
  Building2,
  MessageSquare,
  Shield,
  Users,
  Video,
} from "lucide-react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import { FeatureCard } from "@/components/ui/feature-card";
import { GradientOrbs } from "@/components/decorative/gradient-orbs";
import { HOME_GRID, HOME_INNER, HOME_SECTION, HOME_SECTION_HEADER_CENTERED, homeStaggerDelay } from "@/components/home/home-polish";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Building2,
    title: "Organization workspaces",
    description:
      "Private catalogs, bulk member imports, and role-based access for distributed teams.",
    gradient: "from-brand-600 to-indigo-600",
  },
  {
    icon: Award,
    title: "Verified certificates",
    description:
      "Branded credentials with public verification — built for compliance and shareability.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Users,
    title: "Skill gap analysis",
    description:
      "Map competencies, identify gaps, and assign the right learning to each role.",
    gradient: "from-rose-500 to-violet-500",
  },
  {
    icon: Shield,
    title: "Enterprise security",
    description:
      "SSO, two-factor authentication, device controls, and audit logs for IT teams.",
    gradient: "from-slate-600 to-brand-600",
  },
  {
    icon: Video,
    title: "Webinars & live sessions",
    description:
      "Host training events, register attendees, and track participation in one place.",
    gradient: "from-cyan-500 to-brand-500",
  },
  {
    icon: MessageSquare,
    title: "Course forums",
    description:
      "Threaded discussions so learners ask questions and stay engaged with content.",
    gradient: "from-emerald-500 to-cyan-500",
  },
];

export function HomeFeatures() {
  return (
    <section className={cn("relative overflow-hidden", HOME_SECTION)}>
      <GradientOrbs variant="section" className="opacity-50" />
      <div className={HOME_INNER}>
        <AnimateOnScroll>
          <SectionHeader
            eyebrow="Platform"
            gradient
            title="Enterprise platform, not just courses"
            description="Governance, teams, credentials, and live training — the foundation L&D teams need to scale."
            className={HOME_SECTION_HEADER_CENTERED}
          />
        </AnimateOnScroll>

        <div className={cn(HOME_GRID, "sm:grid-cols-2 lg:grid-cols-3")}>
          {FEATURES.map((feature, i) => (
            <AnimateOnScroll key={feature.title} delay={homeStaggerDelay(i)} animation="fade-up">
              <FeatureCard {...feature} compact className="h-full" />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
