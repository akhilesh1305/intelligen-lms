import { DashboardShell } from "@/components/dashboard/dashboard-motion";
import {
  Skeleton,
  SkeletonCourseGrid,
  SkeletonPageHeader,
  SkeletonStatGrid,
  SkeletonWidget,
} from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="h-36 w-full rounded-[20px]" />
        <SkeletonPageHeader />
        <SkeletonStatGrid />
        <div className="grid gap-6 lg:grid-cols-2">
          <SkeletonWidget />
          <SkeletonWidget />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <SkeletonWidget />
          <SkeletonWidget />
          <SkeletonWidget />
          <SkeletonWidget />
        </div>
        <SkeletonCourseGrid count={3} />
      </div>
    </DashboardShell>
  );
}
