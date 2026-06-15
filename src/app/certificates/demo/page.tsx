import Link from "next/link";
import { CertificateDocument } from "@/components/certificates/certificate-document";
import { PrintButton } from "@/components/certificates/print-button";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Demo certificate — IntelliGen LMS",
  robots: { index: false, follow: false },
};

const DEMO = {
  studentName: "Priya Sharma",
  courseTitle: "Advanced React Patterns",
  instructorName: "Dr. Sarah Chen",
  certificateNo: "IGLMS-DEMO-2026-0042",
  issuedAt: new Date("2026-03-15"),
};

const printStyles = `
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
`;

export default function DemoCertificatePage() {
  return (
    <>
      <style>{printStyles}</style>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 print:p-0">
        <p className="mb-6 text-center text-sm text-muted print:hidden">
          Sample certificate — logo, watermark, and print layout preview.
        </p>

        <CertificateDocument {...DEMO} />

        <div className="mt-6 flex flex-wrap justify-center gap-4 print:hidden">
          <PrintButton />
          <Link href="/logo-preview">
            <Button variant="outline">Logo preview</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Home</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
