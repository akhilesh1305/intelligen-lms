import Link from "next/link";
import { CertificateDocument } from "@/components/certificates/certificate-document";
import { PrintButton } from "@/components/certificates/print-button";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Demo certificate — IntelliGen LMS",
  robots: { index: false, follow: false },
};

const PLATFORM_DEMO = {
  studentName: "Sarah Johnson",
  courseTitle: "AI Fundamentals",
  instructorName: "Dr. Ananya Rao",
  certificateNo: "ACME-IGLMS-AI-2026-0042",
  issuedAt: new Date("2026-05-18"),
};

const ORG_DEMO = {
  studentName: "Sarah Johnson",
  courseTitle: "Leadership Excellence",
  instructorName: "Marcus Chen",
  certificateNo: "ACME-IGLMS-LEAD-2026-0018",
  issuedAt: new Date("2026-04-02"),
  organization: {
    name: "Acme Corporation",
    logoUrl: null as string | null,
    signatoryName: "Michael Torres",
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
              Organization certificate (Corporate template)
            </h2>
            <p className="mb-4 text-center text-sm text-muted">
              Dual logos, org signatory name, and signature image when configured
              in{" "}
              <Link href="/org/acme/settings" className="font-medium text-brand-600 hover:underline">
                org settings
              </Link>
              .
            </p>
            <CertificateDocument {...ORG_DEMO} template="corporate" />
          </section>

          <section>
            <h2 className="mb-4 text-center text-lg font-bold text-ink">
              AI Professional template
            </h2>
            <CertificateDocument
              {...PLATFORM_DEMO}
              courseTitle="AI Fundamentals"
              certificateNo="ACME-IGLMS-AI-2026-0042"
              template="ai-professional"
            />
          </section>

          <section>
            <h2 className="mb-4 text-center text-lg font-bold text-ink">
              Technical Expert template
            </h2>
            <CertificateDocument
              {...PLATFORM_DEMO}
              studentName="Sarah Johnson"
              courseTitle="Leadership Excellence"
              certificateNo="ACME-IGLMS-LEAD-2026-0018"
              template="technical-expert"
            />
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
