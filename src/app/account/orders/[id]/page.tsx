import type { Metadata } from "next";

import { OrderDetailContent } from "@/features/orders/components/order-detail-content";

export const metadata: Metadata = {
  title: "注文詳細",
  description: "注文内容と現在の配送・支払い状況を確認します。",
};

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;

  return <OrderDetailContent orderId={id} />;
}
