"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  FileText,
  Loader2,
  Sparkles,
  Upload,
  Video,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PreviewLesson = {
  title: string;
  content: string;
  summary: string;
};

type PreviewModule = {
  title: string;
  summary: string;
  lessons: PreviewLesson[];
};

type PreviewState = {
  modules: PreviewModule[];
  source: string;
  title?: string;
  description?: string;
  extractedSources?: { label: string; kind: string; chars: number }[];
};

type GeneratorMode = "topic" | "sources";

function SourceFileList({
  pdfs,
  videos,
  onRemovePdf,
  onRemoveVideo,
}: {
  pdfs: File[];
  videos: File[];
  onRemovePdf: (index: number) => void;
  onRemoveVideo: (index: number) => void;
}) {
  if (pdfs.length === 0 && videos.length === 0) return null;

  return (
    <ul className="mt-3 space-y-2">
      {pdfs.map((file, i) => (
        <li
          key={`pdf-${file.name}-${i}`}
          className="flex items-center justify-between rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm"
        >
          <span className="flex items-center gap-2 text-ink">
            <FileText className="h-4 w-4 text-brand-600" />
            {file.name}
          </span>
          <button
            type="button"
            onClick={() => onRemovePdf(i)}
            className="text-muted hover:text-red-600"
            aria-label={`Remove ${file.name}`}
          >
            <X className="h-4 w-4" />
          </button>
        </li>
      ))}
      {videos.map((file, i) => (
        <li
          key={`video-${file.name}-${i}`}
          className="flex items-center justify-between rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm"
        >
          <span className="flex items-center gap-2 text-ink">
            <Video className="h-4 w-4 text-brand-600" />
            {file.name}
          </span>
          <button
            type="button"
            onClick={() => onRemoveVideo(i)}
            className="text-muted hover:text-red-600"
            aria-label={`Remove ${file.name}`}
          >
            <X className="h-4 w-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}

function OutlinePreview({
  preview,
  onChange,
}: {
  preview: PreviewState;
  onChange: (next: PreviewState) => void;
}) {
  function updateModule(index: number, field: "title" | "summary", value: string) {
    const modules = preview.modules.map((mod, i) =>
      i === index ? { ...mod, [field]: value } : mod
    );
    onChange({ ...preview, modules });
  }

  function updateLesson(
    moduleIndex: number,
    lessonIndex: number,
    field: keyof PreviewLesson,
    value: string
  ) {
    const modules = preview.modules.map((mod, mi) => {
      if (mi !== moduleIndex) return mod;
      return {
        ...mod,
        lessons: mod.lessons.map((lesson, li) =>
          li === lessonIndex ? { ...lesson, [field]: value } : lesson
        ),
      };
    });
    onChange({ ...preview, modules });
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="brand">Source: {preview.source}</Badge>
        {preview.extractedSources?.map((s) => (
          <Badge key={s.label} variant="default">
            {s.kind === "pdf" ? "PDF" : "Video"}: {s.label} ({s.chars.toLocaleString()} chars)
          </Badge>
        ))}
      </div>

      {preview.title ? (
        <Input
          label="Suggested title"
          value={preview.title}
          onChange={(e) => onChange({ ...preview, title: e.target.value })}
        />
      ) : null}

      {preview.description ? (
        <Textarea
          label="Suggested description"
          rows={2}
          value={preview.description}
          onChange={(e) => onChange({ ...preview, description: e.target.value })}
        />
      ) : null}

      {preview.modules.map((mod, i) => (
        <div
          key={`module-${i}`}
          className="rounded-lg border border-border bg-surface p-4"
        >
          <Input
            label={`Module ${i + 1} title`}
            value={mod.title}
            onChange={(e) => updateModule(i, "title", e.target.value)}
            className="mb-3"
          />
          <Textarea
            label="Module summary"
            rows={2}
            value={mod.summary}
            onChange={(e) => updateModule(i, "summary", e.target.value)}
          />
          <div className="mt-4 space-y-3">
            {mod.lessons.map((lesson, li) => (
              <div
                key={`lesson-${i}-${li}`}
                className="rounded-sm border border-slate-200 bg-white p-3"
              >
                <Input
                  label={`Lesson ${li + 1} title`}
                  value={lesson.title}
                  onChange={(e) => updateLesson(i, li, "title", e.target.value)}
                  className="mb-2"
                />
                <Textarea
                  label="Lesson summary"
                  rows={2}
                  value={lesson.summary}
                  onChange={(e) => updateLesson(i, li, "summary", e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function AiCourseGenerator({
  courseId,
  courseTitle,
  courseDescription,
}: {
  courseId: string;
  courseTitle: string;
  courseDescription: string;
}) {
  const router = useRouter();

  const [mode, setMode] = useState<GeneratorMode>("topic");
  const [topic, setTopic] = useState(courseTitle);
  const [description, setDescription] = useState(courseDescription);
  const [moduleCount, setModuleCount] = useState(3);
  const [lessonsPerModule, setLessonsPerModule] = useState(2);
  const [pdfs, setPdfs] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [videoTranscripts, setVideoTranscripts] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<PreviewState | null>(null);

  function addPdfFiles(files: FileList | null) {
    if (!files) return;
    setPdfs((prev) => [...prev, ...Array.from(files)].slice(0, 5));
  }

  function addVideoFiles(files: FileList | null) {
    if (!files) return;
    setVideos((prev) => [...prev, ...Array.from(files)].slice(0, 3));
  }

  async function generateFromTopic(apply: boolean) {
    setError("");
    setLoading(true);

    const res = await fetch("/api/ai/course/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId,
        topic,
        description,
        moduleCount,
        lessonsPerModule,
        apply,
        ...(apply && preview ? { outline: { modules: preview.modules } } : {}),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Generation failed");
      return;
    }

    if (apply) {
      setPreview(null);
      router.refresh();
      return;
    }

    setPreview({
      modules: data.modules,
      source: data.source,
      title: data.title,
      description: data.description,
    });
  }

  async function generateFromSources(apply: boolean) {
    setError("");

    if (!apply && pdfs.length === 0 && videos.length === 0) {
      setError("Upload at least one PDF or video file.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.set("courseId", courseId);
    formData.set("topic", topic);
    formData.set("description", description);
    formData.set("moduleCount", String(moduleCount));
    formData.set("lessonsPerModule", String(lessonsPerModule));
    formData.set("apply", String(apply));
    if (videoTranscripts.trim()) {
      formData.set("videoTranscripts", videoTranscripts);
    }
    pdfs.forEach((file) => formData.append("pdfs", file));
    videos.forEach((file) => formData.append("videos", file));
    if (apply && preview) {
      formData.set("outline", JSON.stringify({ modules: preview.modules }));
    }

    let res: Response;
    try {
      res = await fetch("/api/ai/course/generate-from-sources", {
        method: "POST",
        body: formData,
      });
    } catch {
      setLoading(false);
      setError("Upload failed. Check your connection and try a smaller PDF.");
      return;
    }

    let data: { error?: string; modules?: PreviewModule[]; source?: string; title?: string; description?: string; extractedSources?: PreviewState["extractedSources"] };
    try {
      data = await res.json();
    } catch {
      setLoading(false);
      setError(
        res.status === 413
          ? "Upload too large. Each PDF must be under 10MB."
          : "Server error while processing your files. Try again."
      );
      return;
    }
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Generation failed");
      return;
    }

    if (apply) {
      setPreview(null);
      router.refresh();
      return;
    }

    if (!data.modules || !data.source) {
      setError("Invalid response from server.");
      return;
    }

    setPreview({
      modules: data.modules,
      source: data.source,
      title: data.title,
      description: data.description,
      extractedSources: data.extractedSources,
    });
  }

  function handleGenerate(apply: boolean) {
    if (mode === "topic") {
      void generateFromTopic(apply);
    } else {
      void generateFromSources(apply);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-panel p-6 shadow-card">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-ink">AI Course Generator</h3>
          <p className="text-sm text-muted">
            Generate modules and lessons from a topic or uploaded PDFs/videos
          </p>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => {
            setMode("topic");
            setPreview(null);
            setError("");
          }}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-semibold transition",
            mode === "topic"
              ? "bg-brand-600 text-white"
              : "bg-slate-100 text-muted hover:bg-slate-200"
          )}
        >
          From topic
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("sources");
            setPreview(null);
            setError("");
          }}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-semibold transition",
            mode === "sources"
              ? "bg-brand-600 text-white"
              : "bg-slate-100 text-muted hover:bg-slate-200"
          )}
        >
          From PDFs / videos
        </button>
      </div>

      {mode === "sources" ? (
        <div className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-sm border border-dashed border-slate-300 bg-white p-4">
              <input
                type="file"
                accept="application/pdf,.pdf"
                multiple
                className="sr-only"
                id="ai-course-pdfs"
                onChange={(e) => {
                  addPdfFiles(e.target.files);
                  e.target.value = "";
                }}
              />
              <label
                htmlFor="ai-course-pdfs"
                className="flex cursor-pointer flex-col items-center gap-2 text-center"
              >
                <Upload className="h-5 w-5 text-brand-600" />
                <span className="text-sm font-semibold text-ink">Add PDF files</span>
                <span className="text-xs text-muted">Up to 5 files, 10MB each</span>
              </label>
            </div>
            <div className="rounded-sm border border-dashed border-slate-300 bg-white p-4">
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
                multiple
                className="sr-only"
                id="ai-course-videos"
                onChange={(e) => {
                  addVideoFiles(e.target.files);
                  e.target.value = "";
                }}
              />
              <label
                htmlFor="ai-course-videos"
                className="flex cursor-pointer flex-col items-center gap-2 text-center"
              >
                <Video className="h-5 w-5 text-brand-600" />
                <span className="text-sm font-semibold text-ink">Add video files</span>
                <span className="text-xs text-muted">Up to 3 files, 50MB each</span>
              </label>
            </div>
          </div>

          <SourceFileList
            pdfs={pdfs}
            videos={videos}
            onRemovePdf={(i) => setPdfs((prev) => prev.filter((_, idx) => idx !== i))}
            onRemoveVideo={(i) => setVideos((prev) => prev.filter((_, idx) => idx !== i))}
          />

          {videos.length > 0 ? (
            <div className="space-y-1">
              <Textarea
                label="Video transcript(s) (recommended)"
                rows={4}
                value={videoTranscripts}
                onChange={(e) => setVideoTranscripts(e.target.value)}
              />
              <p className="text-xs text-muted">
                Paste transcript text for better results. Separate multiple transcripts with ---
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Input
          label="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Modules"
            type="number"
            min={1}
            max={6}
            value={moduleCount}
            onChange={(e) => setModuleCount(Number(e.target.value))}
          />
          <Input
            label="Lessons / module"
            type="number"
            min={1}
            max={5}
            value={lessonsPerModule}
            onChange={(e) => setLessonsPerModule(Number(e.target.value))}
          />
        </div>
      </div>
      <Textarea
        label="Description"
        className="mt-4"
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={() => handleGenerate(false)} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Preview outline
        </Button>
        {preview ? (
          <Button variant="outline" onClick={() => handleGenerate(true)} disabled={loading}>
            Apply to course
          </Button>
        ) : null}
      </div>

      {error ? (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}

      {preview ? (
        <OutlinePreview preview={preview} onChange={setPreview} />
      ) : null}
    </div>
  );
}
