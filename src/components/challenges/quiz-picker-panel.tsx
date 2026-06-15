import { QuizPickerIcon } from "@/components/challenges/quiz-picker-icon";

export type QuizPickerEntry = {
  id: string;
  href: string;
  label: string;
  title?: string;
  selected?: boolean;
  completed?: boolean;
  locked?: boolean;
  missed?: boolean;
  isToday?: boolean;
};

export function QuizPickerPanel({
  heading,
  tab,
  entries,
}: {
  heading: string;
  tab: "daily" | "weekly";
  entries: QuizPickerEntry[];
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
        {heading}
      </p>
      <div
        className={
          tab === "weekly"
            ? "grid max-h-[280px] w-full grid-cols-4 gap-1.5 overflow-y-auto sm:w-fit sm:grid-cols-5"
            : "flex flex-wrap justify-center gap-2 sm:justify-start"
        }
      >
        {entries.map((entry) => (
          <QuizPickerIcon
            key={entry.id}
            href={entry.href}
            label={entry.label}
            size={tab === "weekly" ? "sm" : "default"}
            selected={entry.selected}
            completed={entry.completed}
            locked={entry.locked}
            missed={entry.missed}
            isToday={entry.isToday}
            title={entry.title}
          />
        ))}
      </div>
    </div>
  );
}
