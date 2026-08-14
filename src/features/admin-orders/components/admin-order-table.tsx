import Link from "next/link";

import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/features/orders/components/order-status-badge";
import { formatYen } from "@/lib/format/currency";
import { formatDate, formatDateTime } from "@/lib/format/date";

import type { AdminOrderSummary } from "../types/admin-order";

export function AdminOrderTable({ orders }: { orders: AdminOrderSummary[] }) {
  return (
    <>
      <div className="mt-6 grid gap-3 lg:hidden">
        {orders.map((order) => (
          <article
            key={order.id}
            className="border-brand/10 rounded-2xl border bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="text-brand font-semibold hover:underline"
                >
                  {order.orderNumber}
                </Link>
                <p className="mt-1 text-sm font-semibold">{order.customer.fullName}</p>
                <p className="text-muted-foreground text-xs">{order.customer.email}</p>
              </div>
              <p className="text-lg font-semibold">{formatYen(order.totalAmount)}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <OrderStatusBadge status={order.status} />
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs">商品数量</dt>
                <dd>{order.totalQuantity}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">配送予定</dt>
                <dd>
                  {formatDate(order.deliveryDate)}{" "}
                  {order.deliveryTimeSlot ?? "時間指定なし"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">注文日時</dt>
                <dd>{formatDateTime(order.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">更新日時</dt>
                <dd>{formatDateTime(order.updatedAt)}</dd>
              </div>
            </dl>
            <Link
              href={`/admin/orders/${order.id}`}
              className="text-brand mt-4 inline-block text-sm font-semibold"
            >
              詳細を見る →
            </Link>
          </article>
        ))}
      </div>
      <div className="border-brand/10 mt-6 hidden overflow-hidden rounded-2xl border bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-left text-sm">
            <thead className="bg-brand-soft/35 text-xs">
              <tr>
                <th className="p-4">注文</th>
                <th className="p-4">顧客</th>
                <th className="p-4">状態</th>
                <th className="p-4">支払い</th>
                <th className="p-4">数量</th>
                <th className="p-4">合計</th>
                <th className="p-4">配送予定</th>
                <th className="p-4">注文・更新日時</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-brand/10 border-t">
                  <td className="p-4 font-semibold">{order.orderNumber}</td>
                  <td className="p-4">
                    <p className="font-semibold">{order.customer.fullName}</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {order.customer.email}
                    </p>
                  </td>
                  <td className="p-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="p-4">
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </td>
                  <td className="p-4">{order.totalQuantity}</td>
                  <td className="p-4">
                    <p className="font-semibold">{formatYen(order.totalAmount)}</p>
                    <p className="text-muted-foreground text-xs">{order.currency}</p>
                  </td>
                  <td className="p-4">
                    <p>{formatDate(order.deliveryDate)}</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {order.deliveryTimeSlot ?? "時間指定なし"}
                    </p>
                  </td>
                  <td className="p-4 text-xs">
                    <p>注文 {formatDateTime(order.createdAt)}</p>
                    <p className="text-muted-foreground mt-1">
                      更新 {formatDateTime(order.updatedAt)}
                    </p>
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-brand font-semibold hover:underline"
                    >
                      詳細
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
