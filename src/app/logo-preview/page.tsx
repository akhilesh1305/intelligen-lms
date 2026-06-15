import { LogoMark } from "@/components/brand/logo-mark";

export const metadata = {
  title: "Logo preview — IntelliGen LMS",
  robots: { index: false, follow: false },
};

function PreviewPanel({
  label,
  bgClass,
  description,
  inverted = false,
}: {
  label: string;
  bgClass: string;
  description: string;
  inverted?: boolean;
}) {
  return (
    <article
      className={`rounded-xl border border-border p-8 shadow-card ${bgClass}`}
    >
      <p className="text-xs font-bold uppercase tracking-wider opacity-80">
        {label}
      </p>
      <p className="mt-1 text-sm opacity-70">{description}</p>
      <div className="mt-6 flex flex-wrap items-end gap-10">
        <LogoMark size={140} animated inverted={inverted} className="h-36 w-auto" />
        <LogoMark size={72} animated inverted={inverted} className="h-20 w-auto" />
        <LogoMark size={40} animated inverted={inverted} className="h-11 w-auto" />
      </div>
    </article>
  );
}

export default function LogoPreviewPage() {
  return (
    <div className="min-h-screen bg-surface px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-ink">Logo preview</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Live <strong className="text-ink">IntelliGen LMS</strong> mark — open
          book, head profile, pixels, and theme-aware wordmark. Toggle your site
          theme (sun/moon in the navbar) to see colors switch automatically.
        </p>

        <div className="mt-8 space-y-6">
          <PreviewPanel
            label="Light background"
            bgClass="bg-white"
            description="Navbar / light mode — dark navy IntelliGen, teal LMS"
          />
          <PreviewPanel
            label="Dark background"
            bgClass="bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900 text-slate-200"
            description="Footer / dark mode — light IntelliGen, bright cyan LMS"
            inverted
          />
        </div>

        <article className="mt-8 rounded-xl border-2 border-brand-500 bg-panel p-8 shadow-elevated">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
            On site chrome (matches navbar)
          </p>
          <div className="mt-4 rounded-lg border border-border bg-panel px-6 py-4">
            <LogoMark size={48} animated className="h-11 w-auto sm:h-12" />
          </div>
        </article>

        <p className="mt-10 text-center text-sm text-muted">
          Production:{" "}
          <a
            href="https://intelligen-web-production.up.railway.app/logo-preview"
            className="font-semibold text-brand-600 hover:underline"
          >
            intelligen-web-production.up.railway.app/logo-preview
          </a>
        </p>
      </div>
    </div>
  );
}
