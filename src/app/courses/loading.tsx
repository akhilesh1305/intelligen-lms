import {
  Skeleton,
  SkeletonCourseGrid,
  SkeletonPageHeader,
} from "@/components/ui/skeleton";

export default function CoursesLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SkeletonPageHeader />
      <div className="mt-8 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-full" />
        ))}
      </div>
      <div className="mt-6">
        <Skeleton className="h-11 w-full max-w-md rounded-[12px]" />
      </div>
      <div className="mt-10">
        <SkeletonCourseGrid count={6} />
      </div>
    </div>
  );
}
