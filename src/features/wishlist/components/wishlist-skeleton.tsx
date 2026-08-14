import { Skeleton } from "@/components/ui";

export function WishlistSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-3xl border">
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="mt-5 h-10 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
