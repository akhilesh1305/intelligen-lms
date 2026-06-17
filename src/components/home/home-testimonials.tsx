"use client";

import { Quote } from "lucide-react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import { ReviewStars } from "@/components/ui/review-stars";
import { UserAvatar } from "@/components/ui/user-avatar";
import type { FeaturedReview } from "@/lib/reviews";
import { cn } from "@/lib/utils";

const accents = [
  "border-brand-500/30 bg-brand-500/5",
  "border-violet-500/30 bg-violet-500/5",
  "border-emerald-500/30 bg-emerald-500/5",
];

const PLACEHOLDER_REVIEWS = [
  {
    id: "p1",
    comment:
      "IntelliGen cut our onboarding time in half. The AI course builder and analytics gave our L&D team confidence we never had before.",
    rating: 5,
    userName: "Sarah Chen",
    role: "Head of L&D",
    organization: "Northwind Logistics",
    courseTitle: "Workplace Safety",
    userAvatarUrl: null,
  },
  {
    id: "p2",
    comment:
      "Certificates, gamification, and the AI tutor keep our distributed team engaged. It feels like a modern SaaS product, not legacy LMS software.",
    rating: 5,
    userName: "Marcus Okonkwo",
    role: "Training Manager",
    organization: "Globex Industries",
    courseTitle: "Leadership Essentials",
    userAvatarUrl: null,
  },
  {
    id: "p3",
    comment:
      "We replaced three tools with IntelliGen. Course creation, quizzes, and progress tracking are all in one polished platform.",
    rating: 5,
    userName: "Elena Vasquez",
    role: "HR Director",
    organization: "Acme Corp",
    courseTitle: "Compliance Fundamentals",
    userAvatarUrl: null,
  },
] as const;

type DisplayReview = FeaturedReview | (typeof PLACEHOLDER_REVIEWS)[number];

export function HomeTestimonials({ reviews }: { reviews: FeaturedReview[] }) {
  const display: DisplayReview[] =
    reviews.length > 0 ? reviews : [...PLACEHOLDER_REVIEWS];

  return (
    <section className="border-y border-border bg-panel/50 px-4 py-24 dark:bg-panel/30 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimateOnScroll className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-ink sm:text-4xl">
            Loved by Learners and Teams
          </h2>
          <p className="mt-3 text-muted">
            {reviews.length > 0
              ? "Real ratings and reviews from enrolled learners"
              : "Representative feedback from enterprise learning teams"}
          </p>
        </AnimateOnScroll>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {display.map((review, i) => (
            <AnimateOnScroll key={review.id} delay={i * 120} animation="fade-up">
              <article
                className={cn(
                  "glass-card relative flex h-full flex-col rounded-[20px] border p-6 shadow-card transition-all duration-300 motion-safe:hover:-translate-y-1.5 motion-safe:hover:shadow-card-hover",
                  accents[i % accents.length]
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <Quote className="h-8 w-8 shrink-0 text-brand-400/60" />
                  <div className="text-right">
                    <ReviewStars rating={review.rating} />
                    <p className="mt-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                      {review.rating}.0 / 5
                    </p>
                  </div>
                </div>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-ink">
                  &ldquo;{review.comment}&rdquo;
                </p>

                <p className="mt-3 text-xs font-medium text-brand-600 dark:text-brand-400">
                  Course: {review.courseTitle}
                </p>

                <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                  <UserAvatar
                    name={review.userName}
                    avatarUrl={review.userAvatarUrl}
                    size="md"
                    className="ring-brand-500/30"
                  />
                  <div>
                    <p className="font-semibold text-ink">{review.userName}</p>
                    <p className="text-xs text-muted">
                      {"role" in review && review.role
                        ? `${review.role} · ${review.organization}`
                        : "Verified learner"}
                    </p>
                  </div>
                </div>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
