import type { Metadata } from "next";

import { AdminOrderDetail } from "@/features/admin-orders/components/admin-order-detail";
import { AuthGuard } from "@/features/auth/components/auth-guard";

export const metadata: Metadata = { title: "注文詳細" };

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminOrderDetail id={id} />
    </AuthGuard>
  );
}
