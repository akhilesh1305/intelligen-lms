import { requireAuth } from "@/lib/auth";
import { SectionHeader } from "@/components/ui/section-header";
import { ScreenshotsGuideContent } from "@/components/screenshot/screenshots-guide-content";

export const metadata = {
  title: "Screenshot Guide | IntelliGen LMS Admin",
  description: "Capture portfolio-quality product screenshots",
};

export default async function ScreenshotsGuidePage() {
  await requireAuth(["ADMIN"]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Admin"
        title="Screenshot guide"
        description="Step-by-step instructions for homepage, dashboard, certificates, analytics, games, and AI marketing assets."
      />
      <div className="mt-10">
        <ScreenshotsGuideContent />
      </div>
    </div>
  );
}
