import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui";
import { AdminProductList } from "@/features/admin-products/components/admin-product-list";

export const metadata: Metadata = {
  title: "商品管理",
  description: "商品カタログの管理画面です。",
};
export default function AdminProductsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
      <AdminProductList />
    </Suspense>
  );
}
