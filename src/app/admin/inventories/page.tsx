import type { Metadata } from "next";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui";
import { InventoryList } from "@/features/admin-inventory/components/inventory-list";
import { AuthGuard } from "@/features/auth/components/auth-guard";

export const metadata: Metadata = {
  title: "在庫管理",
  description: "商品在庫の管理画面です。",
};

export default function AdminInventoriesPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
        <InventoryList />
      </Suspense>
    </AuthGuard>
  );
}
