import type { Metadata } from "next";

import { AdminDashboardContent } from "@/features/admin-dashboard/components/admin-dashboard-content";

export const metadata: Metadata = {
  title: "管理ダッシュボード",
  description: "注文、売上、商品、在庫、クーポン、通知の管理サマリーです。",
};

export default function AdminDashboardPage() {
  return <AdminDashboardContent />;
}
