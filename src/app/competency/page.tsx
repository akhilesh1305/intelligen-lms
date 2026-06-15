import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertCircle, ArrowRight, Target, TrendingUp } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  getGapAnalysis,
  summarizeGapAnalysis,
} from "@/lib/competency";
import { formatSkillLevel } from "@/lib/skills";
import { SectionHeader } from "@/components/ui/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkillAssessmentForm } from "./skill-assessment-form";

export default async function CompetencyPage() {
  const session = await requireAuth(["STUDENT", "INSTRUCTOR", "ADMIN"]);

  const skills = await db.skill.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  if (skills.length === 0) notFound();

  const assessments = await db.userSkillAssessment.findMany({
    where: { userId: session.id },
  });
  const assessmentMap = new Map(
    assessments.map((a) => [a.skillId, a.level])
  );

  const gapItems = await getGapAnalysis(session.id);
  const summary = summarizeGapAnalysis(gapItems);
  const gaps = gapItems.filter((i) => i.hasGap);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title="Competency framework"
        description="Assess your skills, identify gaps, and get course recommendations."
        action={
          <Link href="/paths">
            <Button variant="outline">Browse learning paths</Button>
          </Link>
        }
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 py-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ink">{summary.gapCount}</p>
              <p className="text-sm text-muted">Skill gaps to address</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ink">{summary.strengthCount}</p>
              <p className="text-sm text-muted">Strengths on track</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardContent className="py-6">
          <div className="flex items-start gap-3">
            <Target className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
            <p className="text-sm text-muted">{summary.summary}</p>
          </div>
        </CardContent>
      </Card>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-ink">Gap analysis</h2>
        <p className="mt-1 text-sm text-muted">
          Compare your self-assessment with skills gained from completed courses.
        </p>

        {gaps.length === 0 ? (
          <Card className="mt-6">
            <CardContent className="py-10 text-center text-muted">
              No skill gaps detected. Keep learning to maintain your edge.
            </CardContent>
          </Card>
        ) : (
          <div className="mt-6 space-y-4">
            {gaps.map((item) => (
              <Card key={item.skillId}>
                <CardContent className="py-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted">
                        {item.category}
                      </p>
                      <h3 className="mt-1 font-semibold text-ink">{item.name}</h3>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        {item.assessedLevel ? (
                          <Badge variant="info">
                            Goal: {formatSkillLevel(item.assessedLevel)}
                          </Badge>
                        ) : null}
                        {item.achievedLevel ? (
                          <Badge variant="success">
                            Achieved: {formatSkillLevel(item.achievedLevel)}
                          </Badge>
                        ) : (
                          <Badge>Not yet demonstrated</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {item.recommendedCourses.length > 0 ? (
                    <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                        Recommended courses
                      </p>
                      <ul className="mt-2 space-y-2">
                        {item.recommendedCourses.map((course) => (
                          <li key={course.id}>
                            <Link
                              href={`/courses/${course.id}`}
                              className="flex items-center justify-between rounded-sm px-2 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                              <span className="font-medium text-ink">
                                {course.title}
                              </span>
                              <span className="flex items-center gap-2 text-muted">
                                {formatSkillLevel(course.skillLevel)}
                                <ArrowRight className="h-4 w-4" />
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-ink">Skill self-assessment</h2>
        <p className="mt-1 text-sm text-muted">
          Rate your current level in each competency area. This powers your gap analysis.
        </p>
        <div className="mt-6">
          <SkillAssessmentForm
            skills={skills.map((s) => ({
              id: s.id,
              name: s.name,
              category: s.category,
              currentLevel: assessmentMap.get(s.id) ?? null,
            }))}
          />
        </div>
      </section>
    </div>
  );
}
