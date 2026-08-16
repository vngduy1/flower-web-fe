"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Alert, Button, EmptyState } from "@/components/ui";
import { useAddresses } from "@/features/addresses/hooks/use-addresses";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useCart } from "@/features/cart/hooks/use-cart";
import { useValidateCoupon } from "@/features/coupons/hooks/use-validate-coupon";
import { useAvailableDeliveryDates } from "@/features/delivery/hooks/use-available-delivery-dates";
import { useDeliveryAreas } from "@/features/delivery/hooks/use-delivery-areas";
import { useDeliveryFee } from "@/features/delivery/hooks/use-delivery-fee";
import { useDeliveryTimeSlots } from "@/features/delivery/hooks/use-delivery-time-slots";
import { useCreateOrder } from "@/features/orders/hooks/use-create-order";
import type { CreateOrderRequest } from "@/features/orders/types/order";
import { normalizeApiError } from "@/lib/api/errors";

import { CheckoutAddressSection } from "./checkout-address-section";
import { CheckoutCartSummary } from "./checkout-cart-summary";
import { CheckoutCouponSection } from "./checkout-coupon-section";
import { CheckoutDeliverySection } from "./checkout-delivery-section";
import { CheckoutNote } from "./checkout-note";
import { CheckoutSkeleton } from "./checkout-skeleton";
import { CheckoutTotals } from "./checkout-totals";
import { PlaceOrderButton } from "./place-order-button";
import { useCheckoutPreview } from "../hooks/use-checkout-preview";
import { checkoutSchema, type CheckoutFormValues } from "../schemas/checkout.schema";
import type { CheckoutPreviewRequest } from "../types/checkout";

export function CheckoutPageContent() {
  const router = useRouter();
  const { user } = useAuth();
  const cartQuery = useCart(Boolean(user));
  const addressesQuery = useAddresses(Boolean(user));
  const areasQuery = useDeliveryAreas(Boolean(user));
  const datesQuery = useAvailableDeliveryDates(Boolean(user));
  const createOrderMutation = useCreateOrder();
  const couponMutation = useValidateCoupon();
  const couponCartVersionRef = useRef<string | null>(null);
  const orderAttemptRef = useRef<{
    fingerprint: string;
    idempotencyKey: string;
  } | null>(null);
  const {
    control,
    register,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      addressId: "",
      deliveryDate: "",
      timeSlotId: "",
      note: "",
    },
  });
  const selectedAddressId = useWatch({ control, name: "addressId" });
  const selectedDate = useWatch({ control, name: "deliveryDate" });
  const selectedTimeSlotId = useWatch({ control, name: "timeSlotId" });
  const selectedAddress = addressesQuery.data?.find(
    (address) => address.id === selectedAddressId,
  );
  const feeQuery = useDeliveryFee(
    selectedAddress?.prefecture ?? "",
    selectedAddress?.city ?? "",
    Boolean(selectedAddress),
  );
  const slotsQuery = useDeliveryTimeSlots(selectedDate, Boolean(selectedDate));
  const selectedTimeSlot = slotsQuery.data?.find(
    (slot) => slot.timeSlot.id === selectedTimeSlotId,
  );
  const previewRequest = useMemo<CheckoutPreviewRequest | null>(() => {
    if (!selectedAddressId || !selectedDate || !selectedTimeSlot) {
      return null;
    }

    return {
      addressId: selectedAddressId,
      deliveryDate: selectedDate,
      deliveryTimeSlot: selectedTimeSlot.timeSlot.displayName,
    };
  }, [selectedAddressId, selectedDate, selectedTimeSlot]);
  const cartVersion = cartQuery.data?.updatedAt ?? null;
  const previewQuery = useCheckoutPreview(previewRequest, cartVersion);
  const appliedCouponCode = couponMutation.data?.coupon.code;

  useEffect(() => {
    if (!selectedAddressId && addressesQuery.data?.length) {
      const firstAddress = addressesQuery.data[0];
      const defaultAddress =
        addressesQuery.data.find((address) => address.isDefault) ?? firstAddress;

      if (defaultAddress) {
        setValue("addressId", defaultAddress.id, { shouldValidate: true });
      }
    }
  }, [addressesQuery.data, selectedAddressId, setValue]);

  useEffect(() => {
    if (
      appliedCouponCode &&
      cartVersion &&
      couponCartVersionRef.current !== cartVersion
    ) {
      couponCartVersionRef.current = cartVersion;
      couponMutation.mutate({ code: appliedCouponCode });
    }
  }, [appliedCouponCode, cartVersion, couponMutation]);

  const isInitialLoading =
    cartQuery.isPending ||
    addressesQuery.isPending ||
    areasQuery.isPending ||
    datesQuery.isPending;

  if (isInitialLoading) {
    return <CheckoutSkeleton />;
  }

  const initialError =
    cartQuery.error ?? addressesQuery.error ?? areasQuery.error ?? datesQuery.error;

  if (initialError) {
    return (
      <div>
        <Alert variant="error" title="チェックアウトを読み込めませんでした">
          {normalizeApiError(initialError).message}
        </Alert>
        <Button
          className="mt-5"
          onClick={() => {
            void cartQuery.refetch();
            void addressesQuery.refetch();
            void areasQuery.refetch();
            void datesQuery.refetch();
          }}
        >
          再試行
        </Button>
      </div>
    );
  }

  const cart = cartQuery.data;
  const addresses = addressesQuery.data;
  const areas = areasQuery.data;
  const dates = datesQuery.data;

  if (!cart || !addresses || !areas || !dates) {
    return <CheckoutSkeleton />;
  }

  if (!cart.items.length) {
    return (
      <EmptyState
        title="カートは空です"
        description="注文を作成するには、先に商品をカートへ追加してください。"
        action={<Button onClick={() => router.push("/products")}>商品を探す</Button>}
      />
    );
  }

  const hasUnavailableItems = cart.items.some((item) => !item.isAvailable);
  const hasPriceChanges = cart.items.some((item) => item.priceChanged);
  const previewError = previewQuery.error ? normalizeApiError(previewQuery.error) : null;
  const orderError = createOrderMutation.error
    ? normalizeApiError(createOrderMutation.error)
    : null;
  const couponError = couponMutation.error
    ? normalizeApiError(couponMutation.error)
    : null;
  const feeError = feeQuery.error ? normalizeApiError(feeQuery.error) : null;
  const datesError = datesQuery.error ? normalizeApiError(datesQuery.error) : null;
  const slotsError = slotsQuery.error ? normalizeApiError(slotsQuery.error) : null;
  const discountAmount = couponMutation.data?.discountAmount ?? 0;
  const isReadyToOrder = Boolean(
    selectedAddress &&
    selectedDate &&
    selectedTimeSlot &&
    feeQuery.data &&
    previewQuery.data?.canCheckout &&
    !couponMutation.isPending &&
    !hasUnavailableItems &&
    !hasPriceChanges,
  );

  const validateCouponForCart = async (code: string) => {
    couponCartVersionRef.current = cart.updatedAt;
    await couponMutation.mutateAsync({ code });
  };

  const placeOrder = async () => {
    const values = getValues();
    const request: CreateOrderRequest = {
      addressId: values.addressId,
      deliveryDate: values.deliveryDate,
      timeSlotId: values.timeSlotId,
      couponCode: couponMutation.data?.coupon.code,
      note: values.note.trim() || undefined,
    };
    const fingerprint = JSON.stringify(request);

    if (orderAttemptRef.current?.fingerprint !== fingerprint) {
      orderAttemptRef.current = {
        fingerprint,
        idempotencyKey: crypto.randomUUID(),
      };
    }

    const order = await createOrderMutation.mutateAsync({
      request,
      idempotencyKey: orderAttemptRef.current.idempotencyKey,
    });

    orderAttemptRef.current = null;

    router.push(`/checkout/success?orderId=${encodeURIComponent(order.id)}`);
  };

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-16">
      <div className="grid gap-10">
        {(hasUnavailableItems || hasPriceChanges) && (
          <Alert variant="warning" title="カート内容の確認が必要です">
            {hasUnavailableItems
              ? "購入できない商品があります。カートへ戻って内容を更新してください。"
              : "商品価格が変更されています。カートに戻って最新の価格をご確認ください。"}
          </Alert>
        )}

        <CheckoutAddressSection
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          error={errors.addressId?.message}
          onSelect={(addressId) => {
            setValue("addressId", addressId, { shouldValidate: true });
            setValue("deliveryDate", "");
            setValue("timeSlotId", "");
          }}
        />

        <CheckoutDeliverySection
          areas={areas}
          dates={dates}
          datesError={datesError?.message}
          fee={feeQuery.data}
          feeError={feeError?.message}
          isDatesLoading={datesQuery.isFetching}
          isFeeLoading={feeQuery.isFetching}
          isSlotsLoading={slotsQuery.isFetching}
          selectedDate={selectedDate}
          selectedTimeSlotId={selectedTimeSlotId}
          slots={slotsQuery.data ?? []}
          slotsError={slotsError?.message}
          validationErrors={{
            deliveryDate: errors.deliveryDate?.message,
            timeSlotId: errors.timeSlotId?.message,
          }}
          onDateChange={(date) => {
            setValue("deliveryDate", date, { shouldValidate: true });
            setValue("timeSlotId", "");
          }}
          onTimeSlotChange={(timeSlotId) => {
            setValue("timeSlotId", timeSlotId, { shouldValidate: true });
          }}
        />

        <CheckoutCouponSection
          isPending={couponMutation.isPending}
          validation={couponMutation.data}
          validationError={couponError?.message}
          onValidate={validateCouponForCart}
          onRemove={() => {
            couponCartVersionRef.current = null;
            couponMutation.reset();
          }}
        />

        <CheckoutNote
          registration={register("note")}
          error={errors.note?.message}
          disabled={createOrderMutation.isPending}
        />

        {previewQuery.isFetching ? (
          <Alert>ご注文内容を確認しています…</Alert>
        ) : previewError ? (
          <Alert variant="error" title="注文プレビューを確認できませんでした">
            {previewError.message}
          </Alert>
        ) : previewQuery.data?.warnings.length ? (
          <Alert variant="warning" title="ご確認ください">
            <ul className="list-disc pl-5">
              {previewQuery.data.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </Alert>
        ) : null}

        {orderError ? (
          <Alert variant="error" title="注文を作成できませんでした">
            {orderError.message}
          </Alert>
        ) : null}
      </div>

      <aside className="grid gap-6 lg:sticky lg:top-32">
        <CheckoutCartSummary cart={cart} />
        <CheckoutTotals
          subtotal={cart.totalPrice}
          deliveryFee={feeQuery.data?.deliveryFee}
          discountAmount={discountAmount}
        />
        <PlaceOrderButton
          disabled={!isReadyToOrder}
          isPending={createOrderMutation.isPending}
          validate={() => trigger()}
          onConfirm={placeOrder}
        />
        {!isReadyToOrder ? (
          <p className="text-muted-foreground text-center text-xs leading-6">
            必要な項目をすべて入力すると、ご注文を確定できます。
          </p>
        ) : null}
      </aside>
    </div>
  );
}
