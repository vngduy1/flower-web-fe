import { getOrderStatusLabel } from "@/features/orders/utils/order-labels";
import { formatDateTime } from "@/lib/format/date";

import type { AdminOrderStatusHistory } from "../types/admin-order";

export function OrderStatusHistory({
  histories,
}: {
  histories: AdminOrderStatusHistory[];
}) {
  return (
    <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-serif text-xl font-semibold">ステータス履歴</h2>
      {histories.length ? (
        <ol className="mt-5 grid gap-4">
          {histories.map((history) => (
            <li
              key={history.id}
              className="border-brand/15 before:bg-brand relative border-l-2 py-1 pl-5 before:absolute before:top-2 before:-left-1.75 before:size-3 before:rounded-full"
            >
              <p className="text-sm font-semibold">
                {getOrderStatusLabel(history.fromStatus)} →{" "}
                {getOrderStatusLabel(history.toStatus)}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                {formatDateTime(history.createdAt)} ·{" "}
                {history.changedBy ?? "操作者情報なし"}
              </p>
              {history.note ? (
                <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm">
                  {history.note}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-muted-foreground mt-4 text-sm">ステータス履歴はありません。</p>
      )}
    </section>
  );
}
