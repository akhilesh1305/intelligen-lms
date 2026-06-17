import { Building2 } from "lucide-react";
import { LogoWatermark } from "@/components/brand/logo-watermark";
import { cn, formatDate } from "@/lib/utils";

type CertificateOrganization = {
  name: string;
  logoUrl: string | null;
  signatoryName?: string | null;
  signatureUrl?: string | null;
};

type CertificateDocumentProps = {
  studentName: string;
  courseTitle: string;
  instructorName: string;
  certificateNo: string;
  issuedAt: Date;
  organization?: CertificateOrganization | null;
};

function ClassicCorner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M6 6h28M6 6v28"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
      />
      <path
        d="M6 6c10 2 18 10 22 20"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M6 6c2 10 8 18 16 22"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeLinecap="round"
        opacity="0.4"
      />
      <circle cx="6" cy="6" r="2" fill="currentColor" opacity="0.75" />
      <path
        d="M14 38c3-6 9-11 16-14"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M38 6c-6 3-11 9-14 16"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

function TitleDivider({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 10"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <line x1="0" y1="5" x2="200" y2="5" stroke="currentColor" strokeWidth="0.75" opacity="0.45" />
      <line x1="280" y1="5" x2="480" y2="5" stroke="currentColor" strokeWidth="0.75" opacity="0.45" />
      <circle cx="240" cy="5" r="2.5" fill="currentColor" opacity="0.65" />
      <circle cx="240" cy="5" r="6" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

function CertificateWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "certificate-wordmark inline-flex flex-col items-start leading-none text-left",
        className
      )}
    >
      <span className="text-xl font-extrabold tracking-tight sm:text-2xl lg:text-[1.75rem]">
        <span className="certificate-wordmark-intelli">Intelli</span>
        <span className="certificate-wordmark-gen">Gen</span>
      </span>
      <span className="certificate-wordmark-lms mt-1 text-[0.55rem] font-bold uppercase tracking-[0.32em] sm:text-[0.65rem]">
        LMS
      </span>
    </span>
  );
}

function CertificateBrandLockup({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "certificate-brand-lockup flex items-center gap-3 sm:gap-4",
        className
      )}
    >
      <CertificateLogoMark className="h-16 w-auto shrink-0 sm:h-[4.5rem] lg:h-20" />
      <CertificateWordmark className="justify-center" />
    </div>
  );
}

function CertificateLogoMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- icon-only mark for print/PDF
    <img
      src="/logo-mark-icon.svg"
      alt="IntelliGen LMS"
      className={className}
    />
  );
}

function CertificateSeal() {
  return (
    <div className="certificate-seal relative flex h-14 w-14 items-center justify-center rounded-full sm:h-16 sm:w-16">
      <div className="certificate-seal-ring pointer-events-none absolute inset-0 rounded-full" aria-hidden />
      <CertificateLogoMark className="relative z-[1] h-9 w-auto sm:h-10" />
    </div>
  );
}

export function CertificateDocument({
  studentName,
  courseTitle,
  instructorName,
  certificateNo,
  issuedAt,
  organization,
}: CertificateDocumentProps) {
  const isOrgCertificate = Boolean(organization);

  return (
    <div
      id="certificate"
      className="certificate-sheet certificate-classic certificate-frame-outer relative mx-auto aspect-[11/8.5] w-full max-w-6xl overflow-hidden text-ink shadow-elevated"
    >
      <LogoWatermark
        size={400}
        opacity={isOrgCertificate ? 0.035 : 0.06}
        tone="light"
        position="center"
        className="print:opacity-[0.05]"
      />

      <div className="certificate-gold-frame pointer-events-none absolute inset-2 z-[1] sm:inset-3" />
      <div className="pointer-events-none absolute inset-4 z-[1] border border-brand-300/50 sm:inset-5" />

      <ClassicCorner className="certificate-corner-ornament absolute left-3 top-3 z-[2] h-14 w-14 sm:left-4 sm:top-4 sm:h-16 sm:w-16" />
      <ClassicCorner className="certificate-corner-ornament absolute right-3 top-3 z-[2] h-14 w-14 rotate-90 sm:right-4 sm:top-4 sm:h-16 sm:w-16" />
      <ClassicCorner className="certificate-corner-ornament absolute bottom-3 left-3 z-[2] h-14 w-14 -rotate-90 sm:bottom-4 sm:left-4 sm:h-16 sm:w-16" />
      <ClassicCorner className="certificate-corner-ornament absolute bottom-3 right-3 z-[2] h-14 w-14 rotate-180 sm:bottom-4 sm:right-4 sm:h-16 sm:w-16" />

      <div className="relative z-10 flex h-full min-h-0 w-full flex-col items-center justify-between px-6 py-6 text-center sm:px-14 sm:py-8">
        {/* Header */}
        <div className="w-full min-w-0 shrink-0">
          {isOrgCertificate ? (
            <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
              <div className="flex min-w-0 justify-center sm:justify-start">
                <CertificateBrandLockup />
              </div>
              <div className="certificate-org-divider hidden h-12 w-px sm:block" />
              <div className="flex min-w-0 flex-col items-center">
                <div className="certificate-org-logo flex h-12 w-full max-w-[130px] items-center justify-center rounded border border-brand-100 bg-white/80 p-2 sm:h-14 sm:max-w-[160px]">
                  {organization?.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- org logos may be data URLs
                    <img
                      src={organization.logoUrl}
                      alt={`${organization.name} logo`}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <Building2 className="h-6 w-6 text-brand-600" strokeWidth={1.5} />
                  )}
                </div>
                <p className="certificate-org-name mt-1.5 line-clamp-2 max-w-[130px] text-[9px] font-semibold uppercase leading-tight tracking-[0.12em] text-brand-700 sm:max-w-[160px] sm:text-[10px]">
                  {organization?.name}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <CertificateBrandLockup />
            </div>
          )}

          <p className="certificate-classic-kicker mt-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-600 sm:mt-4 sm:text-xs">
            Certificate
          </p>
          <h2 className="certificate-classic-heading mt-0.5 font-[family-name:var(--font-certificate)] text-xl font-semibold tracking-wide text-brand-900 sm:text-2xl lg:text-3xl">
            of Completion
          </h2>
          <TitleDivider className="certificate-flourish mx-auto mt-2 h-2 w-full max-w-md text-brand-500 sm:mt-3 sm:max-w-lg" />
        </div>

        {/* Body */}
        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col items-center justify-center px-2 py-1">
          <p className="certificate-preamble font-[family-name:var(--font-certificate)] text-xs italic text-muted sm:text-sm">
            This is to certify that
          </p>
          <h1 className="certificate-recipient mt-2 w-full max-w-3xl break-words font-[family-name:var(--font-certificate)] text-2xl font-semibold leading-tight text-brand-900 sm:mt-3 sm:text-3xl lg:text-4xl">
            {studentName}
          </h1>
          <div className="certificate-name-rules mx-auto mt-2 w-full max-w-xs sm:mt-3 sm:max-w-sm" aria-hidden />
          <p className="certificate-preamble mt-2 text-xs text-muted sm:mt-3 sm:text-sm">
            has successfully completed the course
          </p>
          <p className="certificate-course-title mt-2 w-full max-w-2xl break-words px-2 font-[family-name:var(--font-certificate)] text-lg font-medium leading-snug text-brand-800 sm:mt-3 sm:text-xl lg:text-2xl">
            {courseTitle}
          </p>
        </div>

        {/* Footer */}
        <div className="certificate-footer w-full min-w-0 shrink-0 border-t border-brand-200/80 pt-3 sm:pt-4">
          <div className="grid w-full grid-cols-1 items-end gap-4 sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
            <div className="order-2 min-w-0 text-center sm:order-1 sm:text-left">
              {isOrgCertificate ? (
                <>
                  <div className="certificate-signatory-block mx-auto mb-2 flex h-12 max-w-[11rem] items-end justify-center sm:mx-0 sm:justify-start">
                    {organization?.signatureUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- org signatures may be data URLs
                      <img
                        src={organization.signatureUrl}
                        alt=""
                        className="certificate-signature-image max-h-11 max-w-full object-contain object-left"
                      />
                    ) : (
                      <div className="certificate-signature-line h-px w-full max-w-[10rem]" />
                    )}
                  </div>
                  {organization?.signatoryName ? (
                    <p className="font-[family-name:var(--font-certificate)] text-sm font-medium text-ink sm:text-base">
                      {organization.signatoryName}
                    </p>
                  ) : null}
                </>
              ) : (
                <>
                  <div className="certificate-signature-line mx-auto mb-2 h-px w-full max-w-[10rem] sm:mx-0" />
                  <p className="font-[family-name:var(--font-certificate)] text-sm font-medium text-ink sm:text-base">
                    {instructorName}
                  </p>
                  <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-muted sm:text-[10px]">
                    Course instructor
                  </p>
                </>
              )}
            </div>

            <div className="order-1 flex flex-col items-center gap-2 sm:order-2">
              <CertificateSeal />
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-brand-600 sm:text-[10px]">
                {isOrgCertificate ? "Verified partnership" : "Verified credential"}
              </p>
            </div>

            <div className="order-3 min-w-0 text-center sm:text-right">
              <div className="certificate-signature-line certificate-signature-line--right mx-auto mb-2 h-px w-full max-w-[10rem] sm:ml-auto sm:mr-0" />
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-muted sm:text-[10px]">
                Date issued
              </p>
              <p className="mt-0.5 font-[family-name:var(--font-certificate)] text-sm font-medium text-ink sm:text-base">
                {formatDate(issuedAt)}
              </p>
              <p className="mt-2 break-all font-mono text-[10px] font-medium text-muted sm:text-[11px]">
                {certificateNo}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
