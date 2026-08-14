"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Alert, Button, Input, Skeleton } from "@/components/ui";
import { useAvailableCoupons } from "@/features/coupons/hooks/use-available-coupons";
import {
  couponCodeSchema,
  type CouponCodeFormValues,
} from "@/features/coupons/schemas/coupon.schema";
import type {
  AvailableCoupon,
  CouponValidationResponse,
} from "@/features/coupons/types/coupon";
import { normalizeApiError } from "@/lib/api/errors";
import { formatYen } from "@/lib/format/currency";

interface CheckoutCouponSectionProps {
  isPending: boolean;
  onRemove: () => void;
  onValidate: (code: string) => Promise<void>;
  validation?: CouponValidationResponse;
  validationError?: string;
}

function formatCouponBenefit(coupon: AvailableCoupon): string {
  if (coupon.discountType === "FIXED_AMOUNT") {
    return `${formatYen(coupon.discountValue)}割引`;
  }

  const cap = coupon.maximumDiscountAmount
    ? `（最大${formatYen(coupon.maximumDiscountAmount)}）`
    : "";

  return `${coupon.discountValue}%割引${cap}`;
}

export function CheckoutCouponSection({
  isPending,
  onRemove,
  onValidate,
  validation,
  validationError,
}: CheckoutCouponSectionProps) {
  const couponsQuery = useAvailableCoupons();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CouponCodeFormValues>({
    resolver: zodResolver(couponCodeSchema),
    defaultValues: { code: "" },
  });

  useEffect(() => {
    if (validation) {
      reset({ code: validation.coupon.code });
    }
  }, [reset, validation]);

  const validateCode = async (code: string) => {
    try {
      await onValidate(code);
    } catch {
      // The parent renders the normalized validation error.
    }
  };

  const submit = handleSubmit(async ({ code }) => {
    await validateCode(code);
  });

  return (
    <section className="bg-surface rounded-3xl border p-5 shadow-sm sm:p-7">
      <p className="text-accent text-xs font-bold tracking-[0.15em] uppercase">Step 3</p>
      <h2 className="text-brand-dark mt-2 font-serif text-2xl font-semibold">クーポン</h2>

      {validation ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-bold">
                {validation.coupon.code} — {validation.coupon.name}
              </p>
              <p className="mt-2">割引額: {formatYen(validation.discountAmount)}</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                onRemove();
                reset({ code: "" });
              }}
            >
              適用を解除
            </Button>
          </div>
        </div>
      ) : null}

      <form
        className="mt-6 flex flex-col items-start gap-3 sm:flex-row"
        onSubmit={submit}
        noValidate
      >
        <Input
          id="checkout-coupon-code"
          label="クーポンコード"
          maxLength={50}
          className="uppercase"
          error={errors.code?.message}
          disabled={isPending}
          {...register("code")}
        />
        <Button type="submit" className="sm:mt-7" isLoading={isPending}>
          検証して適用
        </Button>
      </form>

      {validationError ? (
        <Alert className="mt-4" variant="error" title="クーポンを適用できませんでした">
          {validationError}
        </Alert>
      ) : null}

      <div className="mt-7 border-t pt-6">
        <h3 className="text-sm font-semibold">利用可能なクーポン</h3>
        {couponsQuery.isPending ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </div>
        ) : couponsQuery.error ? (
          <Alert className="mt-4" variant="error">
            {normalizeApiError(couponsQuery.error).message}
          </Alert>
        ) : couponsQuery.data.items.length ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {couponsQuery.data.items.map((coupon) => (
              <article
                key={coupon.id}
                className="rounded-2xl border bg-white p-4 text-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">{coupon.code}</p>
                    <p className="mt-1 font-semibold">{coupon.name}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={isPending}
                    onClick={() => {
                      setValue("code", coupon.code, { shouldValidate: true });
                      void validateCode(coupon.code);
                    }}
                  >
                    適用
                  </Button>
                </div>
                <p className="text-brand mt-3 font-semibold">
                  {formatCouponBenefit(coupon)}
                </p>
                <p className="text-muted-foreground mt-2 text-xs leading-5">
                  最低注文額 {formatYen(coupon.minimumOrderAmount)} / 有効期限{" "}
                  {new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(
                    new Date(coupon.endsAt),
                  )}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  残り: 全体 {coupon.remainingUsage ?? "無制限"} / お客様{" "}
                  {coupon.remainingPerUser ?? "無制限"}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground mt-4 text-sm">
            現在利用可能なクーポンはありません。
          </p>
        )}
      </div>
    </section>
  );
}
