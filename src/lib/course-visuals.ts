import type { SkillLevel } from "@prisma/client";
import { formatSkillLevel } from "./skills";

const categories = [
  "Development",
  "Data Science",
  "Design",
  "Business",
  "Marketing",
  "Management",
] as const;

const gradients = [
  "from-blue-600 to-blue-800",
  "from-violet-600 to-purple-800",
  "from-rose-500 to-pink-700",
  "from-emerald-600 to-teal-800",
  "from-amber-500 to-orange-700",
  "from-cyan-600 to-blue-700",
  "from-indigo-600 to-indigo-900",
] as const;

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getCourseCategory(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes("web") || lower.includes("react") || lower.includes("python"))
    return lower.includes("react") || lower.includes("web") ? "Development" : "Data Science";
  if (lower.includes("design") || lower.includes("ux")) return "Design";
  if (lower.includes("marketing")) return "Marketing";
  if (lower.includes("machine") || lower.includes("data")) return "Data Science";
  if (lower.includes("project") || lower.includes("management")) return "Management";
  return categories[hashString(title) % categories.length];
}

export function getCourseGradient(id: string) {
  return gradients[hashString(id) % gradients.length];
}

export function getCourseRating(id: string) {
  const hash = hashString(id);
  return (4.2 + (hash % 8) / 10).toFixed(1);
}

export function getCourseReviewCount(id: string) {
  const hash = hashString(id);
  return 1200 + (hash % 8800);
}

export function getCourseDuration(lessonCount: number) {
  const hours = Math.max(1, Math.round(lessonCount * 0.75));
  return `${hours}h total`;
}

export function getCourseLevel(title: string, skillLevel?: SkillLevel) {
  if (skillLevel) return formatSkillLevel(skillLevel);
  const lower = title.toLowerCase();
  if (lower.includes("advanced") || lower.includes("machine learning")) return "Advanced";
  if (lower.includes("introduction") || lower.includes("basics") || lower.includes("fundamentals"))
    return "Beginner";
  return "Intermediate";
}
