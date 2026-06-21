import {
  DEMO_ADMIN_NAME,
  DEMO_ADMIN_TITLE,
  DEMO_LEARNER_NAME,
  DEMO_LEARNER_TITLE,
  DEMO_ORGANIZATION,
} from "./brand";

export const DEMO_ADMIN_EMAIL = "demo-admin@intelligen.lms";
export const DEMO_LEARNER_EMAIL = "demo-learner@intelligen.lms";
export const DEMO_ACCOUNT_PASSWORD = "password123";

export const DEMO_ACCOUNTS = [
  {
    email: DEMO_ADMIN_EMAIL,
    password: DEMO_ACCOUNT_PASSWORD,
    role: "ADMIN" as const,
    name: DEMO_ADMIN_NAME,
    label: DEMO_ADMIN_NAME,
    description: `${DEMO_ADMIN_TITLE} · ${DEMO_ORGANIZATION.name} analytics & approvals`,
  },
  {
    email: DEMO_LEARNER_EMAIL,
    password: DEMO_ACCOUNT_PASSWORD,
    role: "STUDENT" as const,
    name: DEMO_LEARNER_NAME,
    label: DEMO_LEARNER_NAME,
    description: `${DEMO_LEARNER_TITLE} · ${DEMO_ORGANIZATION.department} learner journey`,
  },
];

export function isDemoAccountEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase();
  return normalized === DEMO_ADMIN_EMAIL || normalized === DEMO_LEARNER_EMAIL;
}

export function isDemoAdminEmail(email: string | null | undefined): boolean {
  return email?.toLowerCase() === DEMO_ADMIN_EMAIL;
}

export function isDemoLearnerEmail(email: string | null | undefined): boolean {
  return email?.toLowerCase() === DEMO_LEARNER_EMAIL;
}
