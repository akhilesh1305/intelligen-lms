import { notFound } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { getCertificate } from "@/lib/certificates";
import { getCertificateVerifyUrl } from "@/lib/certificate-hub";
import { resolveCertificateTemplate } from "@/lib/certificate-templates";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { PrintButton } from "@/components/certificates/print-button";
import { CertificateDocument } from "@/components/certificates/certificate-document";
import { LinkedInShareButton } from "@/components/certificates/linkedin-share-button";
import { CertificateQrPlaceholder } from "@/components/certificates/certificate-qr-placeholder";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  const certificate = await getCertificate(id);

  if (!certificate) notFound();

  const canView =
    session?.id === certificate.userId ||
    session?.role === "ADMIN" ||
    session?.role === "INSTRUCTOR";

  if (!canView && !session) notFound();

  const template = resolveCertificateTemplate(certificate.course);
  const verifyUrl = getCertificateVerifyUrl(certificate.certificateNo);

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: landscape;
            margin: 0.5in;
          }
          body * {
            visibility: hidden;
          }
          #certificate,
          #certificate * {
            visibility: visible;
          }
          #certificate {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            max-width: none;
            box-shadow: none;
            aspect-ratio: 11 / 8.5;
          }
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 print:p-0">
        <CertificateDocument
          studentName={certificate.user.name}
          courseTitle={certificate.course.title}
          instructorName={certificate.course.instructor.name}
          certificateNo={certificate.certificateNo}
          issuedAt={certificate.issuedAt}
          template={template}
          skillLevel={certificate.course.skillLevel}
          organization={
            certificate.course.organization
              ? {
                  name: certificate.course.organization.name,
                  logoUrl: certificate.course.organization.logoUrl,
                  signatoryName: certificate.course.organization.signatoryName,
                  signatureUrl: certificate.course.organization.signatureUrl,
                }
              : null
          }
        />

        <div className="mt-8 flex flex-col gap-6 print:hidden lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
            <PrintButton />
            <LinkedInShareButton
              certificateNo={certificate.certificateNo}
              courseTitle={certificate.course.title}
              verifyUrl={verifyUrl}
            />
            <Link href={`/certificates/verify/${encodeURIComponent(certificate.certificateNo)}`}>
              <Button variant="outline">
                <ShieldCheck className="h-4 w-4" />
                Verify publicly
              </Button>
            </Link>
            <Link href="/certificates">
              <Button variant="outline">All certificates</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </div>

          <CertificateQrPlaceholder certificateNo={certificate.certificateNo} />
        </div>
      </div>
    </>
  );
}
