import { CatalogImage } from "@/features/products/components/catalog-image";
import type { Cart } from "@/features/cart/types/cart";
import { formatYen } from "@/lib/format/currency";

export function CheckoutCartSummary({ cart }: { cart: Cart }) {
  return (
    <section className="bg-surface rounded-3xl border p-5 shadow-sm sm:p-7">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-accent text-xs font-bold tracking-[0.15em] uppercase">
            Cart
          </p>
          <h2 className="text-brand-dark mt-2 font-serif text-2xl font-semibold">
            ご注文商品
          </h2>
        </div>
        <p className="text-muted-foreground text-sm">{cart.totalQuantity}点</p>
      </div>
      <div className="mt-6 divide-y">
        {cart.items.map((item) => (
          <article
            key={item.id}
            className="grid grid-cols-[64px_1fr_auto] gap-3 py-4 first:pt-0"
          >
            <div className="relative aspect-square overflow-hidden rounded-xl border">
              <CatalogImage src={item.thumbnailUrl} alt={item.productName} sizes="64px" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold">{item.productName}</h3>
              <p className="text-muted-foreground mt-1 text-xs">
                {formatYen(item.currentUnitPrice)} × {item.quantity}
              </p>
              {!item.isAvailable ? (
                <p className="mt-1 text-xs text-red-700">現在購入できません</p>
              ) : null}
              {item.priceChanged ? (
                <p className="mt-1 text-xs text-amber-700">価格が変更されています</p>
              ) : null}
            </div>
            <p className="text-sm font-semibold">{formatYen(item.subtotal)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
