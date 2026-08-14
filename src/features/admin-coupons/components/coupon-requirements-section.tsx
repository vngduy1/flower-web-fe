import type { UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui";

import type { AdminCouponFormValues } from "../schemas/admin-coupon.schema";

const sectionClass = "border-brand/10 rounded-2xl border bg-white p-5 shadow-sm sm:p-6";

export function CouponRequirementsSection({
  form,
}: {
  form: UseFormReturn<AdminCouponFormValues>;
}) {
  return (
    <section className={sectionClass}>
      <h2 className="text-brand-dark font-serif text-xl font-semibold">注文条件</h2>
      <div className="mt-5 max-w-md">
        <Input
          id="coupon-minimum-order"
          label="最低注文額（JPY）"
          type="number"
          min="0"
          step="0.01"
          required
          hint="条件を設けない場合は0"
          error={form.formState.errors.minimumOrderAmount?.message}
          {...form.register("minimumOrderAmount")}
        />
      </div>
    </section>
  );
}
