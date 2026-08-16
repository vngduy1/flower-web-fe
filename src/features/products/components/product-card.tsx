import Link from "next/link";

import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";
import { WishlistButton } from "@/features/wishlist/components/wishlist-button";
import { formatYen } from "@/lib/format/currency";

import { CatalogImage } from "./catalog-image";
import type { Product, ProductImage } from "../types/product";

interface ProductCardProps {
  headingLevel?: 2 | 3;
  image?: ProductImage | null;
  product: Product;
}

export function ProductCard({
  headingLevel = 3,
  image,
  product,
}: ProductCardProps) {
  const hasSalePrice = product.salePrice !== null;
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article className="group min-w-0">
      <Link
        href={`/products/${product.slug}`}
        className="focus-visible:ring-brand block rounded-xl focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
      >
        {/* Product image */}
        <div className="bg-surface relative aspect-square overflow-hidden rounded-lg border border-brand/10">
          <CatalogImage
            src={image?.thumbnailUrl ?? image?.imageUrl ?? null}
            alt={image?.altText || product.name}
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          />

          {/* Badges */}
          {(product.isFeatured || hasSalePrice) && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {product.isFeatured ? (
                <span className="bg-surface/92 text-brand-dark border-brand/10 border px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] uppercase backdrop-blur-sm">
                  Featured
                </span>
              ) : null}

              {hasSalePrice ? (
                <span className="bg-brand-dark px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] text-white uppercase">
                  Sale
                </span>
              ) : null}
            </div>
          )}
        </div>

        {/* Product information */}
        <div className="pt-5">
          <p className="text-accent text-[9px] font-bold tracking-[0.16em] uppercase">
            {product.category.name}
          </p>

          <Heading className="text-brand-dark mt-2 truncate font-serif text-lg font-medium sm:text-xl">
            {product.name}
          </Heading>

          <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-foreground text-[15px] font-semibold">
              {formatYen(product.salePrice ?? product.basePrice)}
            </span>

            {hasSalePrice ? (
              <span className="text-muted-foreground text-xs line-through">
                {formatYen(product.basePrice)}
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      {/* Actions */}
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <AddToCartButton productId={product.id} compact />
        <WishlistButton productId={product.id} compact />
      </div>
    </article>
  );
}