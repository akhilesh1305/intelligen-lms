import {
  Skeleton,
  SkeletonCourseGrid,
  SkeletonPageHeader,
  SkeletonStatGrid,
} from "@/components/ui/skeleton";

export default function GamesLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="h-40 w-full rounded-[20px]" />
      <SkeletonPageHeader />
      <SkeletonStatGrid count={4} />
      <SkeletonCourseGrid count={4} />
    </div>
  );
}
