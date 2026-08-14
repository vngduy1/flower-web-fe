import type { Metadata } from "next";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui";
import { AdminCouponList } from "@/features/admin-coupons/components/admin-coupon-list";

export const metadata: Metadata = {
  title: "クーポン管理",
  description: "クーポンの条件、公開状態、利用状況を管理します。",
};

export default function AdminCouponsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
      <AdminCouponList />
    </Suspense>
  );
}
