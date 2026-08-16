import { Skeleton } from "@/components/ui";

export function CheckoutSkeleton() {
  return (
    <div
      className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"
      role="status"
      aria-label="チェックアウトを読み込んでいます"
    >
      <div className="grid gap-6">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="rounded-3xl border p-7">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="mt-6 h-28 w-full" />
          </div>
        ))}
      </div>
      <Skeleton className="h-115 rounded-3xl" />
    </div>
  );
}
