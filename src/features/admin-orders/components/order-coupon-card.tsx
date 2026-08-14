import { formatYen } from "@/lib/format/currency";

import type { AdminOrderDetail } from "../types/admin-order";

export function OrderCouponCard({
  coupon,
}: {
  coupon: NonNullable<AdminOrderDetail["coupon"]>;
}) {
  return (
    <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="font-serif text-xl font-semibold">クーポンスナップショット</h2>
      <dl className="mt-4 grid gap-3 text-sm">
        <div>
          <dt className="text-muted-foreground">コード</dt>
          <dd className="font-semibold">{coupon.code}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">名称</dt>
          <dd>{coupon.name ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">割引額</dt>
          <dd>{formatYen(coupon.discountAmount)}</dd>
        </div>
      </dl>
    </section>
  );
}
