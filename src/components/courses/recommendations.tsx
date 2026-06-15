import Link from "next/link";
import { Sparkles } from "lucide-react";
import { CourseCard } from "./course-card";
import { countLessons } from "@/lib/courses";

type RecommendedCourse = {
  id: string;
  title: string;
  description: string;
  instructor: { name: string };
  modules: { lessons: unknown[] }[];
  pricePaise?: number;
  thumbnail?: string | null;
  skillLevel?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  matchReason: string;
  confidence: number;
};

export function Recommendations({ courses }: { courses: RecommendedCourse[] }) {
  if (courses.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-brand-500" />
        <h2 className="text-xl font-bold text-ink">AI-recommended for you</h2>
      </div>
      <p className="mt-1 text-sm text-muted">
        Personalized suggestions based on your learning history
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {courses.map((course) => (
          <div key={course.id}>
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-brand-600">{course.matchReason}</span>
              <span className="rounded-sm bg-brand-50 px-2 py-0.5 font-semibold text-brand-700">
                {course.confidence}% match
              </span>
            </div>
            <CourseCard
              id={course.id}
              title={course.title}
              description={course.description}
              instructorName={course.instructor.name}
              lessonCount={countLessons(course.modules)}
              pricePaise={course.pricePaise ?? 0}
              thumbnail={course.thumbnail}
              skillLevel={course.skillLevel}
            />
          </div>
        ))}
      </div>

      <Link
        href="/courses"
        className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:underline"
      >
        Explore all courses →
      </Link>
    </section>
  );
}
