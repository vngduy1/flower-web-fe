"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";

import { Alert, Button } from "@/components/ui";
import { normalizeApiError } from "@/lib/api";

import { useCreateAdminCoupon, useUpdateAdminCoupon } from "../hooks/use-admin-coupons";
import {
  adminCouponFormSchema,
  type AdminCouponFormValues,
} from "../schemas/admin-coupon.schema";
import type { AdminCoupon } from "../types/admin-coupon";
import {
  buildAdminCouponRequest,
  getCouponFormDefaults,
  getUnclearableCouponFields,
} from "../utils/admin-coupon";
import { CouponBasicSection } from "./coupon-basic-section";
import { CouponDiscountSection } from "./coupon-discount-section";
import { CouponLimitsSection } from "./coupon-limits-section";
import { CouponPeriodSection } from "./coupon-period-section";
import { CouponPublicationSection } from "./coupon-publication-section";
import { CouponRequirementsSection } from "./coupon-requirements-section";

const unclearableLabels = {
  maximumDiscountAmount: "最大割引額",
  usageLimit: "総利用上限",
  perUserLimit: "お客様ごとの利用上限",
} as const;

export function CouponForm({ coupon }: { coupon?: AdminCoupon }) {
  const router = useRouter();
  const createMutation = useCreateAdminCoupon();
  const updateMutation = useUpdateAdminCoupon(coupon?.id ?? "");
  const mutation = coupon ? updateMutation : createMutation;
  const [success, setSuccess] = useState(false);
  const form = useForm<AdminCouponFormValues>({
    resolver: zodResolver(adminCouponFormSchema),
    defaultValues: getCouponFormDefaults(coupon),
  });
  const discountType = useWatch({
    control: form.control,
    name: "discountType",
  });
  const mutationError = mutation.error ? normalizeApiError(mutation.error) : null;

  useEffect(() => {
    if (coupon) {
      form.setValue("isActive", coupon.isActive, { shouldDirty: false });
    }
  }, [coupon, form]);

  function resetForm() {
    setSuccess(false);
    mutation.reset();
    form.reset(getCouponFormDefaults(coupon));
  }

  function cancel() {
    if (form.formState.isDirty && !window.confirm("保存していない変更を破棄しますか？")) {
      return;
    }

    router.push("/admin/coupons");
  }

  const submit: SubmitHandler<AdminCouponFormValues> = async (values) => {
    setSuccess(false);

    if (coupon) {
      const unclearable = getUnclearableCouponFields(coupon, values);

      if (unclearable.length > 0) {
        unclearable.forEach((field) =>
          form.setError(field, {
            message: `${unclearableLabels[field]}はAPIで未設定へ戻せません。正の値を入力してください。`,
          }),
        );
        return;
      }
    }

    try {
      const request = buildAdminCouponRequest(values);

      if (coupon) {
        const updated = await updateMutation.mutateAsync(request);
        form.reset(getCouponFormDefaults(updated));
        setSuccess(true);
        return;
      }

      const created = await createMutation.mutateAsync(request);
      router.push(`/admin/coupons/${created.id}?created=true`);
    } catch {
      // The normalized backend error remains visible above the form.
    }
  };

  return (
    <form
      className="grid gap-6"
      onSubmit={(event) => void form.handleSubmit(submit)(event)}
      noValidate
    >
      {success ? <Alert variant="success">クーポン情報を更新しました。</Alert> : null}
      {mutationError ? (
        <Alert variant="error" title="クーポンを保存できませんでした">
          {mutationError.messages.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </Alert>
      ) : null}

      <CouponBasicSection form={form} />
      <CouponDiscountSection form={form} discountType={discountType} />
      <CouponRequirementsSection form={form} />
      <CouponLimitsSection form={form} isEdit={Boolean(coupon)} />
      <CouponPeriodSection form={form} />
      <CouponPublicationSection
        form={form}
        isEdit={Boolean(coupon)}
        currentIsActive={coupon?.isActive}
      />

      <div className="flex flex-wrap items-center justify-end gap-3">
        {coupon && form.formState.isDirty ? (
          <span className="text-muted-foreground mr-auto text-xs">
            未保存の変更があります
          </span>
        ) : null}
        {coupon ? (
          <Button
            variant="ghost"
            disabled={!form.formState.isDirty || mutation.isPending}
            onClick={resetForm}
          >
            変更を取り消す
          </Button>
        ) : null}
        <Button variant="secondary" disabled={mutation.isPending} onClick={cancel}>
          キャンセル
        </Button>
        <Button
          type="submit"
          isLoading={mutation.isPending}
          disabled={Boolean(coupon) && !form.formState.isDirty}
        >
          {coupon ? "変更を保存" : "クーポンを作成"}
        </Button>
      </div>
    </form>
  );
}
