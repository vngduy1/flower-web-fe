import { cn } from "@/lib/utils/cn";
import { formatYen } from "@/lib/format/currency";
import { formatDateTime } from "@/lib/format/date";

import type { AdminOrderPayment, PaymentRecordStatus } from "../types/admin-order";
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_RECORD_STATUS_LABELS,
} from "../utils/admin-order";

const statusClasses: Record<PaymentRecordStatus, string> = {
  PENDING: "bg-blue-50 text-blue-800",
  PAID: "bg-emerald-50 text-emerald-800",
  FAILED: "bg-red-50 text-red-800",
  CANCELLED: "bg-slate-100 text-slate-700",
  REFUNDED: "bg-violet-50 text-violet-800",
};

export function OrderPaymentCard({ payments }: { payments: AdminOrderPayment[] }) {
  return (
    <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="font-serif text-xl font-semibold">支払い記録</h2>
      {payments.length ? (
        <div className="mt-4 grid gap-4">
          {payments.map((payment) => (
            <article key={payment.id} className="rounded-xl bg-slate-50 p-4 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{payment.paymentNumber}</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {PAYMENT_METHOD_LABELS[payment.paymentMethod]}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-semibold",
                    statusClasses[payment.status],
                  )}
                >
                  {PAYMENT_RECORD_STATUS_LABELS[payment.status]}
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <dt className="text-muted-foreground text-xs">金額</dt>
                  <dd>{formatYen(payment.amount)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">支払日時</dt>
                  <dd>{payment.paidAt ? formatDateTime(payment.paidAt) : "—"}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground mt-4 text-sm">
          支払い記録は返されていません。
        </p>
      )}
    </section>
  );
}
