import { requireOrganizationAdminBySlug } from "@/lib/org-admin";

import { OrgLogoUpload } from "@/components/org/org-logo-upload";

import { OrgSignatureUpload } from "@/components/org/org-signature-upload";

import { CertificateDocument } from "@/components/certificates/certificate-document";

import { SectionHeader } from "@/components/ui/section-header";

import { Card, CardContent } from "@/components/ui/card";



export default async function OrgSettingsPage({

  params,

}: {

  params: Promise<{ slug: string }>;

}) {

  const { slug } = await params;

  const { session, org } = await requireOrganizationAdminBySlug(slug);



  return (

    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

      <SectionHeader

        title={`${org.name} — certificates`}

        description="Upload your organization logo, add your signatory details, and preview completion certificates"

      />



      <div className="mt-8 space-y-8">

        <OrgLogoUpload

          organizationId={org.id}

          organizationName={org.name}

          logoUrl={org.logoUrl}

        />



        <OrgSignatureUpload

          organizationId={org.id}

          organizationName={org.name}

          signatoryName={org.signatoryName}

          signatureUrl={org.signatureUrl}

          defaultSignatoryName={session.name}

        />



        <Card>

          <CardContent className="pt-6">

            <h2 className="text-lg font-bold text-ink">Certificate preview</h2>

            <p className="mt-1 text-sm text-muted">

              How completion certificates will look for learners who finish your

              organization&apos;s courses.

            </p>

            <div className="mt-6 overflow-x-auto">

              <div className="min-w-[800px]">

                <CertificateDocument

                  studentName="Sample Learner"

                  courseTitle="Workplace Safety Essentials"

                  instructorName="Org Instructor"

                  certificateNo="IG-DEMO-ORG-2026"

                  issuedAt={new Date()}

                  organization={{

                    name: org.name,

                    logoUrl: org.logoUrl,

                    signatoryName: org.signatoryName ?? session.name,

                    signatureUrl: org.signatureUrl,

                  }}

                />

              </div>

            </div>

          </CardContent>

        </Card>

      </div>

    </div>

  );

}

