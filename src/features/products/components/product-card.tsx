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

export function ProductCard({ headingLevel = 3, image, product }: ProductCardProps) {
  const hasSalePrice = product.salePrice !== null;
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article className="group min-w-0">
      <Link
        href={`/products/${product.slug}`}
        className="focus-visible:ring-brand block rounded-[1.7rem] focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
      >
        <div className="bg-surface relative aspect-square overflow-hidden rounded-[1.7rem] border shadow-[0_24px_70px_-48px_rgba(38,61,45,0.55)]">
          <CatalogImage
            src={image?.thumbnailUrl ?? image?.imageUrl ?? null}
            alt={image?.altText || product.name}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {product.isFeatured ? (
              <span className="bg-accent rounded-full px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-white uppercase shadow-sm">
                Featured
              </span>
            ) : null}
            {hasSalePrice ? (
              <span className="bg-brand-dark rounded-full px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-white uppercase shadow-sm">
                Sale
              </span>
            ) : null}
          </div>
        </div>
        <div className="px-1 pt-5">
          <p className="text-accent text-[10px] font-bold tracking-[0.14em] uppercase">
            {product.category.name}
          </p>
          <Heading className="text-brand-dark mt-2 truncate font-serif text-xl font-semibold">
            {product.name}
          </Heading>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-foreground text-base font-bold">
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
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <AddToCartButton productId={product.id} compact />
        <WishlistButton productId={product.id} compact />
      </div>
    </article>
  );
}
