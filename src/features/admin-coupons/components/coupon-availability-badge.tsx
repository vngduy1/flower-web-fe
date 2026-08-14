import { cn } from "@/lib/utils/cn";

import type { AdminCoupon } from "../types/admin-coupon";
import {
  getCouponAvailabilityLabel,
  getCouponAvailabilityTone,
} from "../utils/admin-coupon";

const toneClasses = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  muted: "border-slate-200 bg-slate-100 text-slate-700",
} as const;

export function CouponAvailabilityBadge({ coupon }: { coupon: AdminCoupon }) {
  const tone = getCouponAvailabilityTone(coupon);

  return (
    <div className="flex flex-wrap gap-1.5">
      <span
        className={cn(
          "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
          coupon.isActive
            ? "border-blue-200 bg-blue-50 text-blue-800"
            : "border-slate-200 bg-slate-100 text-slate-700",
        )}
      >
        設定: {coupon.isActive ? "有効" : "無効"}
      </span>
      <span
        className={cn(
          "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
          toneClasses[tone],
        )}
      >
        {getCouponAvailabilityLabel(coupon)}
      </span>
    </div>
  );
}
