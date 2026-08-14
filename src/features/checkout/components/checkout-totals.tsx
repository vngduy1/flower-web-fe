import { formatYen } from "@/lib/format/currency";

interface CheckoutTotalsProps {
  deliveryFee?: number;
  discountAmount: number;
  subtotal: number;
}

export function CheckoutTotals({
  deliveryFee,
  discountAmount,
  subtotal,
}: CheckoutTotalsProps) {
  const expectedTotal =
    deliveryFee === undefined
      ? null
      : Math.max(subtotal + deliveryFee - discountAmount, 0);

  return (
    <section className="bg-brand-dark rounded-3xl p-6 text-white shadow-xl sm:p-7">
      <p className="text-xs font-bold tracking-[0.16em] text-white/70 uppercase">
        Expected total
      </p>
      <h2 className="mt-3 font-serif text-2xl">お支払い予定額</h2>
      <dl className="mt-6 grid gap-4 border-y border-white/10 py-5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-white/65">商品小計</dt>
          <dd>{formatYen(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-white/65">配送料</dt>
          <dd>{deliveryFee === undefined ? "未確定" : formatYen(deliveryFee)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-white/65">クーポン割引</dt>
          <dd>{discountAmount ? `−${formatYen(discountAmount)}` : formatYen(0)}</dd>
        </div>
        <div className="flex items-end justify-between gap-4 pt-2">
          <dt className="text-white/65">予定合計</dt>
          <dd className="font-serif text-2xl font-semibold">
            {expectedTotal === null ? "—" : formatYen(expectedTotal)}
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-xs leading-6 text-white/70">
        配送料・クーポン・在庫・配送枠は注文作成トランザクションで再検証され、返された注文金額が最終確定額です。
      </p>
    </section>
  );
}
