import type { SkillLevel } from "@prisma/client";

export type CertificateTemplateId =
  | "classic"
  | "corporate"
  | "ai-professional"
  | "technical-expert";

export type CertificateTemplateMeta = {
  id: CertificateTemplateId;
  label: string;
  description: string;
  accent: string;
};

export const CERTIFICATE_TEMPLATES: Record<
  CertificateTemplateId,
  CertificateTemplateMeta
> = {
  classic: {
    id: "classic",
    label: "Classic",
    description: "Timeless IntelliGen completion design",
    accent: "from-brand-500 to-violet-600",
  },
  corporate: {
    id: "corporate",
    label: "Corporate",
    description: "Organization-branded partnership credential",
    accent: "from-slate-700 to-brand-700",
  },
  "ai-professional": {
    id: "ai-professional",
    label: "AI Professional",
    description: "For AI and digital innovation programs",
    accent: "from-cyan-500 to-violet-600",
  },
  "technical-expert": {
    id: "technical-expert",
    label: "Technical Expert",
    description: "Advanced technical mastery recognition",
    accent: "from-emerald-600 to-teal-600",
  },
};

export function resolveCertificateTemplate(course: {
  organizationId: string | null;
  skillLevel: SkillLevel;
  title: string;
}): CertificateTemplateId {
  if (course.organizationId) return "corporate";

  const title = course.title.toLowerCase();
  if (
    course.skillLevel === "ADVANCED" ||
    /cyber|security|excel|data|technical|engineering|devops|cloud/i.test(title)
  ) {
    return "technical-expert";
  }

  if (
    /ai|artificial intelligence|machine learning|generative|prompt/i.test(title) ||
    course.title.includes("Getting Started with AI")
  ) {
    return "ai-professional";
  }

  return "classic";
}
