"use client";

import Link from "next/link";

import { Button, EmptyState, Skeleton } from "@/components/ui";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/features/orders/components/order-status-badge";
import { normalizeApiError } from "@/lib/api";
import { formatYen } from "@/lib/format/currency";
import { formatDateTime } from "@/lib/format/date";

import { useAdminOrder } from "../hooks/use-admin-orders";
import { AdminOrderStatusDialog } from "./admin-order-status-dialog";
import { OrderCouponCard } from "./order-coupon-card";
import { OrderCustomerCard } from "./order-customer-card";
import { OrderDeliveryCard } from "./order-delivery-card";
import { OrderItemsTable } from "./order-items-table";
import { OrderPaymentCard } from "./order-payment-card";
import { OrderStatusHistory } from "./order-status-history";

export function AdminOrderDetail({ id }: { id: string }) {
  const order = useAdminOrder(id);
  if (order.isPending)
    return (
      <div className="grid gap-5">
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  if (order.error || !order.data)
    return (
      <EmptyState
        title="注文を読み込めませんでした"
        description={normalizeApiError(order.error).message}
        action={<Button onClick={() => void order.refetch()}>再試行</Button>}
      />
    );

  const data = order.data;
  const timestamps = [
    ["確認日時", data.timestamps.confirmedAt],
    ["準備開始", data.timestamps.preparingAt],
    ["発送日時", data.timestamps.shippedAt],
    ["配達完了", data.timestamps.deliveredAt],
    ["キャンセル日時", data.timestamps.cancelledAt],
    ["在庫復元日時", data.timestamps.inventoryRestoredAt],
  ] as const;

  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/admin/orders" className="text-brand text-sm font-semibold">
        ← 注文一覧
      </Link>
      <div className="mt-5 flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-muted-foreground text-xs">注文ID: {data.id}</p>
          <h1 className="text-brand-dark mt-2 font-serif text-3xl font-semibold">
            {data.orderNumber}
          </h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <OrderStatusBadge status={data.status} />
            <PaymentStatusBadge status={data.paymentStatus} />
          </div>
        </div>
        <AdminOrderStatusDialog order={data} />
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-2">
        <OrderCustomerCard customer={data.user} />
        <OrderDeliveryCard
          address={data.deliveryAddress}
          delivery={data.delivery}
          fee={data.deliveryFee}
        />
      </div>
      <div className="mt-6">
        <OrderItemsTable items={data.items} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid content-start gap-6">
          <OrderPaymentCard payments={data.payments} />
          {data.coupon ? <OrderCouponCard coupon={data.coupon} /> : null}
          <OrderStatusHistory histories={data.statusHistories} />
        </div>
        <aside className="grid content-start gap-6">
          <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-serif text-xl font-semibold">金額</h2>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">商品小計</dt>
                <dd>{formatYen(data.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">配送料</dt>
                <dd>{formatYen(data.deliveryFee)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">割引</dt>
                <dd>-{formatYen(data.discountAmount)}</dd>
              </div>
              <div className="border-brand/10 flex justify-between border-t pt-3 text-base font-semibold">
                <dt>合計</dt>
                <dd>{formatYen(data.totalAmount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">通貨</dt>
                <dd>{data.currency}</dd>
              </div>
            </dl>
          </section>
          <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-serif text-xl font-semibold">注文メモ</h2>
            <p className="text-muted-foreground mt-4 text-sm whitespace-pre-wrap">
              {data.note ?? "メモはありません。"}
            </p>
          </section>
          <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-serif text-xl font-semibold">日時</h2>
            <dl className="mt-4 grid gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">注文日時</dt>
                <dd>{formatDateTime(data.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">更新日時</dt>
                <dd>{formatDateTime(data.updatedAt)}</dd>
              </div>
              {timestamps
                .filter((entry) => entry[1])
                .map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd>{formatDateTime(value!)}</dd>
                  </div>
                ))}
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
