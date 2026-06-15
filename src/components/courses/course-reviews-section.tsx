import { ReviewStars } from "@/components/ui/review-stars";
import { UserAvatar } from "@/components/ui/user-avatar";
import { CourseReviewForm } from "@/components/courses/course-review-form";
import { getCourseReviews, getUserCourseReview } from "@/lib/reviews";
import { formatDate } from "@/lib/utils";

export async function CourseReviewsSection({
  courseId,
  userId,
  isEnrolled,
}: {
  courseId: string;
  userId?: string;
  isEnrolled: boolean;
}) {
  const [reviews, userReview] = await Promise.all([
    getCourseReviews(courseId),
    userId ? getUserCourseReview(userId, courseId) : null,
  ]);

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-ink">Learner reviews</h2>
      <p className="mt-2 text-sm text-muted">
        {reviews.length} review{reviews.length !== 1 ? "s" : ""} from enrolled learners
      </p>

      {isEnrolled && userId ? (
        <div className="mt-6">
          <CourseReviewForm
            courseId={courseId}
            initialRating={userReview?.rating}
            initialComment={userReview?.comment}
          />
        </div>
      ) : null}

      <div className="mt-8 space-y-4">
        {reviews.length === 0 ? (
          <p className="rounded-xl border border-border bg-panel p-6 text-sm text-muted">
            No reviews yet. Be the first to rate this course after enrolling.
          </p>
        ) : (
          reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-xl border border-border bg-panel p-5 shadow-card"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    name={review.user.name}
                    avatarUrl={review.user.avatarUrl}
                    size="md"
                  />
                  <div>
                    <p className="font-semibold text-ink">{review.user.name}</p>
                    <p className="text-xs text-muted">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <ReviewStars rating={review.rating} />
              </div>
              {review.comment ? (
                <p className="mt-4 text-sm leading-relaxed text-muted">{review.comment}</p>
              ) : null}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
