/**
 * Demo mode — presentation-layer mock data for recruiter/client demos.
 * Does not write to the database or alter backend business logic.
 *
 * Enable globally: NEXT_PUBLIC_DEMO_MODE=true (or DEMO_MODE=true on server)
 * Or sign in as demo-admin@ / demo-learner@intelligen.lms
 */
import { isDemoAccountEmail } from "./accounts";

export {
  DEMO_ADMIN_EMAIL,
  DEMO_LEARNER_EMAIL,
  DEMO_ACCOUNT_PASSWORD,
  DEMO_ACCOUNTS,
  isDemoAccountEmail,
  isDemoAdminEmail,
  isDemoLearnerEmail,
} from "./accounts";

export function isDemoMode(): boolean {
  return (
    process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
    process.env.DEMO_MODE === "true"
  );
}

/** Use mock demo data when env flag is on or a dedicated demo account is signed in. */
export function shouldUseDemoData(email?: string | null): boolean {
  return isDemoMode() || isDemoAccountEmail(email);
}

/** Show Demo Environment UI (badge, banner) */
export function isDemoExperienceActive(email?: string | null): boolean {
  return shouldUseDemoData(email);
}
