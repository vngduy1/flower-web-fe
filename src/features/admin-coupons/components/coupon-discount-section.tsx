import type { UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui";

import type { AdminCouponFormValues } from "../schemas/admin-coupon.schema";
import type { CouponDiscountType } from "../types/admin-coupon";

const sectionClass = "border-brand/10 rounded-2xl border bg-white p-5 shadow-sm sm:p-6";
const controlClass =
  "focus:border-brand min-h-11 w-full rounded-xl border bg-white px-3.5 text-sm shadow-sm focus:outline-none";

export function CouponDiscountSection({
  discountType,
  form,
}: {
  discountType: CouponDiscountType;
  form: UseFormReturn<AdminCouponFormValues>;
}) {
  return (
    <section className={sectionClass}>
      <h2 className="text-brand-dark font-serif text-xl font-semibold">割引</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <label className="grid gap-2 text-sm font-semibold">
          割引種別
          <select className={controlClass} {...form.register("discountType")}>
            <option value="PERCENTAGE">パーセント</option>
            <option value="FIXED_AMOUNT">固定額</option>
          </select>
        </label>
        <Input
          id="coupon-discount-value"
          label={discountType === "PERCENTAGE" ? "割引率（%）" : "割引額（JPY）"}
          type="number"
          min="0.01"
          max={discountType === "PERCENTAGE" ? "100" : undefined}
          step="0.01"
          required
          error={form.formState.errors.discountValue?.message}
          {...form.register("discountValue")}
        />
        <Input
          id="coupon-maximum-discount"
          label="最大割引額（任意）"
          type="number"
          min="0.01"
          step="0.01"
          hint="未設定の場合は上限なし"
          error={form.formState.errors.maximumDiscountAmount?.message}
          {...form.register("maximumDiscountAmount")}
        />
      </div>
    </section>
  );
}
