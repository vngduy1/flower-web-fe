import type { UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui";

import type { AdminCouponFormValues } from "../schemas/admin-coupon.schema";

const sectionClass = "border-brand/10 rounded-2xl border bg-white p-5 shadow-sm sm:p-6";

export function CouponPeriodSection({
  form,
}: {
  form: UseFormReturn<AdminCouponFormValues>;
}) {
  return (
    <section className={sectionClass}>
      <h2 className="text-brand-dark font-serif text-xl font-semibold">有効期間</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Input
          id="coupon-starts-at"
          label="開始日時"
          type="datetime-local"
          required
          error={form.formState.errors.startsAt?.message}
          {...form.register("startsAt")}
        />
        <Input
          id="coupon-ends-at"
          label="終了日時"
          type="datetime-local"
          required
          error={form.formState.errors.endsAt?.message}
          {...form.register("endsAt")}
        />
      </div>
    </section>
  );
}
