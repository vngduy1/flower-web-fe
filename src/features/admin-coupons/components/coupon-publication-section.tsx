import type { UseFormReturn } from "react-hook-form";

import type { AdminCouponFormValues } from "../schemas/admin-coupon.schema";

const sectionClass = "border-brand/10 rounded-2xl border bg-white p-5 shadow-sm sm:p-6";

export function CouponPublicationSection({
  currentIsActive,
  form,
  isEdit,
}: {
  currentIsActive?: boolean;
  form: UseFormReturn<AdminCouponFormValues>;
  isEdit: boolean;
}) {
  return (
    <section className={sectionClass}>
      <h2 className="text-brand-dark font-serif text-xl font-semibold">公開状態</h2>
      {isEdit ? (
        <div className="mt-5">
          <p className="text-sm font-semibold">
            現在の設定: {currentIsActive ? "有効" : "無効"}
          </p>
          <p className="text-muted-foreground mt-2 text-xs leading-6">
            無効化と再有効化は、確認付きの状態変更操作から行います。
          </p>
        </div>
      ) : (
        <label className="mt-5 flex items-center gap-3 text-sm font-semibold">
          <input type="checkbox" className="size-4" {...form.register("isActive")} />
          作成時から有効にする
        </label>
      )}
    </section>
  );
}
