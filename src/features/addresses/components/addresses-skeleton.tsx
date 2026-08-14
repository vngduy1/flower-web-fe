import { Skeleton } from "@/components/ui";

export function AddressesSkeleton() {
  return (
    <div
      className="grid gap-5 xl:grid-cols-2"
      role="status"
      aria-label="配送先を読み込んでいます"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="rounded-3xl border p-6">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="mt-5 h-4 w-28" />
          <Skeleton className="mt-3 h-20 w-full" />
          <Skeleton className="mt-5 h-10 w-48 rounded-full" />
        </div>
      ))}
    </div>
  );
}
