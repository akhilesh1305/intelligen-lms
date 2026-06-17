import Link from "next/link";
import { CertificateDocument } from "@/components/certificates/certificate-document";
import { PrintButton } from "@/components/certificates/print-button";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Demo certificate — IntelliGen LMS",
  robots: { index: false, follow: false },
};

const PLATFORM_DEMO = {
  studentName: "Priya Sharma",
  courseTitle: "Advanced React Patterns",
  instructorName: "Dr. Sarah Chen",
  certificateNo: "IGLMS-DEMO-2026-0042",
  issuedAt: new Date("2026-03-15"),
};

const ORG_DEMO = {
  studentName: "Sample Learner",
  courseTitle: "Workplace Safety Essentials",
  instructorName: "Org Instructor",
  certificateNo: "IG-DEMO-ORG-2026",
  issuedAt: new Date(),
  organization: {
    name: "Acme Corporation",
    logoUrl: null as string | null,
    signatoryName: "Jane Smith",
    signatureUrl: null as string | null,
  },
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
      aspect-ratio: 11 / 8.5;
    }
  }
`;

export default function DemoCertificatePage() {
  return (
    <>
      <style>{printStyles}</style>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 print:p-0">
        <p className="mb-8 text-center text-sm text-muted print:hidden">
          Certificate previews — platform and organization layouts. Hard refresh
          (Ctrl+Shift+R) if you still see an older design.
        </p>

        <div className="space-y-12 print:hidden">
          <section>
            <h2 className="mb-4 text-center text-lg font-bold text-ink">
              Platform certificate
            </h2>
            <CertificateDocument {...PLATFORM_DEMO} />
          </section>

          <section>
            <h2 className="mb-4 text-center text-lg font-bold text-ink">
              Organization certificate
            </h2>
            <p className="mb-4 text-center text-sm text-muted">
              Dual logos, org signatory name, and signature image when configured
              in{" "}
              <Link href="/org/acme/settings" className="font-medium text-brand-600 hover:underline">
                org settings
              </Link>
              .
            </p>
            <CertificateDocument {...ORG_DEMO} />
          </section>
        </div>

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
