import type { Metadata } from "next";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui";
import { AdminCouponDetail } from "@/features/admin-coupons/components/admin-coupon-detail";

export const metadata: Metadata = {
  title: "クーポン詳細・編集",
};

export default async function AdminCouponDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<Skeleton className="h-180 rounded-2xl" />}>
      <AdminCouponDetail id={id} />
    </Suspense>
  );
}
