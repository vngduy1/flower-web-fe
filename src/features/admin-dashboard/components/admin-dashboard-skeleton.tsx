import { Skeleton } from "@/components/ui";

export function AdminDashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="管理ダッシュボードを読み込み中" role="status">
      <div className="mb-8">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-3 h-11 w-64" />
        <Skeleton className="mt-4 h-5 w-full max-w-xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-36 rounded-3xl" />
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <Skeleton className="h-96 rounded-3xl" />
        <Skeleton className="h-96 rounded-3xl" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Skeleton className="h-120 rounded-3xl" />
        <Skeleton className="h-120 rounded-3xl" />
      </div>
      <Skeleton className="mt-6 h-130 rounded-3xl" />
    </div>
  );
}
