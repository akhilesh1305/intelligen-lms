import { notFound } from "next/navigation";
import Link from "next/link";
import { getCertificate } from "@/lib/certificates";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { PrintButton } from "@/components/certificates/print-button";
import { CertificateDocument } from "@/components/certificates/certificate-document";

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
            aspect-ratio: 1.414 / 1;
          }
        }
      `}</style>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 print:p-0">
        <CertificateDocument
          studentName={certificate.user.name}
          courseTitle={certificate.course.title}
          instructorName={certificate.course.instructor.name}
          certificateNo={certificate.certificateNo}
          issuedAt={certificate.issuedAt}
        />

        <div className="mt-6 flex justify-center gap-4 print:hidden">
          <PrintButton />
          <Link href="/dashboard">
            <Button variant="outline">Back to dashboard</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
