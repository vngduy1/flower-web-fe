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
    <article className="bg-surface grid gap-5 rounded-3xl border p-5 shadow-sm sm:grid-cols-[140px_1fr] sm:p-6">
      <div className="relative aspect-square overflow-hidden rounded-2xl border">
        <CatalogImage
          src={item.thumbnailUrl}
          alt={item.productName}
          sizes="(min-width: 640px) 140px, 100vw"
        />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-muted-foreground text-[10px] font-bold tracking-[0.12em] uppercase">
              {item.productCode}
            </p>
            <h2 className="text-brand-dark mt-2 font-serif text-xl font-semibold">
              {item.productName}
            </h2>
          </div>
          <p className="text-brand-dark font-semibold">{formatYen(item.subtotal)}</p>
        </div>

        <div className="mt-3 flex flex-wrap items-baseline gap-3 text-sm">
          <span>{formatYen(item.currentUnitPrice)} / 点</span>
          {item.priceChanged ? (
            <span className="text-amber-700">
              追加時 {formatYen(item.storedUnitPrice)} から価格が変更されました
            </span>
          ) : null}
        </div>

        {!item.isAvailable ? (
          <p
            className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-xs leading-5 text-red-800"
            role="alert"
          >
            この商品は現在の販売状況または在庫では購入できません。削除するか、数量を変更してください。
          </p>
        ) : null}
        {isAtReportedLimit ? (
          <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
            現在追加できる在庫数量の上限です。
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
          <CartQuantityControl item={item} />
          <Button
            variant="ghost"
            size="sm"
            className="text-red-700 hover:bg-red-50"
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
