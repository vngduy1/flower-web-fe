"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Alert, Button, EmptyState, Skeleton } from "@/components/ui";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { PaymentPanel } from "@/features/payments/components/payment-panel";
import { CatalogImage } from "@/features/products/components/catalog-image";
import { normalizeApiError } from "@/lib/api/errors";
import { formatYen } from "@/lib/format/currency";

import { useOrder } from "../hooks/use-order";
import { getOrderPaymentStatusLabel, getOrderStatusLabel } from "../utils/order-labels";

export function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const orderId = searchParams.get("orderId") ?? "";
  const paymentId = searchParams.get("paymentId");
  const orderQuery = useOrder(orderId, Boolean(user && orderId));

  if (!orderId) {
    return (
      <EmptyState
        title="注文を特定できません"
        description="注文IDがありません。注文一覧から対象の注文をご確認ください。"
        action={
          <Link
            href="/account/orders"
            className="bg-brand hover:bg-brand-dark inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-white"
          >
            注文一覧へ
          </Link>
        }
      />
    );
  }

  if (orderQuery.isPending) {
    return (
      <div
        className="grid gap-6 lg:grid-cols-[1fr_360px]"
        aria-label="注文を読み込んでいます"
      >
        <Skeleton className="h-[520px] rounded-3xl" />
        <Skeleton className="h-80 rounded-3xl" />
      </div>
    );
  }

  if (orderQuery.error) {
    return (
      <div>
        <Alert variant="error" title="注文を読み込めませんでした">
          {normalizeApiError(orderQuery.error).message}
        </Alert>
        <Button className="mt-5" onClick={() => void orderQuery.refetch()}>
          再試行
        </Button>
      </div>
    );
  }

  const order = orderQuery.data;
  const changePaymentId = (nextPaymentId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextPaymentId) {
      params.set("paymentId", nextPaymentId);
    } else {
      params.delete("paymentId");
    }

    router.replace(`/checkout/success?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
      <div className="grid gap-6">
        <section className="bg-surface rounded-3xl border p-6 shadow-sm sm:p-8">
          <p className="text-accent text-xs font-bold tracking-[0.16em] uppercase">
            Order received
          </p>
          <h1 className="text-brand-dark mt-3 font-serif text-3xl font-semibold sm:text-4xl">
            ご注文ありがとうございます
          </h1>
          <p className="text-muted-foreground mt-4 text-sm leading-7">
            注文番号{" "}
            <span className="text-foreground font-semibold">{order.orderNumber}</span>
          </p>

          <dl className="mt-7 grid gap-4 border-y py-6 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">注文ステータス</dt>
              <dd className="mt-1 font-semibold">{getOrderStatusLabel(order.status)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">支払いステータス</dt>
              <dd className="mt-1 font-semibold">
                {getOrderPaymentStatusLabel(order.paymentStatus)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">配送日</dt>
              <dd className="mt-1 font-semibold">{order.delivery.date}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">配送時間帯</dt>
              <dd className="mt-1 font-semibold">
                {order.delivery.timeSlot ?? "未設定"}
              </dd>
            </div>
          </dl>

          <div className="mt-7 divide-y">
            {order.items.map((item) => (
              <article
                key={item.id}
                className="grid grid-cols-[72px_1fr_auto] gap-4 py-4 first:pt-0"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl border">
                  <CatalogImage
                    src={item.thumbnailUrl}
                    alt={item.productName}
                    sizes="72px"
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold">{item.productName}</h2>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {formatYen(item.unitPrice)} × {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold">{formatYen(item.subtotal)}</p>
              </article>
            ))}
          </div>
        </section>

        {order.deliveryAddress ? (
          <section className="bg-surface rounded-3xl border p-6 shadow-sm sm:p-8">
            <h2 className="text-brand-dark font-serif text-2xl font-semibold">配送先</h2>
            <address className="text-muted-foreground mt-4 text-sm leading-7 not-italic">
              {order.deliveryAddress.recipientName} /{" "}
              {order.deliveryAddress.recipientPhone}
              <br />〒{order.deliveryAddress.postalCode}
              <br />
              {order.deliveryAddress.prefecture}
              {order.deliveryAddress.city}
              {order.deliveryAddress.addressLine1}
              {order.deliveryAddress.addressLine2
                ? ` ${order.deliveryAddress.addressLine2}`
                : ""}
            </address>
          </section>
        ) : null}
      </div>

      <aside className="grid gap-6 lg:sticky lg:top-6">
        <section className="bg-brand-dark rounded-3xl p-6 text-white shadow-xl sm:p-7">
          <h2 className="font-serif text-2xl">確定金額</h2>
          <dl className="mt-6 grid gap-3 border-y border-white/10 py-5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-white/65">商品小計</dt>
              <dd>{formatYen(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/65">配送料</dt>
              <dd>{formatYen(order.deliveryFee)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/65">割引</dt>
              <dd>−{formatYen(order.discountAmount)}</dd>
            </div>
            <div className="flex items-end justify-between gap-4 pt-2">
              <dt className="text-white/65">合計</dt>
              <dd className="font-serif text-2xl font-semibold">
                {formatYen(order.totalAmount)}
              </dd>
            </div>
          </dl>
          {order.coupon ? (
            <p className="mt-4 text-xs text-white/65">
              適用クーポン: {order.coupon.code} — {order.coupon.name}
            </p>
          ) : null}
        </section>

        <PaymentPanel
          order={order}
          paymentId={paymentId}
          onPaymentIdChange={changePaymentId}
        />
      </aside>
    </div>
  );
}
