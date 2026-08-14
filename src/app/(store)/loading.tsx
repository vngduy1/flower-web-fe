import { Skeleton } from "@/components/ui";
import { ProductGridSkeleton } from "@/features/products/components/product-grid-skeleton";

export default function StoreLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-4 h-12 w-72 max-w-full" />
      <Skeleton className="mt-5 h-5 w-full max-w-xl" />
      <Skeleton className="mt-10 h-36 w-full rounded-3xl" />
      <div className="mt-10">
        <ProductGridSkeleton />
      </div>
    </div>
  );
}
