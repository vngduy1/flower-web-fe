import { Skeleton } from "@/components/ui";

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-label="商品を読み込んでいます"
      role="status"
    >
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          <Skeleton className="aspect-square w-full rounded-[1.7rem]" />
          <Skeleton className="mt-5 h-3 w-20" />
          <Skeleton className="mt-3 h-6 w-4/5" />
          <Skeleton className="mt-3 h-5 w-24" />
        </div>
      ))}
    </div>
  );
}
