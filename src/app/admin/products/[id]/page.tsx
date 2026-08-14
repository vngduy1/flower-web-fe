import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui";
import { AdminProductDetail } from "@/features/admin-products/components/admin-product-detail";

export const metadata: Metadata = { title: "商品詳細・編集" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
      <AdminProductDetail id={id} />
    </Suspense>
  );
}
