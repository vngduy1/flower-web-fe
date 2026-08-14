import { Skeleton } from "@/components/ui";

export function CartSkeleton() {
  return (
    <div
      className="grid gap-8 lg:grid-cols-[1fr_340px]"
      role="status"
      aria-label="カートを読み込んでいます"
    >
      <div className="grid gap-4">
        {Array.from({ length: 2 }, (_, index) => (
          <div
            key={index}
            className="bg-surface grid gap-5 rounded-3xl border p-5 sm:grid-cols-[140px_1fr]"
          >
            <Skeleton className="aspect-square rounded-2xl" />
            <div>
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-3 h-7 w-2/3" />
              <Skeleton className="mt-4 h-5 w-36" />
              <Skeleton className="mt-6 h-10 w-40 rounded-full" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-80 rounded-3xl" />
    </div>
  );
}
