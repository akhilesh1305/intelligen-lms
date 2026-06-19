import { requireAuth } from "@/lib/auth";
import { SectionHeader } from "@/components/ui/section-header";
import { RecordingModePanel } from "@/components/recording/recording-mode-panel";

export const metadata = {
  title: "Recording Mode | IntelliGen LMS Admin",
  description: "Prepare IntelliGen LMS for professional demo screen recordings",
};

export default async function RecordingModePage() {
  await requireAuth(["ADMIN"]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Admin"
        title="Demo recording mode"
        description="Polish the UI for screen recordings — calmer motion, full charts, demo data, and zero notification noise."
      />
      <div className="mt-10">
        <RecordingModePanel />
      </div>
    </div>
  );
}
