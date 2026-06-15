import { Role } from "@prisma/client";

export const ROLE_LABELS: Record<Role, string> = {
  STUDENT: "Learner",
  INSTRUCTOR: "Instructor",
  ADMIN: "Admin",
};

export const ORG_ROLE_LABELS: Record<string, string> = {
  ORG_LEARNER: "Learner",
  ORG_INSTRUCTOR: "Instructor",
  ORG_ADMIN: "Admin",
};

export function formatRole(role: Role | string): string {
  if (role in ROLE_LABELS) {
    return ROLE_LABELS[role as Role];
  }
  return String(role);
}

export function formatOrgRole(role: string): string {
  return ORG_ROLE_LABELS[role] ?? role;
}
