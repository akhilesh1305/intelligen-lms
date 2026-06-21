import { getSession } from "@/lib/auth";
import { isDemoExperienceActive } from "@/lib/demo/config";
import { DEMO_ORGANIZATION } from "@/lib/demo/brand";
import { DemoEnvironmentBadge } from "./demo-environment-badge";

export async function DemoModeBanner() {
  const session = await getSession();
  if (!isDemoExperienceActive(session?.email)) return null;

  return (
    <div
      role="status"
      data-screenshot-clutter
      className="border-b border-amber-200/80 bg-gradient-to-r from-amber-50 via-amber-50/90 to-orange-50 px-4 py-2 text-center text-sm dark:border-amber-900/40 dark:from-amber-950/50 dark:via-amber-950/30 dark:to-orange-950/20"
    >
      <p className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-2 font-medium text-amber-900 dark:text-amber-200">
        <DemoEnvironmentBadge size="sm" />
        <span>
          {DEMO_ORGANIZATION.name} sample tenant — presentation data only, production unchanged.
        </span>
      </p>
    </div>
  );
}
