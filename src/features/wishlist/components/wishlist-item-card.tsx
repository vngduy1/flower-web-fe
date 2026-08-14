"use client";

import Link from "next/link";

import { Button } from "@/components/ui";
import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";
import { CatalogImage } from "@/features/products/components/catalog-image";
import { normalizeApiError } from "@/lib/api/errors";
import { formatYen } from "@/lib/format/currency";

import { useRemoveWishlistItem } from "../hooks/use-remove-wishlist-item";
import type { WishlistItem } from "../types/wishlist";

export function WishlistItemCard({ item }: { item: WishlistItem }) {
  const removeMutation = useRemoveWishlistItem();
  const { product } = item;
  const removeError = removeMutation.error
    ? normalizeApiError(removeMutation.error)
    : null;
  const hasSalePrice = product.salePrice !== null;

  return (
    <article className="bg-surface overflow-hidden rounded-3xl border shadow-sm">
      <Link
        href={`/products/${product.slug}`}
        className="focus-visible:ring-brand block focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
      >
        <div className="relative aspect-square overflow-hidden border-b">
          <CatalogImage
            src={product.thumbnailUrl}
            alt={product.name}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
          {!product.isAvailable ? (
            <span className="absolute top-4 left-4 rounded-full bg-red-800 px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-white uppercase">
              販売停止中
            </span>
          ) : null}
        </div>
        <div className="px-5 pt-5">
          <p className="text-muted-foreground text-[10px] font-bold tracking-[0.12em] uppercase">
            {product.productCode}
          </p>
          <h2 className="text-brand-dark mt-2 truncate font-serif text-xl font-semibold">
            {product.name}
          </h2>
          <div className="mt-3 flex flex-wrap items-baseline gap-3">
            <span className="font-bold">{formatYen(product.currentPrice)}</span>
            {hasSalePrice ? (
              <span className="text-muted-foreground text-xs line-through">
                {formatYen(product.basePrice)}
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      <div className="grid gap-3 p-5 sm:grid-cols-2">
        <AddToCartButton productId={product.id} compact disabled={!product.isAvailable} />
        <Button
          variant="ghost"
          size="sm"
          className="text-red-700 hover:bg-red-50"
          isLoading={removeMutation.isPending}
          onClick={() => removeMutation.mutate(product.id)}
          aria-label={`${product.name}をお気に入りから削除`}
        >
          削除
        </Button>
        {removeError ? (
          <p className="text-xs leading-5 text-red-700 sm:col-span-2" role="alert">
            {removeError.message}
          </p>
        ) : null}
      </div>
    </article>
  );
}
