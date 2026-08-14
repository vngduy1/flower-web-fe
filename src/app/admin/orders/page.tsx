import type { Metadata } from "next";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui";
import { AdminOrderList } from "@/features/admin-orders/components/admin-order-list";
import { AuthGuard } from "@/features/auth/components/auth-guard";

export const metadata: Metadata = {
  title: "注文管理",
  description: "注文の管理画面です。",
};

export default function AdminOrdersPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
        <AdminOrderList />
      </Suspense>
    </AuthGuard>
  );
}
