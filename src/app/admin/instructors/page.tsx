import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { requireAuth } from "@/lib/auth";

import { getActiveInstructors, getPendingInstructors } from "@/lib/instructor";

import { SectionHeader } from "@/components/ui/section-header";

import { Card, CardContent } from "@/components/ui/card";

import { CreateInstructorForm } from "./create-instructor-form";

import { InstructorApprovalActions } from "./instructor-approval-actions";



export default async function InstructorApprovalsPage() {

  await requireAuth(["ADMIN"]);

  const [pending, active] = await Promise.all([

    getPendingInstructors(),

    getActiveInstructors(),

  ]);



  return (

    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

      <Link

        href="/dashboard"

        className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"

      >

        <ArrowLeft className="h-4 w-4" />

        Back to dashboard

      </Link>



      <div className="mt-4">

        <SectionHeader

          title="Instructor management"

          description="Create instructor accounts or review self-registrations"

        />

      </div>



      <p className="mt-4 text-sm text-muted">

        Looking for course submissions?{" "}

        <Link href="/admin/approvals" className="font-medium text-brand-600 hover:underline">

          Course approvals

        </Link>

      </p>



      <div className="mt-8">

        <CreateInstructorForm />

      </div>



      {pending.length > 0 ? (

        <div className="mt-10">

          <h2 className="text-lg font-semibold text-ink">Pending verification</h2>

          <p className="mt-1 text-sm text-muted">

            Instructors who registered publicly and await your approval

          </p>

          <div className="mt-4 space-y-4">

            {pending.map((instructor) => (

              <div

                key={instructor.id}

                className="rounded-lg border border-border bg-panel p-6 shadow-card"

              >

                <div className="flex flex-wrap items-start justify-between gap-4">

                  <div>

                    <h3 className="text-lg font-bold text-ink">{instructor.name}</h3>

                    <p className="mt-1 text-sm text-muted">{instructor.email}</p>

                    <p className="mt-2 text-xs text-muted">

                      Registered{" "}

                      {instructor.createdAt.toLocaleDateString("en-US", {

                        month: "long",

                        day: "numeric",

                        year: "numeric",

                      })}

                    </p>

                  </div>

                  <InstructorApprovalActions instructorId={instructor.id} />

                </div>

              </div>

            ))}

          </div>

        </div>

      ) : null}



      <div className="mt-10">

        <h2 className="text-lg font-semibold text-ink">Active instructors</h2>

        <p className="mt-1 text-sm text-muted">

          Approved instructors who can create and manage courses

        </p>

        {active.length === 0 ? (

          <p className="mt-6 text-center text-sm text-muted">

            No active instructors yet. Create one above.

          </p>

        ) : (

          <Card className="mt-4">

            <CardContent className="divide-y divide-border p-0">

              {active.map((instructor) => (

                <div

                  key={instructor.id}

                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"

                >

                  <div>

                    <p className="font-medium text-ink">{instructor.name}</p>

                    <p className="text-sm text-muted">{instructor.email}</p>

                  </div>

                  <p className="text-sm text-muted">

                    {instructor._count.coursesTaught} course

                    {instructor._count.coursesTaught !== 1 ? "s" : ""}

                  </p>

                </div>

              ))}

            </CardContent>

          </Card>

        )}

      </div>

    </div>

  );

}

