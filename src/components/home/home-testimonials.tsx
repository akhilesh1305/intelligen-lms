"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import {
  HOME_CARD,
  HOME_DESCRIPTION,
  HOME_EYEBROW,
  HOME_GRID,
  HOME_INNER,
  HOME_SECTION,
  HOME_SECTION_CENTERED,
  HOME_TITLE,
  homeStaggerDelay,
} from "@/components/home/home-polish";
import { ReviewStars } from "@/components/ui/review-stars";
import { UserAvatar } from "@/components/ui/user-avatar";
import type { FeaturedReview } from "@/lib/reviews";
import { cn } from "@/lib/utils";

const MAX_TESTIMONIALS = 3;

const PLACEHOLDER_REVIEWS = [
  {
    id: "p1",
    comment:
      "IntelliGen cut our onboarding time in half. The AI course builder and analytics gave our L&D team confidence we never had before.",
    rating: 5,
    userName: "Sarah Chen",
    role: "Head of L&D",
    organization: "Northwind Logistics",
    userAvatarUrl: null,
    subtitle: "Head of L&D · Northwind Logistics",
  },
  {
    id: "p2",
    comment:
      "Certificates, gamification, and the AI tutor keep our distributed team engaged. It feels like a modern SaaS product, not legacy LMS software.",
    rating: 5,
    userName: "Marcus Okonkwo",
    role: "Training Manager",
    organization: "Globex Industries",
    userAvatarUrl: null,
    subtitle: "Training Manager · Globex Industries",
  },
  {
    id: "p3",
    comment:
      "We replaced three tools with IntelliGen. Course creation, quizzes, and progress tracking are all in one polished platform.",
    rating: 5,
    userName: "Elena Vasquez",
    role: "HR Director",
    organization: "Acme Corp",
    userAvatarUrl: null,
    subtitle: "HR Director · Acme Corp",
  },
] as const;

type TestimonialItem = {
  id: string;
  comment: string;
  rating: number;
  userName: string;
  userAvatarUrl: string | null;
  subtitle: string;
};

function toTestimonial(review: FeaturedReview): TestimonialItem {
  return {
    id: review.id,
    comment: review.comment,
    rating: review.rating,
    userName: review.userName,
    userAvatarUrl: review.userAvatarUrl,
    subtitle: `Verified learner · ${review.courseTitle}`,
  };
}

function TestimonialCard({
  item,
  className,
}: {
  item: TestimonialItem;
  className?: string;
}) {
  return (
    <article
      className={cn(HOME_CARD, "flex h-full flex-col p-4", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <Quote className="h-6 w-6 shrink-0 text-brand-500/50" aria-hidden />
        <ReviewStars rating={item.rating} size="sm" />
      </div>

      <p className="mt-3 line-clamp-4 flex-1 text-sm leading-relaxed text-ink">
        &ldquo;{item.comment}&rdquo;
      </p>

      <div className="mt-4 flex items-center gap-3 border-t border-border pt-3">
        <UserAvatar
          name={item.userName}
          avatarUrl={item.userAvatarUrl}
          size="sm"
          className="ring-brand-500/20"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{item.userName}</p>
          <p className="truncate text-xs text-muted">{item.subtitle}</p>
        </div>
      </div>
    </article>
  );
}

function TestimonialCarousel({ items }: { items: TestimonialItem[] }) {
  const [active, setActive] = useState(0);
  const count = items.length;

  const goTo = useCallback(
    (index: number) => {
      setActive((index + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (count <= 1) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % count);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [count]);

  return (
    <div className="md:hidden">
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {items.map((item) => (
            <div key={item.id} className="w-full min-w-0 shrink-0">
              <TestimonialCard item={item} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-panel text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === active ? "w-5 bg-brand-500" : "w-2 bg-border hover:bg-muted"
              )}
              aria-label={`Show testimonial ${i + 1}`}
              aria-current={i === active}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(active + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-panel text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function HomeTestimonials({ reviews }: { reviews: FeaturedReview[] }) {
  const hasLiveReviews = reviews.length > 0;
  const items: TestimonialItem[] = (
    hasLiveReviews ? reviews.map(toTestimonial) : [...PLACEHOLDER_REVIEWS]
  ).slice(0, MAX_TESTIMONIALS);

  return (
    <section className={cn("border-y border-border bg-panel/50 dark:bg-panel/30", HOME_SECTION)}>
      <div className={HOME_INNER}>
        <AnimateOnScroll className={cn(HOME_SECTION_CENTERED, "max-w-2xl")}>
          <p className={HOME_EYEBROW}>Social proof</p>
          <h2 className={cn("mt-2", HOME_TITLE)}>Trusted by learning teams</h2>
          <p className={HOME_DESCRIPTION}>
            {hasLiveReviews
              ? "Top-rated feedback from enrolled learners"
              : "What L&D leaders say about IntelliGen"}
          </p>
        </AnimateOnScroll>

        <div className={HOME_GRID}>
          <TestimonialCarousel items={items} />

          <div className="hidden gap-4 md:grid md:grid-cols-3">
            {items.map((item, i) => (
              <AnimateOnScroll key={item.id} delay={homeStaggerDelay(i)} animation="fade-up">
                <TestimonialCard item={item} />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
