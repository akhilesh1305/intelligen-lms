"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SkillLevel } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { formatSkillLevel } from "@/lib/skills";

type SkillItem = {
  id: string;
  name: string;
  category: string;
  currentLevel: SkillLevel | null;
};

const LEVELS: SkillLevel[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

export function SkillAssessmentForm({ skills }: { skills: SkillItem[] }) {
  const router = useRouter();
  const [levels, setLevels] = useState<Record<string, SkillLevel>>(() => {
    const initial: Record<string, SkillLevel> = {};
    for (const skill of skills) {
      if (skill.currentLevel) initial[skill.id] = skill.currentLevel;
    }
    return initial;
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const entries = Object.entries(levels);
    for (const [skillId, level] of entries) {
      const res = await fetch("/api/competency/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId, level }),
      });
      if (!res.ok) {
        setMessage("Failed to save assessment. Please try again.");
        setLoading(false);
        return;
      }
    }

    setMessage("Skill assessment saved.");
    setLoading(false);
    router.refresh();
  }

  const grouped = skills.reduce<Record<string, SkillItem[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {Object.entries(grouped).map(([category, items]) => (
        <section key={category}>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted">
            {category}
          </h3>
          <div className="mt-4 space-y-4">
            {items.map((skill) => (
              <div
                key={skill.id}
                className="rounded-sm border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
              >
                <p className="font-semibold text-ink">{skill.name}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {LEVELS.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        setLevels((prev) => ({ ...prev, [skill.id]: level }))
                      }
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                        levels[skill.id] === level
                          ? "bg-brand-600 text-white"
                          : "bg-slate-100 text-muted hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                      }`}
                    >
                      {formatSkillLevel(level)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {message ? (
        <p
          className={`text-sm ${
            message.includes("saved") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      ) : null}

      <Button type="submit" disabled={loading || Object.keys(levels).length === 0}>
        {loading ? "Saving..." : "Save skill assessment"}
      </Button>
    </form>
  );
}
