import Link from "next/link";
import { getPublishedCourses, countLessons } from "@/lib/courses";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CourseCard } from "@/components/courses/course-card";
import { getCourseCategory } from "@/lib/course-visuals";
import { cn } from "@/lib/utils";

const filterCategories = [
  "All",
  "Development",
  "Data Science",
  "Design",
  "Marketing",
  "Management",
];

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const session = await getSession();
  const { q, category } = await searchParams;
  const courses = await getPublishedCourses();

  let enrolledIds = new Set<string>();
  const progressMap = new Map<string, number>();

  if (session) {
    const enrollments = await db.enrollment.findMany({
      where: { userId: session.id },
      include: {
        course: { include: { modules: { include: { lessons: true } } } },
      },
    });
    enrolledIds = new Set(enrollments.map((e) => e.courseId));

    for (const e of enrollments) {
      progressMap.set(e.courseId, e.progressPercent);
    }
  }

  const query = q?.toLowerCase() ?? "";
  const activeCategory = category ?? "All";

  const filtered = courses.filter((course) => {
    const matchesQuery =
      !query ||
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      course.instructor.name.toLowerCase().includes(query);

    const courseCategory = getCourseCategory(course.title);
    const matchesCategory =
      activeCategory === "All" || courseCategory === activeCategory;

    return matchesQuery && matchesCategory;
  });

  return (
    <div>
      {/* Page header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-ink sm:text-4xl">
            {query ? `Results for "${q}"` : "Explore courses"}
          </h1>
          <p className="mt-2 text-lg text-muted">
            {filtered.length} course{filtered.length !== 1 ? "s" : ""} available
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Mobile category pills */}
        <div className="scrollbar-hide -mx-4 mb-6 overflow-x-auto px-4 lg:hidden">
          <div className="flex gap-2">
            {filterCategories.map((cat) => (
              <Link
                key={cat}
                href={
                  cat === "All"
                    ? `/courses${q ? `?q=${encodeURIComponent(q)}` : ""}`
                    : `/courses?category=${encodeURIComponent(cat)}${q ? `&q=${encodeURIComponent(q)}` : ""}`
                }
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  activeCategory === cat
                    ? "bg-brand-600 text-white"
                    : "bg-white text-muted ring-1 ring-slate-200"
                )}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar filters */}
          <aside className="hidden shrink-0 lg:block lg:w-56">
            <div className="sticky top-36 rounded-sm border border-slate-200 bg-white p-5 shadow-card">
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink">
                Categories
              </h2>
              <ul className="mt-4 space-y-1">
                {filterCategories.map((cat) => (
                  <li key={cat}>
                    <Link
                      href={
                        cat === "All"
                          ? `/courses${q ? `?q=${encodeURIComponent(q)}` : ""}`
                          : `/courses?category=${encodeURIComponent(cat)}${q ? `&q=${encodeURIComponent(q)}` : ""}`
                      }
                      className={cn(
                        "block rounded-sm px-3 py-2 text-sm font-medium transition-colors",
                        activeCategory === cat
                          ? "bg-brand-50 text-brand-700"
                          : "text-muted hover:bg-slate-50 hover:text-ink"
                      )}
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Course grid */}
          <div className="min-w-0 flex-1">
            {filtered.length === 0 ? (
              <div className="rounded-sm border border-dashed border-slate-300 bg-white py-20 text-center">
                <p className="text-lg font-semibold text-ink">No courses found</p>
                <p className="mt-2 text-muted">Try adjusting your search or filters</p>
                <Link href="/courses" className="mt-6 inline-block text-brand-600 font-semibold hover:underline">
                  View all courses
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((course) => (
                  <CourseCard
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    instructorName={course.instructor.name}
                    lessonCount={countLessons(course.modules)}
                    enrolled={enrolledIds.has(course.id)}
                    progress={progressMap.get(course.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
