import { HomeBenefits } from "@/components/home/home-benefits";
import { HomeCategories } from "@/components/home/home-categories";
import { HomeCta } from "@/components/home/home-cta";
import { HomeFeaturedCourses } from "@/components/home/home-featured-courses";
import { HomeHero } from "@/components/home/home-hero";
import { HomeMindGames } from "@/components/home/home-mind-games";
import { HomeTestimonials } from "@/components/home/home-testimonials";
import { AnimatedCounter } from "@/components/motion/animated-counter";
import { getSession } from "@/lib/auth";
import { CORPORATE_GAMES } from "@/lib/corporate-games";
import { countLessons, getPublishedCourses } from "@/lib/courses";
import { homeCourseThumbnails } from "@/lib/home-images";
import { getFeaturedReviews, getReviewStatsForCourses } from "@/lib/reviews";

const mindGameCount = CORPORATE_GAMES.length + 1;

const stats = [
  { value: "7+", label: "Expert-led courses", color: "text-brand-500" },
  { value: "50+", label: "Lessons available", color: "text-accent-violet" },
  { value: `${mindGameCount}+`, label: "Mind games", color: "text-accent-emerald" },
  { value: "Free & paid", label: "Courses for every budget", color: "text-accent-amber" },
];

export default async function HomePage() {
  const session = await getSession();
  const courses = await getPublishedCourses(
    session ? { id: session.id, role: session.role } : null
  );
  const featuredCourses = courses.slice(0, 6);
  const reviewStats = await getReviewStatsForCourses(featuredCourses.map((c) => c.id));
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
    <div>
      <HomeHero isLoggedIn={!!session} />

      <section className="relative border-b border-border bg-panel/60 backdrop-blur-sm">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border sm:grid-cols-4">
          {stats.map((stat) => (
            <AnimatedCounter
              key={stat.label}
              value={stat.value}
              label={stat.label}
              color={stat.color}
            />
          ))}
        </div>
      </section>

      <HomeMindGames games={CORPORATE_GAMES} />
      <HomeCategories />
      <HomeFeaturedCourses courses={featured} />
      <HomeBenefits />
      <HomeTestimonials reviews={featuredReviews} />
      <HomeCta isLoggedIn={!!session} />
    </div>
  );
}
