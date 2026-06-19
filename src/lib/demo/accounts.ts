export const DEMO_ADMIN_EMAIL = "demo-admin@intelligen.lms";
export const DEMO_LEARNER_EMAIL = "demo-learner@intelligen.lms";
export const DEMO_ACCOUNT_PASSWORD = "password123";

export const DEMO_ACCOUNTS = [
  {
    email: DEMO_ADMIN_EMAIL,
    password: DEMO_ACCOUNT_PASSWORD,
    role: "ADMIN" as const,
    name: "Demo Admin",
    label: "Demo Admin",
    description: "Analytics, learners, courses, certificates & leaderboards",
  },
  {
    email: DEMO_LEARNER_EMAIL,
    password: DEMO_ACCOUNT_PASSWORD,
    role: "STUDENT" as const,
    name: "Jordan Lee",
    label: "Demo Learner",
    description: "Completed courses, certificates, XP, badges & history",
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
