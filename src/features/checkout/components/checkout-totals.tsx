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
    <section className="bg-brand-dark px-6 py-8 text-white sm:px-7">
      <p className="text-[10px] font-bold tracking-[0.2em] text-white/55 uppercase">
        Order total
      </p>

      <div className="mt-5 h-px w-10 bg-white/25" />

      <h2 className="mt-6 font-serif text-2xl font-medium">
        お支払い予定額
      </h2>

      <dl className="mt-7 border-y border-white/15">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 py-4">
          <dt className="text-xs text-white/55">商品小計</dt>
          <dd className="text-sm font-medium">
            {formatYen(subtotal)}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-4 border-b border-white/10 py-4">
          <dt className="text-xs text-white/55">配送料</dt>
          <dd className="text-sm font-medium">
            {deliveryFee === undefined
              ? "未確定"
              : formatYen(deliveryFee)}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-4 border-b border-white/10 py-4">
          <dt className="text-xs text-white/55">
            クーポン割引
          </dt>

          <dd className="text-sm font-medium">
            {discountAmount
              ? `−${formatYen(discountAmount)}`
              : formatYen(0)}
          </dd>
        </div>

        <div className="flex items-end justify-between gap-4 py-5">
          <dt className="text-xs text-white/55">
            予定合計
          </dt>

          <dd className="font-serif text-3xl font-medium">
            {expectedTotal === null
              ? "—"
              : formatYen(expectedTotal)}
          </dd>
        </div>
      </dl>

      <p className="mt-5 text-[11px] leading-6 text-white/55">
        ご注文確定時に、在庫・配送料・クーポン・配送枠をあらためて確認します。
      </p>
    </section>
  );
}