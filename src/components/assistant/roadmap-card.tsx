import Link from "next/link";
import { ArrowRight, Clock, Map } from "lucide-react";
import type { LearningRoadmap } from "@/lib/assistant/roadmap";
import { Badge } from "@/components/ui/badge";

export function RoadmapCard({ roadmap }: { roadmap: LearningRoadmap }) {
  return (
    <div className="mt-3 rounded-lg border border-brand-200 bg-brand-50/50 p-4 dark:border-brand-500/30 dark:bg-brand-500/10">
      <div className="flex items-center gap-2">
        <Map className="h-4 w-4 text-brand-600" />
        <span className="text-sm font-bold text-brand-700 dark:text-brand-300">
          {roadmap.goal} Roadmap
        </span>
        <Badge variant="brand" className="ml-auto">
          {roadmap.totalCourses} courses
        </Badge>
      </div>

      <div className="mt-4 space-y-4">
        {roadmap.steps.map((step) => (
          <div key={step.order} className="relative pl-6">
            <div className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
              {step.order}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-semibold text-ink">{step.phase}</h4>
                <span className="flex items-center gap-1 text-xs text-muted">
                  <Clock className="h-3 w-3" />
                  {step.duration}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted">{step.description}</p>
              <ul className="mt-2 space-y-1.5">
                {step.courses.map((course) => (
                  <li key={course.id}>
                    <Link
                      href={`/courses/${course.id}`}
                      className="group flex items-center gap-2 rounded-sm border border-border bg-panel px-3 py-2 text-sm shadow-sm transition-colors hover:bg-brand-50 dark:hover:bg-brand-500/10"
                    >
                      <span className="flex-1 font-medium text-ink group-hover:text-brand-700">
                        {course.title}
                      </span>
                      <Badge className="shrink-0 normal-case tracking-normal">
                        {course.level}
                      </Badge>
                      <ArrowRight className="h-3.5 w-3.5 text-muted group-hover:text-brand-600" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
