import type { UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui";

import type { AdminCouponFormValues } from "../schemas/admin-coupon.schema";

const sectionClass = "border-brand/10 rounded-2xl border bg-white p-5 shadow-sm sm:p-6";

export function CouponLimitsSection({
  form,
  isEdit,
}: {
  form: UseFormReturn<AdminCouponFormValues>;
  isEdit: boolean;
}) {
  const editHint = isEdit
    ? "既存の上限は別の正の整数へ変更できます。APIは未設定への解除を受け付けません。"
    : "未設定の場合は無制限";

  return (
    <section className={sectionClass}>
      <h2 className="text-brand-dark font-serif text-xl font-semibold">利用上限</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Input
          id="coupon-usage-limit"
          label="総利用上限（任意）"
          type="number"
          min="1"
          step="1"
          hint={editHint}
          error={form.formState.errors.usageLimit?.message}
          {...form.register("usageLimit")}
        />
        <Input
          id="coupon-per-user-limit"
          label="お客様ごとの利用上限（任意）"
          type="number"
          min="1"
          step="1"
          hint={editHint}
          error={form.formState.errors.perUserLimit?.message}
          {...form.register("perUserLimit")}
        />
      </div>
    </section>
  );
}
