"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  ClipboardCheck,
  FileText,
  Loader2,
  Map,
  MessageSquare,
  Sparkles,
  Target,
  Volume2,
} from "lucide-react";
import { VoiceNarrationControls } from "@/components/ai/voice-narration-controls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RoadmapCard } from "@/components/assistant/roadmap-card";
import type { LearningRoadmap } from "@/lib/assistant/roadmap";

const TOOLS = [
  { id: "interview", label: "Interview prep", icon: MessageSquare },
  { id: "career", label: "Career advisor", icon: Briefcase },
  { id: "roadmap", label: "Learning roadmap", icon: Map },
  { id: "resume", label: "Resume builder", icon: FileText },
  { id: "summarizer", label: "Content summarizer", icon: ClipboardCheck },
  { id: "narrate", label: "Voice narration", icon: Volume2 },
] as const;

type ToolId = (typeof TOOLS)[number]["id"];

export function AiToolsHub({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [active, setActive] = useState<ToolId>("interview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [role, setRole] = useState("Frontend Developer");
  const [goal, setGoal] = useState("Become a data scientist");
  const [careerGoal, setCareerGoal] = useState("Software Engineer");
  const [lessonText, setLessonText] = useState("");

  const [interviewResult, setInterviewResult] = useState<{
    questions: { question: string; tips: string; category: string }[];
    source: string;
  } | null>(null);

  const [careerResult, setCareerResult] = useState<{
    summary: string;
    suggestedSkills: string[];
    recommendedCourses: { id: string; title: string; reason: string }[];
    careerPaths: string[];
    source: string;
  } | null>(null);

  const [roadmapResult, setRoadmapResult] = useState<{
    roadmap: LearningRoadmap;
    source: string;
  } | null>(null);

  const [resumeResult, setResumeResult] = useState<{
    resume: string;
    source: string;
  } | null>(null);

  const [summaryResult, setSummaryResult] = useState<{
    summary: string;
    keyPoints: string[];
    source: string;
  } | null>(null);

  async function runTool() {
    if (!isLoggedIn) return;
    setError("");
    setLoading(true);

    let res: Response;
    if (active === "interview") {
      res = await fetch("/api/ai/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) return setError(data.error || "Failed");
      setInterviewResult(data);
      return;
    }

    if (active === "career") {
      res = await fetch("/api/ai/career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) return setError(data.error || "Failed");
      setCareerResult(data);
      return;
    }

    if (active === "roadmap") {
      res = await fetch("/api/ai/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) return setError(data.error || "Failed");
      setRoadmapResult(data);
      return;
    }

    if (active === "resume") {
      res = await fetch("/api/ai/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ careerGoal }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) return setError(data.error || "Failed");
      setResumeResult(data);
      return;
    }

    if (active === "summarizer") {
      res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Pasted content", text: lessonText }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) return setError(data.error || "Failed");
      setSummaryResult(data);
      return;
    }

    setLoading(false);
  }

  if (!isLoggedIn) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Sparkles className="mx-auto h-12 w-12 text-brand-400" />
          <p className="mt-4 font-semibold text-ink">Sign in to use AI tools</p>
          <Link href="/login" className="mt-4 inline-block">
            <Button>Sign in</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => setActive(tool.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active === tool.id
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-ink hover:bg-slate-200 dark:bg-slate-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tool.label}
            </button>
          );
        })}
      </div>

      <Card className="mt-6" data-ai-cursor>
        <CardContent className="pt-6">
          {active === "interview" && (
            <Input
              label="Target role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Frontend Developer"
            />
          )}
          {(active === "career" || active === "roadmap") && (
            <Input
              label="Career goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Become a data scientist"
            />
          )}
          {active === "resume" && (
            <Input
              label="Target role (optional)"
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
            />
          )}
          {active === "summarizer" && (
            <Textarea
              label="Paste lesson or article text"
              rows={8}
              value={lessonText}
              onChange={(e) => setLessonText(e.target.value)}
              placeholder="Paste long lesson content to summarize..."
            />
          )}
          {active === "narrate" && (
            <Textarea
              label="Text to narrate"
              rows={8}
              value={lessonText}
              onChange={(e) => setLessonText(e.target.value)}
              placeholder="Paste or type text to hear with AI voice..."
            />
          )}

          {active !== "narrate" ? (
          <Button className="mt-4" onClick={runTool} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate
          </Button>
          ) : (
            <div className="mt-4">
              <VoiceNarrationControls
                text={lessonText}
                label="Listen with AI voice"
              />
              <p className="mt-2 text-xs text-muted">
                OpenAI TTS when configured, otherwise browser speech. Pause and
                resume anytime.
              </p>
            </div>
          )}
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </CardContent>
      </Card>

      {interviewResult ? (
        <div className="mt-6 space-y-4">
          <Badge variant="brand">Interview prep · {interviewResult.source}</Badge>
          {interviewResult.questions.map((q, i) => (
            <Card key={q.question}>
              <CardContent className="pt-5">
                <p className="text-xs font-bold uppercase text-muted">{q.category}</p>
                <p className="mt-1 font-semibold text-ink">
                  {i + 1}. {q.question}
                </p>
                <p className="mt-2 text-sm text-muted">
                  <Target className="mr-1 inline h-3.5 w-3.5" />
                  {q.tips}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {careerResult ? (
        <div className="mt-6 space-y-4">
          <Badge variant="brand">Career advisor · {careerResult.source}</Badge>
          <Card>
            <CardContent className="pt-5">
              <p className="text-sm leading-relaxed text-ink">{careerResult.summary}</p>
              <p className="mt-4 text-sm font-semibold text-ink">Suggested skills</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {careerResult.suggestedSkills.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
              <p className="mt-4 text-sm font-semibold text-ink">Recommended courses</p>
              <ul className="mt-2 space-y-2">
                {careerResult.recommendedCourses.map((c) => (
                  <li key={c.id}>
                    <Link href={`/courses/${c.id}`} className="font-semibold text-brand-600 hover:underline">
                      {c.title}
                    </Link>
                    <span className="text-sm text-muted"> — {c.reason}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm font-semibold text-ink">Career paths</p>
              <p className="text-sm text-muted">{careerResult.careerPaths.join(" · ")}</p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {roadmapResult ? (
        <div className="mt-6">
          <Badge variant="brand" className="mb-4">
            Roadmap · {roadmapResult.source}
          </Badge>
          <RoadmapCard roadmap={roadmapResult.roadmap} />
        </div>
      ) : null}

      {resumeResult ? (
        <div className="mt-6">
          <Badge variant="brand" className="mb-4">
            Resume · {resumeResult.source}
          </Badge>
          <Card>
            <CardContent className="pt-5">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink">
                {resumeResult.resume}
              </pre>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {summaryResult ? (
        <div className="mt-6">
          <Badge variant="brand" className="mb-4">
            Summary · {summaryResult.source}
          </Badge>
          <Card>
            <CardContent className="pt-5">
              <p className="text-sm leading-relaxed text-ink">{summaryResult.summary}</p>
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted">
                {summaryResult.keyPoints.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
