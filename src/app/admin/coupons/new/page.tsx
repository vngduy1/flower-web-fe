import type { Metadata } from "next";
import Link from "next/link";

import { CouponForm } from "@/features/admin-coupons/components/coupon-form";

export const metadata: Metadata = {
  title: "クーポン作成",
  description: "新しいクーポンを作成します。",
};

export default function NewAdminCouponPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/admin/coupons" className="text-brand text-sm font-semibold">
        ← クーポン一覧
      </Link>
      <div className="mt-5">
        <p className="text-accent text-xs font-bold tracking-[.18em] uppercase">
          New coupon
        </p>
        <h1 className="text-brand-dark mt-2 font-serif text-3xl font-semibold">
          クーポンを作成
        </h1>
        <p className="text-muted-foreground mt-3 text-sm">
          割引条件や有効期間を設定してクーポンを作成します。
        </p>
      </div>
      <div className="mt-7">
        <CouponForm />
      </div>
    </div>
  );
}
