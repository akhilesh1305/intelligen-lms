import { Logo } from "@/components/brand/logo";
import { LogoWatermark } from "@/components/brand/logo-watermark";
import { formatDate } from "@/lib/utils";

type CertificateDocumentProps = {
  studentName: string;
  courseTitle: string;
  instructorName: string;
  certificateNo: string;
  issuedAt: Date;
};

export function CertificateDocument({
  studentName,
  courseTitle,
  instructorName,
  certificateNo,
  issuedAt,
}: CertificateDocumentProps) {
  return (
    <div
      id="certificate"
      className="certificate-sheet relative mx-auto aspect-[1.414/1] w-full max-w-4xl overflow-hidden bg-white shadow-elevated"
    >
      <LogoWatermark
        size={360}
        opacity={0.085}
        tone="light"
        position="center"
        className="print:opacity-[0.1]"
      />

      {/* Outer frame */}
      <div className="absolute inset-0 z-[1] border-[3px] border-brand-700" />
      <div className="absolute inset-2 z-[1] border border-brand-300" />
      <div className="absolute inset-4 z-[1] border border-slate-200" />

      {/* Corner accents */}
      <div className="absolute left-6 top-6 z-[1] h-8 w-8 border-l-2 border-t-2 border-brand-500" />
      <div className="absolute right-6 top-6 z-[1] h-8 w-8 border-r-2 border-t-2 border-brand-500" />
      <div className="absolute bottom-6 left-6 z-[1] h-8 w-8 border-b-2 border-l-2 border-brand-500" />
      <div className="absolute bottom-6 right-6 z-[1] h-8 w-8 border-b-2 border-r-2 border-brand-500" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-between px-10 py-8 text-center sm:px-16 sm:py-10">
        {/* Header — official site logo */}
        <div className="w-full">
          <div className="flex justify-center">
            <Logo
              href=""
              variant="icon"
              size="lg"
              animated={false}
              className="h-16 w-auto sm:h-[4.5rem]"
            />
          </div>
          <div className="mx-auto mt-4 h-px w-32 bg-gradient-to-r from-transparent via-brand-400 to-transparent sm:w-48" />
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.35em] text-brand-600 sm:text-sm">
            Certificate of Completion
          </p>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col items-center justify-center py-4">
          <p className="text-sm text-muted sm:text-base">This is to certify that</p>
          <h1 className="mt-3 font-serif text-3xl font-bold text-ink sm:text-4xl lg:text-5xl">
            {studentName}
          </h1>
          <div className="mx-auto mt-4 h-px w-48 bg-slate-300 sm:w-64" />
          <p className="mt-4 text-sm text-muted sm:text-base">
            has successfully completed the course
          </p>
          <p className="mt-2 max-w-xl font-serif text-xl font-semibold leading-snug text-brand-800 sm:text-2xl lg:text-3xl">
            {courseTitle}
          </p>
          <p className="mt-4 text-sm text-muted">
            Instructed by <span className="font-semibold text-ink">{instructorName}</span>
          </p>
        </div>

        {/* Footer */}
        <div className="flex w-full items-end justify-between gap-6 border-t border-slate-200 pt-6">
          <div className="text-left">
            <div className="mb-1 h-px w-32 bg-ink sm:w-40" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted sm:text-xs">
              Date issued
            </p>
            <p className="mt-0.5 text-sm font-semibold text-ink sm:text-base">
              {formatDate(issuedAt)}
            </p>
          </div>

          <div className="hidden text-center sm:block">
            <Logo
              href=""
              variant="icon"
              size="sm"
              animated={false}
              className="mx-auto h-10 w-auto opacity-90"
            />
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-brand-600">
              Verified
            </p>
          </div>

          <div className="text-right">
            <div className="mb-1 ml-auto h-px w-32 bg-ink sm:w-40" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted sm:text-xs">
              Certificate ID
            </p>
            <p className="mt-0.5 font-mono text-xs font-semibold text-ink sm:text-sm">
              {certificateNo}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
