/** Unique Unsplash images for the homepage — no URL reused across sections. */

export const HOME_SECTION_IMAGES = {
  heroMain:
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&h=675&fit=crop&q=80",
  heroAccent:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&q=80",
  benefits:
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&h=675&fit=crop&q=80",
  cta:
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=900&h=506&fit=crop&q=80",
} as const;

export const HOME_CATEGORY_IMAGES = [
  {
    name: "Development",
    query: "web",
    image:
      "https://images.unsplash.com/photo-1461749680684-dccba630e2f6?w=500&h=360&fit=crop&q=80",
    ring: "ring-blue-500/40",
    hover: "group-hover:border-blue-400 group-hover:shadow-blue-500/20",
    text: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
    emoji: "💻",
  },
  {
    name: "Data Science",
    query: "data",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=360&fit=crop&q=80",
    ring: "ring-violet-500/40",
    hover: "group-hover:border-violet-400 group-hover:shadow-violet-500/20",
    text: "group-hover:text-violet-600 dark:group-hover:text-violet-400",
    emoji: "📊",
  },
  {
    name: "Design",
    query: "design",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=360&fit=crop&q=80",
    ring: "ring-rose-500/40",
    hover: "group-hover:border-rose-400 group-hover:shadow-rose-500/20",
    text: "group-hover:text-rose-600 dark:group-hover:text-rose-400",
    emoji: "🎨",
  },
  {
    name: "Business",
    query: "management",
    image:
      "https://images.unsplash.com/photo-1521737711862-ea3e09773dbc?w=500&h=360&fit=crop&q=80",
    ring: "ring-emerald-500/40",
    hover: "group-hover:border-emerald-400 group-hover:shadow-emerald-500/20",
    text: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
    emoji: "📈",
  },
  {
    name: "Marketing",
    query: "marketing",
    image:
      "https://images.unsplash.com/photo-1533750349088-cd871f694e22?w=500&h=360&fit=crop&q=80",
    ring: "ring-amber-500/40",
    hover: "group-hover:border-amber-400 group-hover:shadow-amber-500/20",
    text: "group-hover:text-amber-600 dark:group-hover:text-amber-400",
    emoji: "📣",
  },
  {
    name: "AI & ML",
    query: "machine",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=360&fit=crop&q=80",
    ring: "ring-cyan-500/40",
    hover: "group-hover:border-cyan-400 group-hover:shadow-cyan-500/20",
    text: "group-hover:text-cyan-600 dark:group-hover:text-cyan-400",
    emoji: "🤖",
  },
] as const;

/** Fallback course card images when DB thumbnail is missing (one per slot). */
export const HOME_MIND_GAME_IMAGES = {
  showcase:
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1400&h=420&fit=crop&q=80",
  quizGames:
    "https://images.unsplash.com/photo-1606326603696-aa5b3f33d4e5?w=800&h=440&fit=crop&q=80",
  corporateGames:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=440&fit=crop&q=80",
} as const;

/** Themed thumbnails for corporate game tiles on the homepage. */
export const HOME_CORPORATE_GAME_IMAGES: Record<string, string> = {
  "cybersecurity-escape":
    "https://images.unsplash.com/photo-1550751827-4bd374c1f58b?w=320&h=200&fit=crop&q=80",
  "compliance-detective":
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=320&h=200&fit=crop&q=80",
  "customer-service":
    "https://images.unsplash.com/photo-1423666639041-f56000c27a9e?w=320&h=200&fit=crop&q=80",
  "sales-negotiation":
    "https://images.unsplash.com/photo-1556761175-b413da4b9680?w=320&h=200&fit=crop&q=80",
  "leadership-challenge":
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=320&h=200&fit=crop&q=80",
  "project-management":
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=320&h=200&fit=crop&q=80",
};

export const HOME_COURSE_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=640&h=360&fit=crop&q=80",
  "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=640&h=360&fit=crop&q=80",
  "https://images.unsplash.com/photo-1542831371-d531d36971e6?w=640&h=360&fit=crop&q=80",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&h=360&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=640&h=360&fit=crop&q=80",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=640&h=360&fit=crop&q=80",
] as const;

export function homeCourseThumbnails(
  courses: { thumbnail: string | null | undefined }[]
): string[] {
  const used = new Set<string>();
  const allPool = [...HOME_COURSE_FALLBACK_IMAGES];

  return courses.map((course, index) => {
    if (course.thumbnail && !used.has(course.thumbnail)) {
      used.add(course.thumbnail);
      return course.thumbnail;
    }

    for (let offset = 0; offset < allPool.length; offset++) {
      const candidate = allPool[(index + offset) % allPool.length];
      if (!used.has(candidate)) {
        used.add(candidate);
        return candidate;
      }
    }

    return allPool[index % allPool.length];
  });
}
