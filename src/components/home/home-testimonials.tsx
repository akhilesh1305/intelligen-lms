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

export function HomeTestimonials({ reviews }: { reviews: FeaturedReview[] }) {
  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="border-y border-border bg-panel/50 py-16 dark:bg-panel/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-ink">Loved by learners worldwide</h2>
          <p className="mt-3 text-muted">
            Real ratings and reviews from enrolled learners
          </p>
        </AnimateOnScroll>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((review, i) => (
            <AnimateOnScroll key={review.id} delay={i * 120} animation="fade-up">
              <article
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border p-6 shadow-card transition-transform duration-300 hover:-translate-y-1 hover:shadow-card-hover",
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
                    <p className="text-xs text-muted">Verified learner</p>
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
