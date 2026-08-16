"use client";

import { normalizeApiError } from "@/lib/api/errors";

import { useUpdateCartItem } from "../hooks/use-update-cart-item";
import type { CartItem } from "../types/cart";

const UNMANAGED_STOCK_SENTINEL = Number.MAX_SAFE_INTEGER;

export function CartQuantityControl({ item }: { item: CartItem }) {
  const updateMutation = useUpdateCartItem();

  const error = updateMutation.error
    ? normalizeApiError(updateMutation.error)
    : null;

  const hasManagedStock =
    item.availableQuantity !== UNMANAGED_STOCK_SENTINEL;

  const cannotIncrease =
    updateMutation.isPending ||
    item.quantity >= 999 ||
    (hasManagedStock && item.quantity >= item.availableQuantity);

  const updateQuantity = (quantity: number) => {
    updateMutation.mutate({
      itemId: item.id,
      quantity,
    });
  };

  return (
    <div>
      <div className="inline-flex min-h-10 items-center border border-brand/15 bg-surface">
        <button
          type="button"
          className="grid size-10 place-items-center text-base text-brand-dark transition-colors hover:bg-brand-soft/40 disabled:cursor-not-allowed disabled:opacity-30"
          onClick={() => updateQuantity(item.quantity - 1)}
          disabled={item.quantity <= 1 || updateMutation.isPending}
          aria-label={`${item.productName}の数量を1点減らす`}
        >
          −
        </button>

        <span
          className="min-w-11 border-x border-brand/10 px-2 text-center text-sm font-semibold tabular-nums text-brand-dark"
          aria-live="polite"
        >
          {updateMutation.isPending ? "…" : item.quantity}
        </span>

        <button
          type="button"
          className="grid size-10 place-items-center text-base text-brand-dark transition-colors hover:bg-brand-soft/40 disabled:cursor-not-allowed disabled:opacity-30"
          onClick={() => updateQuantity(item.quantity + 1)}
          disabled={cannotIncrease}
          aria-label={`${item.productName}の数量を1点増やす`}
        >
          ＋
        </button>
      </div>

      {error ? (
        <p
          className="mt-2 max-w-xs text-xs leading-5 text-red-700"
          role="alert"
        >
          {error.message}
        </p>
      ) : null}
    </div>
  );
}