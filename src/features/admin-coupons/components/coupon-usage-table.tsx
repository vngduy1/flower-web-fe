import Link from "next/link";

import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { formatYen } from "@/lib/format/currency";
import { formatDateTime } from "@/lib/format/date";

import type { AdminCouponUsage } from "../types/admin-coupon";

function ReversalBadge({ usage }: { usage: AdminCouponUsage }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
        usage.isReversed
          ? "border-amber-200 bg-amber-50 text-amber-800"
          : "border-emerald-200 bg-emerald-50 text-emerald-800"
      }`}
    >
      {usage.isReversed ? "取消済み" : "有効な利用"}
    </span>
  );
}

export function CouponUsageTable({ usages }: { usages: AdminCouponUsage[] }) {
  return (
    <>
      <div className="mt-5 grid gap-3 lg:hidden">
        {usages.map((usage) => (
          <article
            key={usage.id}
            className="border-brand/10 rounded-2xl border bg-white p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-muted-foreground text-xs">利用ID {usage.id}</p>
                <p className="mt-1 font-semibold">
                  {usage.user?.fullName ?? "お客様情報なし"}
                </p>
                <p className="text-muted-foreground text-xs">
                  {usage.user?.email ?? "—"}
                </p>
              </div>
              <p className="font-semibold">{formatYen(usage.discountAmount)}</p>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <ReversalBadge usage={usage} />
              {usage.order ? <OrderStatusBadge status={usage.order.status} /> : null}
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs">注文</dt>
                <dd>
                  {usage.order ? (
                    <Link
                      href={`/admin/orders/${usage.order.id}`}
                      className="text-brand font-semibold hover:underline"
                    >
                      {usage.order.orderNumber}
                    </Link>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">利用日時</dt>
                <dd>{formatDateTime(usage.usedAt)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted-foreground text-xs">取消日時</dt>
                <dd>{usage.reversedAt ? formatDateTime(usage.reversedAt) : "—"}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="border-brand/10 mt-5 hidden overflow-x-auto rounded-2xl border lg:block">
        <table className="w-full min-w-250 text-left text-sm">
          <thead className="bg-brand-soft/35 text-muted-foreground text-xs">
            <tr>
              <th className="px-4 py-3 font-semibold">利用ID</th>
              <th className="px-4 py-3 font-semibold">お客様</th>
              <th className="px-4 py-3 font-semibold">注文</th>
              <th className="px-4 py-3 font-semibold">割引額</th>
              <th className="px-4 py-3 font-semibold">利用日時</th>
              <th className="px-4 py-3 font-semibold">取消状態</th>
              <th className="px-4 py-3 font-semibold">取消日時</th>
            </tr>
          </thead>
          <tbody className="divide-brand/10 divide-y">
            {usages.map((usage) => (
              <tr key={usage.id} className="align-top">
                <td className="px-4 py-4 text-xs">{usage.id}</td>
                <td className="px-4 py-4">
                  <p className="font-semibold">
                    {usage.user?.fullName ?? "お客様情報なし"}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {usage.user?.email ?? "—"}
                  </p>
                </td>
                <td className="px-4 py-4">
                  {usage.order ? (
                    <div className="grid gap-2">
                      <Link
                        href={`/admin/orders/${usage.order.id}`}
                        className="text-brand font-semibold hover:underline"
                      >
                        {usage.order.orderNumber}
                      </Link>
                      <OrderStatusBadge status={usage.order.status} />
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-4 font-semibold">
                  {formatYen(usage.discountAmount)}
                </td>
                <td className="px-4 py-4">{formatDateTime(usage.usedAt)}</td>
                <td className="px-4 py-4">
                  <ReversalBadge usage={usage} />
                </td>
                <td className="px-4 py-4">
                  {usage.reversedAt ? formatDateTime(usage.reversedAt) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
