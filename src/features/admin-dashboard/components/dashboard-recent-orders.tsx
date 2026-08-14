import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/features/orders/components/order-status-badge";
import { formatYen } from "@/lib/format/currency";
import { formatDateTime } from "@/lib/format/date";

import type { AdminDashboardRecentOrder } from "../types/dashboard";

export function DashboardRecentOrders({
  orders,
}: {
  orders: AdminDashboardRecentOrder[];
}) {
  return (
    <Card>
      <CardHeader>
        <p className="text-accent text-[10px] font-bold tracking-[0.14em] uppercase">
          Recent orders
        </p>
        <CardTitle className="mt-2">最近の注文</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length ? (
          <div className="overflow-x-auto rounded-2xl border bg-white">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-brand-soft/45 text-muted-foreground text-xs">
                <tr>
                  <th className="px-4 py-3 font-semibold">注文</th>
                  <th className="px-4 py-3 font-semibold">顧客</th>
                  <th className="px-4 py-3 font-semibold">商品数</th>
                  <th className="px-4 py-3 font-semibold">注文状況</th>
                  <th className="px-4 py-3 font-semibold">支払い</th>
                  <th className="px-4 py-3 text-right font-semibold">合計</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-4">
                      <p className="text-foreground font-semibold">{order.orderNumber}</p>
                      <p className="mt-1 text-xs">{formatDateTime(order.createdAt)}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-foreground font-medium">
                        {order.customer.fullName}
                      </p>
                      <p className="mt-1 text-xs">{order.customer.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      {order.totalQuantity.toLocaleString("ja-JP")}
                    </td>
                    <td className="px-4 py-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-4">
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </td>
                    <td className="text-foreground px-4 py-4 text-right font-semibold">
                      {formatYen(order.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-2xl border bg-white px-4 py-8 text-center text-sm">
            注文はまだありません。
          </p>
        )}
      </CardContent>
    </Card>
  );
}
