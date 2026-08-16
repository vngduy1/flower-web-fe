"use client";

import { Button } from "@/components/ui";
import { CatalogImage } from "@/features/products/components/catalog-image";
import { normalizeApiError } from "@/lib/api/errors";
import { formatYen } from "@/lib/format/currency";

import { CartQuantityControl } from "./cart-quantity-control";
import { useRemoveCartItem } from "../hooks/use-remove-cart-item";
import type { CartItem } from "../types/cart";

const UNMANAGED_STOCK_SENTINEL = Number.MAX_SAFE_INTEGER;

export function CartItemRow({ item }: { item: CartItem }) {
  const removeMutation = useRemoveCartItem();

  const removeError = removeMutation.error
    ? normalizeApiError(removeMutation.error)
    : null;

  const isAtReportedLimit =
    item.isAvailable &&
    item.availableQuantity !== UNMANAGED_STOCK_SENTINEL &&
    item.quantity === item.availableQuantity;

  return (
    <article className="grid gap-5 border-b border-brand/10 py-7 sm:grid-cols-[132px_1fr] sm:gap-7 sm:py-8">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg border border-brand/10 bg-surface">
        <CatalogImage
          src={item.thumbnailUrl}
          alt={item.productName}
          sizes="(min-width: 640px) 132px, 100vw"
        />
      </div>

      <div className="min-w-0">
        {/* Main information */}
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="min-w-0">
            <p className="text-[9px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
              Product No. {item.productCode}
            </p>

            <h2 className="mt-2 font-serif text-xl font-medium text-brand-dark sm:text-2xl">
              {item.productName}
            </h2>

            <p className="mt-3 text-sm text-muted-foreground">
              {formatYen(item.currentUnitPrice)}
              <span className="ml-1 text-xs">/ 点</span>
            </p>
          </div>

          <p className="font-serif text-xl font-medium text-brand-dark">
            {formatYen(item.subtotal)}
          </p>
        </div>

        {/* Price change */}
        {item.priceChanged ? (
          <p className="mt-4 border-l-2 border-accent/50 pl-3 text-xs leading-6 text-accent">
            追加時 {formatYen(item.storedUnitPrice)} から価格が変更されました。
          </p>
        ) : null}

        {/* Availability */}
        {!item.isAvailable ? (
          <p
            className="mt-4 border-l-2 border-red-500 pl-3 text-xs leading-6 text-red-700"
            role="alert"
          >
            この商品は現在の販売状況または在庫では購入できません。
            削除するか、数量を変更してください。
          </p>
        ) : null}

        {isAtReportedLimit ? (
          <p className="mt-4 border-l-2 border-amber-600/60 pl-3 text-xs leading-6 text-amber-800">
            現在追加できる在庫数量の上限です。
          </p>
        ) : null}

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <CartQuantityControl item={item} />

          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:bg-transparent hover:text-red-700"
            isLoading={removeMutation.isPending}
            onClick={() => removeMutation.mutate(item.id)}
            aria-label={`${item.productName}をカートから削除`}
          >
            削除
          </Button>
        </div>

        {removeError ? (
          <p className="mt-3 text-xs leading-5 text-red-700" role="alert">
            {removeError.message}
          </p>
        ) : null}
      </div>
    </article>
  );
}