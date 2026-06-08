import { BookOpen, ClipboardList, FileText } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";

type ProgressDetails = {
  percent: number;
  isComplete: boolean;
  lessons: { total: number; completed: number };
  quizzes: { total: number; passed: number };
  assignments: { total: number; submitted: number };
};

export function ProgressTracker({ progress }: { progress: ProgressDetails }) {
  const items = [
    {
      icon: BookOpen,
      label: "Lessons",
      done: progress.lessons.completed,
      total: progress.lessons.total,
    },
    {
      icon: ClipboardList,
      label: "Quizzes",
      done: progress.quizzes.passed,
      total: progress.quizzes.total,
    },
    {
      icon: FileText,
      label: "Assignments",
      done: progress.assignments.submitted,
      total: progress.assignments.total,
    },
  ];

  return (
    <div className="rounded-sm border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-ink">Course progress</h3>
        <span className="text-lg font-bold text-brand-600">{progress.percent}%</span>
      </div>
      <ProgressBar value={progress.percent} className="mt-3" />

      <div className="mt-5 space-y-3">
        {items.map(
          (item) =>
            item.total > 0 && (
              <div key={item.label} className="flex items-center gap-3 text-sm">
                <item.icon className="h-4 w-4 text-muted" />
                <span className="flex-1 text-muted">{item.label}</span>
                <span className="font-semibold text-ink">
                  {item.done}/{item.total}
                </span>
              </div>
            )
        )}
      </div>

      {progress.isComplete && (
        <p className="mt-4 rounded-sm bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
          Course completed! Check your certificates.
        </p>
      )}
    </div>
  );
}
