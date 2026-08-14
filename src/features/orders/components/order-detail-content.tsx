"use client";

import Link from "next/link";

import { Alert, Button, EmptyState, Skeleton } from "@/components/ui";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { CatalogImage } from "@/features/products/components/catalog-image";
import { normalizeApiError } from "@/lib/api/errors";
import { formatYen } from "@/lib/format/currency";
import { formatDate, formatDateTime } from "@/lib/format/date";

import { CancelOrderDialog } from "./cancel-order-dialog";
import { OrderStatusBadge, PaymentStatusBadge } from "./order-status-badge";
import { OrderTimeline } from "./order-timeline";
import { useOrder } from "../hooks/use-order";

export function OrderDetailContent({ orderId }: { orderId: string }) {
  const { user } = useAuth();
  const orderQuery = useOrder(orderId, Boolean(user && orderId));

  if (orderQuery.isPending) {
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Skeleton className="h-[680px] rounded-3xl" />
        <Skeleton className="h-[420px] rounded-3xl" />
      </div>
    );
  }

  if (orderQuery.error) {
    const error = normalizeApiError(orderQuery.error);

    return (
      <EmptyState
        title="注文詳細を読み込めませんでした"
        description={error.message}
        code={error.statusCode ? String(error.statusCode) : "ERROR"}
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => void orderQuery.refetch()}>再試行</Button>
            <Link
              href="/account/orders"
              className="border-brand/25 text-brand-dark inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-semibold"
            >
              注文履歴へ
            </Link>
          </div>
        }
      />
    );
  }

  const order = orderQuery.data;
  const hasCancellableStatus = order.status === "PENDING" || order.status === "CONFIRMED";
  const canCancel = hasCancellableStatus && order.paymentStatus !== "PAID";

  return (
    <div>
      <Link
        href="/account/orders"
        className="text-brand-dark hover:text-brand mb-6 inline-flex text-sm font-semibold"
      >
        ← 注文履歴へ戻る
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="grid gap-6">
          <section className="bg-surface rounded-3xl border p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-accent text-xs font-bold tracking-[0.16em] uppercase">
                  Order detail
                </p>
                <h1 className="text-brand-dark mt-2 font-serif text-3xl font-semibold sm:text-4xl">
                  {order.orderNumber}
                </h1>
              </div>
              <div className="flex flex-wrap gap-2">
                <OrderStatusBadge status={order.status} />
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>
            </div>

            <div className="border-brand/10 mt-7 border-y py-6">
              <OrderTimeline order={order} />
            </div>

            <div className="mt-7 divide-y">
              {order.items.map((item) => (
                <article
                  key={item.id}
                  className="grid grid-cols-[72px_minmax(0,1fr)] gap-4 py-5 first:pt-0 sm:grid-cols-[88px_minmax(0,1fr)_auto]"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl border">
                    <CatalogImage
                      src={item.thumbnailUrl}
                      alt={item.productName}
                      sizes="88px"
                    />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold">{item.productName}</h2>
                    <p className="text-muted-foreground mt-1 text-xs">
                      商品コード {item.productCode}
                    </p>
                    <p className="text-muted-foreground mt-2 text-sm">
                      {formatYen(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                  <p className="col-start-2 font-semibold sm:col-start-auto">
                    {formatYen(item.subtotal)}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="bg-surface rounded-3xl border p-6 shadow-sm sm:p-8">
            <h2 className="text-brand-dark font-serif text-2xl font-semibold">
              お届け情報
            </h2>
            <dl className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground text-xs">配達日</dt>
                <dd className="mt-1 font-semibold">{formatDate(order.delivery.date)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">時間帯</dt>
                <dd className="mt-1 font-semibold">
                  {order.delivery.timeSlot ?? "指定なし"}
                </dd>
              </div>
            </dl>

            {order.deliveryAddress ? (
              <address className="text-muted-foreground border-brand/10 mt-6 border-t pt-6 text-sm leading-7 not-italic">
                <span className="text-foreground font-semibold">
                  {order.deliveryAddress.recipientName}
                </span>
                <span className="ml-3">{order.deliveryAddress.recipientPhone}</span>
                <br />〒{order.deliveryAddress.postalCode}
                <br />
                {order.deliveryAddress.prefecture}
                {order.deliveryAddress.city}
                {order.deliveryAddress.addressLine1}
                {order.deliveryAddress.addressLine2
                  ? ` ${order.deliveryAddress.addressLine2}`
                  : ""}
              </address>
            ) : (
              <Alert className="mt-6">配送先スナップショットはありません。</Alert>
            )}

            {order.note ? (
              <div className="border-brand/10 mt-6 border-t pt-6">
                <p className="text-muted-foreground text-xs">注文メモ</p>
                <p className="mt-2 text-sm leading-7 whitespace-pre-line">{order.note}</p>
              </div>
            ) : null}
          </section>
        </div>

        <aside className="grid gap-5 lg:sticky lg:top-6">
          <section className="bg-brand-dark rounded-3xl p-6 text-white shadow-xl sm:p-7">
            <h2 className="font-serif text-2xl">お支払い明細</h2>
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
              <div className="mt-5 text-xs leading-6 text-white/70">
                <p>クーポン {order.coupon.code}</p>
                {order.coupon.name ? <p>{order.coupon.name}</p> : null}
                <p>割引額 {formatYen(order.coupon.discountAmount)}</p>
              </div>
            ) : null}
          </section>

          <section className="bg-surface rounded-3xl border p-5 shadow-sm sm:p-6">
            <h2 className="text-brand-dark font-serif text-xl font-semibold">記録日時</h2>
            <dl className="text-muted-foreground mt-4 grid gap-3 text-xs">
              <div className="flex justify-between gap-4">
                <dt>注文日時</dt>
                <dd className="text-foreground text-right">
                  {formatDateTime(order.createdAt)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>最終更新</dt>
                <dd className="text-foreground text-right">
                  {formatDateTime(order.updatedAt)}
                </dd>
              </div>
            </dl>
          </section>

          {canCancel ? (
            <section className="rounded-3xl border border-red-100 bg-red-50/50 p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-red-900">注文のキャンセル</h2>
              <p className="mt-2 text-xs leading-6 text-red-900/70">
                受付中または確定済みの注文をキャンセルできます。
              </p>
              <CancelOrderDialog order={order} />
            </section>
          ) : null}

          {hasCancellableStatus && order.paymentStatus === "PAID" ? (
            <Alert variant="warning" title="支払い済みの注文はキャンセルできません">
              返金処理にはまだ対応していないため、支払い済みの注文はオンラインでキャンセルできません。
            </Alert>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
