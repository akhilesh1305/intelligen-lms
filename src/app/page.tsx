import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  Globe,
  PlayCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/courses/course-card";
import { SectionHeader } from "@/components/ui/section-header";
import { SearchBar } from "@/components/layout/search-bar";
import { getSession } from "@/lib/auth";
import { countLessons, getPublishedCourses } from "@/lib/courses";

const stats = [
  { value: "7+", label: "Expert-led courses" },
  { value: "50+", label: "Lessons available" },
  { value: "3", label: "Learning paths" },
  { value: "100%", label: "Free to enroll" },
];

const categories = [
  { name: "Development", query: "web", icon: "💻" },
  { name: "Data Science", query: "data", icon: "📊" },
  { name: "Design", query: "design", icon: "🎨" },
  { name: "Business", query: "management", icon: "📈" },
  { name: "Marketing", query: "marketing", icon: "📣" },
  { name: "AI & ML", query: "machine", icon: "🤖" },
];

const benefits = [
  {
    icon: PlayCircle,
    title: "Learn at your own pace",
    description:
      "Access course materials anytime. Pause, rewind, and revisit lessons whenever you need.",
  },
  {
    icon: Award,
    title: "Expert instructors",
    description:
      "Courses created by industry professionals with real-world experience.",
  },
  {
    icon: TrendingUp,
    title: "Track your progress",
    description:
      "Visual progress tracking keeps you motivated and on path to completion.",
  },
  {
    icon: Globe,
    title: "Learn anywhere",
    description:
      "Responsive platform works seamlessly on desktop, tablet, and mobile.",
  },
];

export default async function HomePage() {
  const session = await getSession();
  const courses = await getPublishedCourses();
  const featured = courses.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 inline-block rounded-sm bg-brand-500/20 px-3 py-1 text-sm font-semibold text-brand-200">
              #1 Learning Platform
            </p>
            <h1 className="text-balance text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Learn without limits
            </h1>
            <p className="mt-6 text-lg text-slate-300 sm:text-xl">
              Start, switch, or advance your career with thousands of courses
              from expert instructors — on IntelliGen LMS.
            </p>

            <div className="mx-auto mt-10 max-w-xl">
              <SearchBar />
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {session ? (
                <Link href="/dashboard">
                  <Button size="lg" className="min-w-[200px]">
                    Go to My Learning
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <Button size="lg" className="min-w-[200px]">
                      Join for Free
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/courses">
                    <Button variant="outline" size="lg" className="min-w-[200px] border-white/30 text-white hover:bg-white/10">
                      Explore Courses
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-100 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="px-4 py-8 text-center sm:py-10">
              <p className="text-3xl font-bold text-brand-600">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          title="Explore top categories"
          description="Find the right course to achieve your goals"
        />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/courses?q=${cat.query}`}
              className="group flex flex-col items-center rounded-sm border border-slate-200 bg-white p-5 shadow-card transition-all hover:border-brand-300 hover:shadow-card-hover"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="mt-3 text-center text-sm font-semibold text-ink group-hover:text-brand-600">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured courses */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Most popular courses"
            description="Join thousands of learners advancing their careers"
            action={
              <Link href="/courses">
                <Button variant="outline">
                  View all courses
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            }
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                description={course.description}
                instructorName={course.instructor.name}
                lessonCount={countLessons(course.modules)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-sm bg-gradient-to-br from-brand-50 to-white p-8 sm:p-12 lg:p-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-ink">
              Why learners choose IntelliGen
            </h2>
            <p className="mt-3 text-muted">
              A learning experience designed for real results
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-elevated">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-bold text-ink">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-y border-slate-200 bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-muted">
            <Users className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Trusted by learners worldwide
            </span>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
            {["TechCorp", "DataFlow", "DesignHub", "CloudNine", "InnovateX"].map(
              (name) => (
                <span
                  key={name}
                  className="text-xl font-bold tracking-tight text-slate-400"
                >
                  {name}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <BookOpen className="mx-auto h-12 w-12 text-brand-200" />
          <h2 className="mt-6 text-3xl font-bold text-white">
            Take the next step toward your goals
          </h2>
          <p className="mt-4 text-lg text-brand-100">
            Join IntelliGen LMS today. It&apos;s free to get started.
          </p>
          <Link
            href={session ? "/dashboard" : "/register"}
            className="mt-8 inline-block"
          >
            <Button size="lg" variant="accent" className="bg-white text-brand-700 hover:bg-brand-50">
              {session ? "Continue Learning" : "Start Learning Today"}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
