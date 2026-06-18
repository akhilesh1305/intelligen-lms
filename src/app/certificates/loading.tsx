import { DashboardShell } from "@/components/dashboard/dashboard-motion";
import {
  Skeleton,
  SkeletonCourseGrid,
  SkeletonPageHeader,
  SkeletonWidget,
} from "@/components/ui/skeleton";

export default function CertificatesLoading() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <SkeletonPageHeader />
        <Skeleton className="h-28 w-full rounded-[20px]" />
        <SkeletonWidget className="min-h-[12rem]" />
        <SkeletonCourseGrid count={3} />
      </div>
    </DashboardShell>
  );
}
