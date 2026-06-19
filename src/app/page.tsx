import { HomeAiShowcase } from "@/components/home/home-ai-showcase";
import { HomeBenefits } from "@/components/home/home-benefits";
import { HomeCategories } from "@/components/home/home-categories";
import { HomeCta } from "@/components/home/home-cta";
import { HomeDemoVideo } from "@/components/home/home-demo-video";
import { HomeFaq } from "@/components/home/home-faq";
import { HomeFeaturedCourses } from "@/components/home/home-featured-courses";
import { HomeFeatures } from "@/components/home/home-features";
import { HomeGamification } from "@/components/home/home-gamification";
import { HomeHero } from "@/components/home/home-hero";
import { HomeHowItWorks } from "@/components/home/home-how-it-works";
import { HomeTestimonials } from "@/components/home/home-testimonials";
import { HomeTrust } from "@/components/home/home-trust";
import { getSession } from "@/lib/auth";
import { countLessons, getPublishedCourses } from "@/lib/courses";
import { homeCourseThumbnails } from "@/lib/home-images";
import { getFeaturedReviews, getReviewStatsForCourses } from "@/lib/reviews";
import { HOME_PAGE } from "@/components/home/home-polish";

export default async function HomePage() {
  const session = await getSession();
  const courses = await getPublishedCourses(
    session ? { id: session.id, role: session.role } : null
  );
  const reviewStats = await getReviewStatsForCourses(courses.map((c) => c.id));

  const featuredCourses = [...courses]
    .sort((a, b) => {
      const aStats = reviewStats.get(a.id);
      const bStats = reviewStats.get(b.id);
      const aScore =
        (aStats?.rating ?? 0) * 20 +
        (aStats?.count ?? 0) * 10 +
        (a.pricePaise > 0 ? 8 : 0) +
        a._count.enrollments;
      const bScore =
        (bStats?.rating ?? 0) * 20 +
        (bStats?.count ?? 0) * 10 +
        (b.pricePaise > 0 ? 8 : 0) +
        b._count.enrollments;
      return bScore - aScore;
    })
    .slice(0, 4);
  const featuredReviews = await getFeaturedReviews(3);

  const featuredThumbnails = homeCourseThumbnails(featuredCourses);
  const featured = featuredCourses.map((course, index) => {
    const stats = reviewStats.get(course.id);
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      instructorName: course.instructor.name,
      lessonCount: countLessons(course.modules),
      pricePaise: course.pricePaise,
      thumbnail: featuredThumbnails[index],
      skillLevel: course.skillLevel,
      rating: stats?.rating ?? null,
      reviewCount: stats?.count ?? 0,
    };
  });

  return (
    <div className={HOME_PAGE}>
      <HomeHero isLoggedIn={!!session} />
      <HomeTrust />
      <HomeHowItWorks />

      <HomeFeatures />
      <HomeAiShowcase />
      <HomeDemoVideo />
      <HomeCategories />
      <HomeFeaturedCourses courses={featured} />
      <HomeGamification />
      <HomeBenefits />
      <HomeTestimonials reviews={featuredReviews} />
      <HomeFaq />
      <HomeCta isLoggedIn={!!session} />
    </div>
  );
}
