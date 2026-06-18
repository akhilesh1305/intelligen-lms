import Link from "next/link";
import { Award, Lock, ShieldCheck } from "lucide-react";
import { CERTIFICATE_TEMPLATES, type CertificateTemplateId } from "@/lib/certificate-templates";
import { cn, formatDate } from "@/lib/utils";

type EarnedCardProps = {
  variant: "earned";
  id: string;
  courseTitle: string;
  certificateNo: string;
  issuedAt: string;
  template: CertificateTemplateId;
  organizationName?: string | null;
};

type LockedCardProps = {
  variant: "locked";
  courseId: string;
  courseTitle: string;
  progressPercent: number;
  template: CertificateTemplateId;
  remainingSummary: string[];
};

export type CertificateCardProps = EarnedCardProps | LockedCardProps;

export function CertificateCard(props: CertificateCardProps) {
  const templateMeta = CERTIFICATE_TEMPLATES[props.template];

  if (props.variant === "earned") {
    return (
      <article className="glass-card group relative overflow-hidden rounded-[20px] border border-border/80 p-5 transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-card-hover">
        <div
          className={cn(
            "pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br opacity-20 blur-2xl transition-opacity group-hover:opacity-30",
            templateMeta.accent
          )}
        />
        <div className="relative flex items-start justify-between gap-3">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm",
              templateMeta.accent
            )}
          >
            <Award className="h-5 w-5" />
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
            Earned
          </span>
        </div>

        <h3 className="relative mt-4 line-clamp-2 text-base font-bold text-ink">
          {props.courseTitle}
        </h3>
        <p className="relative mt-1 text-xs font-medium text-muted">
          {templateMeta.label} template
          {props.organizationName ? ` · ${props.organizationName}` : ""}
        </p>

        <div className="relative mt-4 space-y-1 text-xs text-muted">
          <p>Issued {formatDate(new Date(props.issuedAt))}</p>
          <p className="font-mono text-[10px]">{props.certificateNo}</p>
        </div>

        <div className="relative mt-5 flex flex-wrap gap-2">
          <Link
            href={`/certificates/${props.id}`}
            className="inline-flex min-h-9 items-center rounded-[10px] bg-brand-600 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-brand-700"
          >
            View certificate
          </Link>
          <Link
            href={`/certificates/verify/${encodeURIComponent(props.certificateNo)}`}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-[10px] border border-border px-3.5 text-xs font-semibold text-ink transition-colors hover:bg-muted/40"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Verify
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="glass-card group relative overflow-hidden rounded-[20px] border border-dashed border-border/80 p-5 opacity-95 transition-all duration-300 motion-safe:hover:-translate-y-0.5">
      <div
        className={cn(
          "pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br opacity-10 blur-2xl",
          templateMeta.accent
        )}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/30 text-muted">
          <Lock className="h-5 w-5" />
        </div>
        <span className="rounded-full border border-border bg-muted/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted">
          Locked
        </span>
      </div>

      <h3 className="relative mt-4 line-clamp-2 text-base font-bold text-ink">
        {props.courseTitle}
      </h3>
      <p className="relative mt-1 text-xs text-muted">{templateMeta.label} credential</p>

      <div className="relative mt-4">
        <div className="flex justify-between text-xs font-semibold text-ink">
          <span>Progress</span>
          <span>{props.progressPercent}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted/50">
          <div
            className={cn("h-full rounded-full bg-gradient-to-r transition-all", templateMeta.accent)}
            style={{ width: `${Math.min(100, props.progressPercent)}%` }}
          />
        </div>
      </div>

      {props.remainingSummary.length > 0 ? (
        <ul className="relative mt-3 space-y-1 text-xs text-muted">
          {props.remainingSummary.slice(0, 3).map((item) => (
            <li key={item}>· {item}</li>
          ))}
        </ul>
      ) : null}

      <Link
        href={`/courses/${props.courseId}`}
        className="relative mt-5 inline-flex min-h-9 items-center rounded-[10px] border border-brand-300 bg-brand-50 px-3.5 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-100 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-300 dark:hover:bg-brand-900/50"
      >
        Continue course
      </Link>
    </article>
  );
}
