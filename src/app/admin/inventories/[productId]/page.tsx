import type { Metadata } from "next";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui";
import { InventoryDetail } from "@/features/admin-inventory/components/inventory-detail";
import { AuthGuard } from "@/features/auth/components/auth-guard";

export const metadata: Metadata = { title: "在庫詳細" };

export default async function AdminInventoryDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
        <InventoryDetail productId={productId} />
      </Suspense>
    </AuthGuard>
  );
}
