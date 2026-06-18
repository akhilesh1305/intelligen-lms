import { Skeleton, SkeletonPageHeader, SkeletonTable } from "@/components/ui/skeleton";

export default function LeaderboardLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <SkeletonPageHeader />
      <div className="mt-6 flex gap-2">
        <Skeleton className="h-10 w-28 rounded-[12px]" />
        <Skeleton className="h-10 w-36 rounded-[12px]" />
      </div>
      <div className="mt-8">
        <SkeletonTable rows={8} />
      </div>
    </div>
  );
}
