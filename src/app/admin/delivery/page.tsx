import type { Metadata } from "next";

import { AdminDeliveryPage } from "@/features/admin-delivery/components/admin-delivery-page";

export const metadata: Metadata = {
  title: "配送管理",
  description: "配送エリア、時間帯、配送不可日、日別容量を管理します。",
};

export default function AdminDeliveryRoute() {
  return <AdminDeliveryPage />;
}
