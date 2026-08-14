import Link from "next/link";

import { formatYen } from "@/lib/format/currency";
import { formatDate, formatDateTime } from "@/lib/format/date";

import { OrderStatusBadge, PaymentStatusBadge } from "./order-status-badge";
import type { OrderListItem } from "../types/order";

export function OrderCard({ order }: { order: OrderListItem }) {
  return (
    <article className="bg-surface rounded-3xl border p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-xs">注文番号</p>
          <h2 className="text-brand-dark mt-1 font-serif text-xl font-semibold">
            {order.orderNumber}
          </h2>
          <p className="text-muted-foreground mt-2 text-xs">
            {formatDateTime(order.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <dl className="border-brand/10 mt-5 grid gap-4 border-y py-5 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-muted-foreground text-xs">商品</dt>
          <dd className="mt-1 font-semibold">{order.items.length}件</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs">配達予定日</dt>
          <dd className="mt-1 font-semibold">{formatDate(order.delivery.date)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs">合計</dt>
          <dd className="mt-1 font-semibold">{formatYen(order.totalAmount)}</dd>
        </div>
      </dl>

      <div className="mt-5 flex justify-end">
        <Link
          href={`/account/orders/${order.id}`}
          className="border-brand/25 text-brand-dark hover:bg-brand-soft/45 inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-semibold transition-colors"
        >
          注文詳細を見る
        </Link>
      </div>
    </article>
  );
}
