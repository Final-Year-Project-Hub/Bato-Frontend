import { Skeleton } from "./skeleton";

export default function CustomSkeleton() {
  return (
    <div className="space-y-6">
      {/* Button Skeleton */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-28 rounded-md" />
      </div>

      {/* Title Skeleton */}
      <Skeleton className="h-8 w-1/2" />

      {/* Description Skeleton */}
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />

      {/* Phase Cards Skeleton */}
      <div className="space-y-4 mt-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3 border rounded-lg p-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
