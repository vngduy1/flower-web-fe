import { CatalogImage } from "@/features/products/components/catalog-image";
import type { Cart } from "@/features/cart/types/cart";
import { formatYen } from "@/lib/format/currency";

export function CheckoutCartSummary({ cart }: { cart: Cart }) {
  return (
    <section className="border-brand/15 border-t pt-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="home-eyebrow">Order items</p>

          <h2 className="text-brand-dark mt-4 font-serif text-xl font-medium">
            ご注文商品
          </h2>
        </div>

        <p className="text-muted-foreground text-xs">
          {cart.totalQuantity}点
        </p>
      </div>

      <div className="border-brand/10 mt-6 divide-y">
        {cart.items.map((item) => (
          <article
            key={item.id}
            className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-start gap-3 py-4 first:pt-0"
          >
            <div className="border-brand/10 bg-surface relative aspect-square overflow-hidden rounded-md border">
              <CatalogImage
                src={item.thumbnailUrl}
                alt={item.productName}
                sizes="56px"
              />
            </div>

            <div className="min-w-0">
              <h3 className="text-brand-dark truncate text-sm font-medium">
                {item.productName}
              </h3>

              <p className="text-muted-foreground mt-1 text-xs">
                {formatYen(item.currentUnitPrice)} × {item.quantity}
              </p>

              {!item.isAvailable ? (
                <p className="mt-1 text-xs text-red-700">
                  現在購入できません
                </p>
              ) : null}

              {item.priceChanged ? (
                <p className="text-accent mt-1 text-xs">
                  価格が変更されています
                </p>
              ) : null}
            </div>

            <p className="text-brand-dark whitespace-nowrap text-sm font-semibold">
              {formatYen(item.subtotal)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}