import Link from "next/link";
import { Sparkles } from "lucide-react";
import { getSession } from "@/lib/auth";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AiToolsHub } from "@/components/ai/ai-tools-hub";

const FEATURES = [
  {
    title: "AI Course Generator",
    description: "Generate modules, lessons, and summaries for instructors.",
    href: "/dashboard",
    audience: "Instructor",
  },
  {
    title: "Content Summarizer",
    description: "Summarize long lessons into key takeaways.",
    audience: "Learner",
  },
  {
    title: "AI Voice Narration",
    description: "Listen to lessons with OpenAI TTS or browser speech.",
    audience: "Learner",
  },
  {
    title: "Interview Preparation",
    description: "Mock interview questions with answer tips.",
    audience: "Learner",
  },
  {
    title: "Corporate Coach",
    description: "Personalized learning plans, daily tips, and career guidance.",
    href: "/coach",
    audience: "Learner",
  },
  {
    title: "Career Advisor",
    description: "Skill, course, and career path suggestions.",
    audience: "Learner",
  },
  {
    title: "Learning Roadmap",
    description: "Personalized phased learning plans.",
    audience: "Learner",
  },
  {
    title: "Assignment Evaluation",
    description: "Auto-grade subjective answers on submit.",
    audience: "Auto",
  },
  {
    title: "Resume Builder",
    description: "Generate resumes from completed skills & certs.",
    audience: "Learner",
  },
];

export default async function AiPage() {
  const session = await getSession();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title="AI learning suite"
        description="Course generation, summarization, voice narration, career tools, and more — powered by AI with smart fallbacks."
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/coach">
              <Button variant="outline" size="sm">
                <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                Corporate Coach
              </Button>
            </Link>
            <Link href="/assistant">
              <Button variant="outline" size="sm">
                <Sparkles className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                Chat assistant
              </Button>
            </Link>
          </div>
        }
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <Card key={f.title} className="h-full">
            <CardContent className="flex h-full flex-col pt-5">
              <p className="text-xs font-bold uppercase tracking-wide text-brand-600">
                {f.audience}
              </p>
              <h3 className="mt-2 font-bold text-ink">{f.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted">{f.description}</p>
              {f.href ? (
                <Link href={f.href} className="mt-3 text-sm font-semibold text-brand-600 hover:underline">
                  Open →
                </Link>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold text-ink">Try AI tools</h2>
        <p className="mt-1 text-sm text-muted">
          Interview prep, career advice, roadmaps, resume builder, summarizer, and voice narration.
        </p>
        <div className="mt-6">
          <AiToolsHub isLoggedIn={Boolean(session)} />
        </div>
      </div>
    </div>
  );
}
