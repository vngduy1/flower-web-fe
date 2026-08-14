import { formatDate } from "@/lib/format/date";

import type { AdminOrderAddress, AdminOrderDetail } from "../types/admin-order";

export function OrderDeliveryCard({
  address,
  delivery,
  fee,
}: {
  address: AdminOrderAddress | null;
  delivery: AdminOrderDetail["delivery"];
  fee: number;
}) {
  return (
    <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="font-serif text-xl font-semibold">配送情報</h2>
      <dl className="mt-4 grid gap-3 text-sm">
        <div>
          <dt className="text-muted-foreground">配送日</dt>
          <dd className="font-semibold">{formatDate(delivery.date)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">時間帯</dt>
          <dd>{delivery.timeSlot ?? "指定なし"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">配送料</dt>
          <dd>{fee.toLocaleString("ja-JP")}円</dd>
        </div>
        {address ? (
          <>
            <div>
              <dt className="text-muted-foreground">宛名・電話</dt>
              <dd>
                {address.recipientName} / {address.recipientPhone}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">配送先</dt>
              <dd>
                〒{address.postalCode}
                <br />
                {address.prefecture}
                {address.city}
                {address.addressLine1}
                {address.addressLine2 ? (
                  <>
                    <br />
                    {address.addressLine2}
                  </>
                ) : null}
              </dd>
            </div>
          </>
        ) : (
          <div>
            <dt className="text-muted-foreground">配送先</dt>
            <dd>住所スナップショットはありません。</dd>
          </div>
        )}
      </dl>
    </section>
  );
}
