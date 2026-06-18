"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { CourseCard } from "@/components/courses/course-card";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";

export type FeaturedCourse = {
  id: string;
  title: string;
  description: string;
  instructorName: string;
  lessonCount: number;
  pricePaise: number;
  thumbnail: string | null;
  skillLevel?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  rating?: number | null;
  reviewCount?: number;
};

export function HomeFeaturedCourses({ courses }: { courses: FeaturedCourse[] }) {
  return (
    <section className="border-y border-border bg-panel/50 py-24 dark:bg-panel/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <SectionHeader
            title="Most popular courses"
            description="Join thousands of learners advancing their careers"
            action={
              <Link href="/courses">
                <Button variant="outline" className="transition-transform hover:scale-105">
                  View all courses
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            }
          />
        </AnimateOnScroll>
        {courses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Courses coming soon"
            description="New expert-led courses are being added. Check back shortly or create your own."
            action={{ label: "Browse catalog", href: "/courses" }}
            secondaryAction={{ label: "Become an instructor", href: "/register" }}
            className="mt-10"
          />
        ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, i) => (
            <AnimateOnScroll key={course.id} delay={i * 90} animation="fade-up">
              <CourseCard
                id={course.id}
                title={course.title}
                description={course.description}
                instructorName={course.instructorName}
                lessonCount={course.lessonCount}
                pricePaise={course.pricePaise}
                thumbnail={course.thumbnail}
                skillLevel={course.skillLevel}
                rating={course.rating}
                reviewCount={course.reviewCount}
              />
            </AnimateOnScroll>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
