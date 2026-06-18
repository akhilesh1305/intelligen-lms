import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import {
  getCertificateVerifyUrl,
  verifyCertificateByNumber,
} from "@/lib/certificate-hub";
import { CERTIFICATE_TEMPLATES } from "@/lib/certificate-templates";
import { CertificateQrPlaceholder } from "@/components/certificates/certificate-qr-placeholder";
import { LinkedInShareButton } from "@/components/certificates/linkedin-share-button";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ certificateNo: string }>;
}) {
  const { certificateNo } = await params;
  return {
    title: `Verify ${decodeURIComponent(certificateNo)} | IntelliGen LMS`,
    description: "Public certificate verification for IntelliGen LMS credentials",
  };
}

export default async function CertificateVerifyPage({
  params,
}: {
  params: Promise<{ certificateNo: string }>;
}) {
  const { certificateNo: rawNo } = await params;
  const certificateNo = decodeURIComponent(rawNo);
  const result = await verifyCertificateByNumber(certificateNo);

  if (!result) notFound();

  const verifyUrl = getCertificateVerifyUrl(result.certificateNo);
  const template = CERTIFICATE_TEMPLATES[result.template];

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-brand-50/40 via-canvas to-canvas px-4 py-12 dark:from-brand-950/20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="glass-card overflow-hidden rounded-[24px] border border-emerald-500/20 p-6 sm:p-8">
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                Verified credential
              </p>
              <h1 className="mt-1 text-2xl font-bold text-ink">Certificate verification</h1>
              <p className="mt-2 text-sm text-muted">
                This certificate was issued by IntelliGen LMS and is authentic.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-start">
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Recipient
                </dt>
                <dd className="mt-1 text-lg font-semibold text-ink">{result.studentName}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Course
                </dt>
                <dd className="mt-1 font-medium text-ink">{result.courseTitle}</dd>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Issued
                  </dt>
                  <dd className="mt-1 text-ink">{formatDate(result.issuedAt)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Template
                  </dt>
                  <dd className="mt-1 text-ink">{template.label}</dd>
                </div>
              </div>
              {result.organizationName ? (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Organization
                  </dt>
                  <dd className="mt-1 text-ink">{result.organizationName}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Instructor
                </dt>
                <dd className="mt-1 text-ink">{result.instructorName}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Certificate ID
                </dt>
                <dd className="mt-1 break-all font-mono text-sm text-brand-700 dark:text-brand-300">
                  {result.certificateNo}
                </dd>
              </div>
            </dl>

            <CertificateQrPlaceholder certificateNo={result.certificateNo} />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 border-t border-border/70 pt-6 sm:justify-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
              <BadgeCheck className="h-4 w-4" />
              Valid · IntelliGen LMS
            </div>
            <LinkedInShareButton
              certificateNo={result.certificateNo}
              courseTitle={result.courseTitle}
              verifyUrl={verifyUrl}
            />
            <Link href="/">
              <Button variant="outline" size="sm">
                Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
