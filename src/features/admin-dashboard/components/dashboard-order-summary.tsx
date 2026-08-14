import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

import type { AdminDashboardSummary } from "../types/dashboard";

const orderRows = [
  ["pending", "受付・支払い待ち"],
  ["confirmed", "注文確定"],
  ["preparing", "準備中"],
  ["shipped", "発送済み"],
  ["delivered", "配達完了"],
  ["cancelled", "キャンセル済み"],
] as const;

export function DashboardOrderSummary({
  orders,
}: {
  orders: AdminDashboardSummary["orders"];
}) {
  return (
    <Card>
      <CardHeader>
        <p className="text-accent text-[10px] font-bold tracking-[0.14em] uppercase">
          Order summary
        </p>
        <CardTitle className="mt-2">注文状況</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3 sm:grid-cols-2">
          {orderRows.map(([key, label]) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-2xl bg-white px-4 py-3"
            >
              <dt>{label}</dt>
              <dd className="text-foreground font-semibold">
                {orders[key].toLocaleString("ja-JP")}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
