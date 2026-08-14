import Link from "next/link";

import { formatYen } from "@/lib/format/currency";

import { ClearCartDialog } from "./clear-cart-dialog";
import type { Cart } from "../types/cart";

export function CartSummary({ cart }: { cart: Cart }) {
  const hasUnavailableItem = cart.items.some((item) => !item.isAvailable);

  return (
    <aside className="bg-brand-dark h-fit rounded-3xl p-6 text-white shadow-xl sm:p-7 lg:sticky lg:top-6">
      <p className="text-xs font-bold tracking-[0.16em] text-white/70 uppercase">
        Order summary
      </p>
      <h2 className="mt-3 font-serif text-2xl">ご注文内容</h2>

      <dl className="mt-7 grid gap-4 border-y border-white/10 py-5 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-white/65">商品数量</dt>
          <dd className="font-semibold">{cart.totalQuantity}点</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-white/65">通貨</dt>
          <dd className="font-semibold">{cart.currency.code}</dd>
        </div>
        <div className="flex items-end justify-between gap-4 pt-2">
          <dt className="text-white/65">小計</dt>
          <dd className="font-serif text-2xl font-semibold">
            {formatYen(cart.totalPrice)}
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-xs leading-6 text-white/70">
        送料、クーポン、配送日時は Phase 5 のチェックアウトで確定します。
      </p>

      {hasUnavailableItem ? (
        <p className="mt-5 rounded-xl bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-950">
          購入できない商品があります。チェックアウト前に内容をご確認ください。
        </p>
      ) : null}

      <Link
        href="/checkout"
        aria-disabled={hasUnavailableItem}
        className={`mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors ${
          hasUnavailableItem
            ? "pointer-events-none bg-white/20 text-white/70"
            : "text-brand-dark hover:bg-brand-soft bg-white"
        }`}
      >
        チェックアウトへ進む
      </Link>
      <div className="mt-3 flex justify-center [&_button]:text-white/70 [&_button:hover]:bg-white/10">
        <ClearCartDialog />
      </div>
    </aside>
  );
}
