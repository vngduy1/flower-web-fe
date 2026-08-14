import type { UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui";

import type { AdminCouponFormValues } from "../schemas/admin-coupon.schema";

const sectionClass = "border-brand/10 rounded-2xl border bg-white p-5 shadow-sm sm:p-6";
const textareaClass =
  "focus:border-brand min-h-32 w-full rounded-xl border bg-white px-3.5 py-3 text-sm shadow-sm focus:outline-none";

export function CouponBasicSection({
  form,
}: {
  form: UseFormReturn<AdminCouponFormValues>;
}) {
  return (
    <section className={sectionClass}>
      <h2 className="text-brand-dark font-serif text-xl font-semibold">基本情報</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Input
          id="coupon-code"
          label="クーポンコード"
          maxLength={50}
          required
          autoComplete="off"
          className="uppercase"
          error={form.formState.errors.code?.message}
          {...form.register("code")}
        />
        <Input
          id="coupon-name"
          label="クーポン名"
          maxLength={150}
          required
          error={form.formState.errors.name?.message}
          {...form.register("name")}
        />
        <label className="grid gap-2 text-sm font-semibold sm:col-span-2">
          説明
          <textarea
            rows={5}
            maxLength={500}
            className={textareaClass}
            aria-invalid={Boolean(form.formState.errors.description)}
            {...form.register("description")}
          />
          {form.formState.errors.description ? (
            <span className="text-sm text-red-700" role="alert">
              {form.formState.errors.description.message}
            </span>
          ) : (
            <span className="text-muted-foreground text-xs">最大500文字</span>
          )}
        </label>
      </div>
    </section>
  );
}
