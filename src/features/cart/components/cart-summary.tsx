import Link from "next/link";

import { formatYen } from "@/lib/format/currency";

import { ClearCartDialog } from "./clear-cart-dialog";
import type { Cart } from "../types/cart";

export function CartSummary({ cart }: { cart: Cart }) {
  const hasUnavailableItem = cart.items.some(
    (item) => !item.isAvailable,
  );

  return (
    <aside className="h-fit bg-brand-dark px-6 py-8 text-white sm:px-7 lg:sticky lg:top-32">
      <p className="text-[10px] font-bold tracking-[0.2em] text-white/55 uppercase">
        Order summary
      </p>

      <div className="mt-5 h-px w-10 bg-white/25" />

      <h2 className="mt-6 font-serif text-2xl font-medium">
        ご注文内容
      </h2>

      <dl className="mt-8 border-y border-white/15">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 py-4">
          <dt className="text-xs text-white/55">商品数量</dt>
          <dd className="text-sm font-semibold">
            {cart.totalQuantity}点
          </dd>
        </div>

        <div className="flex items-center justify-between gap-4 border-b border-white/10 py-4">
          <dt className="text-xs text-white/55">通貨</dt>
          <dd className="text-sm font-semibold">
            {cart.currency.code}
          </dd>
        </div>

        <div className="flex items-end justify-between gap-4 py-5">
          <dt className="text-xs text-white/55">
            小計
          </dt>

          <dd className="font-serif text-3xl font-medium">
            {formatYen(cart.totalPrice)}
          </dd>
        </div>
      </dl>

      <p className="mt-5 text-[11px] leading-6 text-white/55">
        送料、クーポン、配送日時はチェックアウト時に確定します。
      </p>

      {hasUnavailableItem ? (
        <p className="mt-5 border-l-2 border-amber-300/70 pl-3 text-xs leading-6 text-amber-100">
          購入できない商品があります。
          チェックアウト前に内容をご確認ください。
        </p>
      ) : null}

      <Link
        href="/checkout"
        aria-disabled={hasUnavailableItem}
        className={`mt-8 inline-flex min-h-12 w-full items-center justify-center px-6 text-sm font-semibold transition-colors ${
          hasUnavailableItem
            ? "pointer-events-none bg-white/15 text-white/50"
            : "bg-white text-brand-dark hover:bg-brand-soft"
        }`}
      >
        チェックアウトへ進む
      </Link>

      <div className="mt-4 flex justify-center [&_button]:text-white/55 [&_button:hover]:bg-transparent [&_button:hover]:text-white">
        <ClearCartDialog />
      </div>
    </aside>
  );
}