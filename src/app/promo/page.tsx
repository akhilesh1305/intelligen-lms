import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "IntelliGen LMS — Product video",
  description:
    "A short overview of IntelliGen LMS — courses, AI tools, coach, certificates, and more.",
};

export default function PromoVideoPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-ink">IntelliGen LMS overview</h1>
      <p className="mt-2 text-muted">
        ~1 minute walkthrough with animated scenes and multi-voice narration —
        how the platform helps learners and teams.
      </p>

      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-black shadow-elevated">
        <video
          className="aspect-video w-full"
          controls
          playsInline
          preload="metadata"
          poster="/promo/poster.png"
        >
          <source src="/promo/intelligen-lms-promo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/register">
          <Button>Join for free</Button>
        </Link>
        <Link href="/courses">
          <Button variant="outline">Explore courses</Button>
        </Link>
        <Link href="/certificates/demo">
          <Button variant="outline">Demo certificate</Button>
        </Link>
      </div>

      <p className="mt-8 text-sm text-muted">
        Regenerate:{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 text-ink">
          npm run promo:video
        </code>{" "}
        · voices only (faster):{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 text-ink">
          SKIP_CAPTURE=1 npm run promo:video
        </code>
      </p>
    </div>
  );
}
