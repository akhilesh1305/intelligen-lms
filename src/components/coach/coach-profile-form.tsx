"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CoachProfileData } from "@/lib/coach/profile";

const LEVELS = [
  { value: "JUNIOR", label: "Junior" },
  { value: "MID", label: "Mid-level" },
  { value: "SENIOR", label: "Senior" },
  { value: "LEAD", label: "Lead / Manager" },
] as const;

export function CoachProfileForm({
  initial,
  onSaved,
}: {
  initial: CoachProfileData;
  onSaved?: () => void;
}) {
  const [profile, setProfile] = useState(initial);
  const [focusInput, setFocusInput] = useState(initial.focusAreas.join(", "));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const focusAreas = focusInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await fetch("/api/coach/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...profile, focusAreas }),
    });

    setLoading(false);
    if (!res.ok) {
      setMessage("Failed to save profile");
      return;
    }

    const data = await res.json();
    setProfile(data);
    setFocusInput(data.focusAreas.join(", "));
    setMessage("Profile updated — your coach will personalize guidance.");
    onSaved?.();
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {message ? (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Target role"
          value={profile.targetRole ?? ""}
          onChange={(e) =>
            setProfile((p) => ({ ...p, targetRole: e.target.value || null }))
          }
          placeholder="e.g. Product Manager"
        />
        <Input
          label="Department"
          value={profile.department ?? ""}
          onChange={(e) =>
            setProfile((p) => ({ ...p, department: e.target.value || null }))
          }
          placeholder="e.g. Engineering"
        />
      </div>
      <Input
        label="Career goal"
        value={profile.careerGoal ?? ""}
        onChange={(e) =>
          setProfile((p) => ({ ...p, careerGoal: e.target.value || null }))
        }
        placeholder="e.g. Lead a cross-functional product team"
      />
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">
          Experience level
        </label>
        <select
          value={profile.experienceLevel}
          onChange={(e) =>
            setProfile((p) => ({
              ...p,
              experienceLevel: e.target.value as CoachProfileData["experienceLevel"],
            }))
          }
          className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
        >
          {LEVELS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>
      <Input
        label="Focus areas (comma-separated)"
        value={focusInput}
        onChange={(e) => setFocusInput(e.target.value)}
        placeholder="Leadership, Data analysis, Communication"
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
