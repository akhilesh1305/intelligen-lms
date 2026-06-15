import { requireAuth } from "@/lib/auth";
import { requireApprovedInstructorPage } from "@/lib/instructor";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CourseForm } from "../course-form";

export default async function NewCoursePage() {
  const session = await requireAuth(["INSTRUCTOR", "ADMIN"]);
  await requireApprovedInstructorPage(session);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900">Create a new course</h1>
      <p className="mt-1 text-slate-600">
        Set up your course details. You can add modules and lessons after creation.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <h2 className="font-semibold text-slate-900">Course information</h2>
        </CardHeader>
        <CardContent>
          <CourseForm />
        </CardContent>
      </Card>
    </div>
  );
}
