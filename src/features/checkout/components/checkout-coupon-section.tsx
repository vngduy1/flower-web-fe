"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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

const INITIAL_COUPON_COUNT = 3;

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
  const [showAllCoupons, setShowAllCoupons] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CouponCodeFormValues>({
    resolver: zodResolver(couponCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    if (validation) {
      reset({
        code: validation.coupon.code,
      });
    }
  }, [reset, validation]);

  const validateCode = async (code: string) => {
    try {
      await onValidate(code);
    } catch {
      // エラー表示は親コンポーネント側で行う
    }
  };

  const submit = handleSubmit(async ({ code }) => {
    await validateCode(code);
  });

  const availableCoupons = couponsQuery.data?.items ?? [];

  const visibleCoupons = showAllCoupons
    ? availableCoupons
    : availableCoupons.slice(0, INITIAL_COUPON_COUNT);

  const hasMoreCoupons =
    availableCoupons.length > INITIAL_COUPON_COUNT;

  return (
    <section className="border-brand/15 border-t pt-8">
      {/* Heading */}
      <p className="home-eyebrow">Step 03</p>

      <h2 className="text-brand-dark mt-4 font-serif text-2xl font-medium">
        クーポン
      </h2>

      <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-7">
        クーポンコードをお持ちの場合は入力するか、
        利用可能なクーポンからお選びください。
      </p>

      {/* Applied coupon */}
      {validation ? (
        <div className="border-brand mt-7 border-l-2 pl-4">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-muted-foreground text-[10px] font-semibold tracking-[0.12em] uppercase">
                Applied coupon
              </p>

              <p className="text-brand-dark mt-2 font-semibold">
                {validation.coupon.code}
              </p>

              <p className="text-muted-foreground mt-1 text-sm">
                {validation.coupon.name}
              </p>

              <p className="text-brand mt-3 font-serif text-xl font-medium">
                −{formatYen(validation.discountAmount)}
              </p>
            </div>

            <Button
              size="sm"
              variant="ghost"
              className="text-muted-foreground hover:bg-transparent hover:text-brand-dark"
              disabled={isPending}
              onClick={() => {
                onRemove();
                reset({
                  code: "",
                });
              }}
            >
              適用を解除
            </Button>
          </div>
        </div>
      ) : null}

      {/* Coupon code */}
      <form
        className="mt-7 grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"
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

        <Button
          type="submit"
          className="min-h-11 px-6"
          isLoading={isPending}
        >
          適用する
        </Button>
      </form>

      {validationError ? (
        <Alert
          className="mt-5"
          variant="error"
          title="クーポンを適用できませんでした"
        >
          {validationError}
        </Alert>
      ) : null}

      {/* Available coupons */}
      <div className="border-brand/10 mt-9 border-t pt-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-muted-foreground text-[10px] font-semibold tracking-[0.12em] uppercase">
              Available coupons
            </p>

            <h3 className="text-brand-dark mt-2 text-sm font-semibold">
              利用可能なクーポン
            </h3>
          </div>

          {!couponsQuery.isPending && !couponsQuery.error ? (
            <p className="text-muted-foreground text-xs">
              {availableCoupons.length}件
            </p>
          ) : null}
        </div>

        {couponsQuery.isPending ? (
          <div className="mt-5 grid gap-4">
            {Array.from(
              { length: INITIAL_COUPON_COUNT },
              (_, index) => (
                <Skeleton
                  key={index}
                  className="h-24 rounded-lg"
                />
              ),
            )}
          </div>
        ) : couponsQuery.error ? (
          <Alert className="mt-5" variant="error">
            {normalizeApiError(couponsQuery.error).message}
          </Alert>
        ) : availableCoupons.length ? (
          <>
            <div className="border-brand/10 mt-5 border-t">
              {visibleCoupons.map((coupon) => {
                const isApplied =
                  validation?.coupon.code === coupon.code;

                return (
                  <article
                    key={coupon.id}
                    className="border-brand/10 border-b py-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-5">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-accent text-[10px] font-bold tracking-[0.14em] uppercase">
                            {coupon.code}
                          </p>

                          {isApplied ? (
                            <span className="text-brand text-[10px] font-semibold tracking-[0.08em]">
                              適用中
                            </span>
                          ) : null}
                        </div>

                        <h4 className="text-brand-dark mt-2 font-serif text-lg font-medium">
                          {coupon.name}
                        </h4>

                        <p className="text-brand mt-3 text-sm font-semibold">
                          {formatCouponBenefit(coupon)}
                        </p>
                      </div>

                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={isPending || isApplied}
                        onClick={() => {
                          setValue("code", coupon.code, {
                            shouldValidate: true,
                          });

                          void validateCode(coupon.code);
                        }}
                      >
                        {isApplied ? "適用中" : "適用"}
                      </Button>
                    </div>

                    <div className="text-muted-foreground mt-4 grid gap-x-6 gap-y-1 text-xs leading-6 sm:grid-cols-2">
                      <p>
                        最低注文額{" "}
                        {formatYen(coupon.minimumOrderAmount)}
                      </p>

                      <p>
                        有効期限{" "}
                        {new Intl.DateTimeFormat("ja-JP", {
                          dateStyle: "medium",
                        }).format(new Date(coupon.endsAt))}
                      </p>

                      <p>
                        全体残り回数:{" "}
                        {coupon.remainingUsage ?? "無制限"}
                      </p>

                      <p>
                        お客様残り回数:{" "}
                        {coupon.remainingPerUser ?? "無制限"}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            {hasMoreCoupons ? (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setShowAllCoupons((current) => !current)
                  }
                  className="group text-brand-dark inline-flex items-center gap-3 text-sm font-semibold"
                  aria-expanded={showAllCoupons}
                  aria-controls="available-coupon-list"
                >
                  {showAllCoupons
                    ? "クーポンを閉じる"
                    : `すべてのクーポンを見る（${availableCoupons.length}件）`}

                  <span
                    aria-hidden="true"
                    className={`text-xs transition-transform duration-300 ${
                      showAllCoupons ? "rotate-180" : ""
                    }`}
                  >
                    ↓
                  </span>
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <p className="text-muted-foreground mt-5 text-sm leading-7">
            現在利用可能なクーポンはありません。
          </p>
        )}
      </div>
    </section>
  );
}