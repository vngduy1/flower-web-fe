"use client";

import { normalizeApiError } from "@/lib/api/errors";

import { useUpdateCartItem } from "../hooks/use-update-cart-item";
import type { CartItem } from "../types/cart";

export function CartQuantityControl({ item }: { item: CartItem }) {
  const updateMutation = useUpdateCartItem();
  const error = updateMutation.error ? normalizeApiError(updateMutation.error) : null;

  const updateQuantity = (quantity: number) => {
    updateMutation.mutate({ itemId: item.id, quantity });
  };

  return (
    <div>
      <div className="border-brand/15 inline-flex items-center rounded-full border bg-white">
        <button
          type="button"
          className="hover:bg-brand-soft/55 grid size-10 place-items-center rounded-full text-lg transition-colors disabled:cursor-not-allowed disabled:opacity-35"
          onClick={() => updateQuantity(item.quantity - 1)}
          disabled={item.quantity <= 1 || updateMutation.isPending}
          aria-label={`${item.productName}の数量を1点減らす`}
        >
          −
        </button>
        <span
          className="min-w-10 text-center text-sm font-semibold tabular-nums"
          aria-live="polite"
        >
          {updateMutation.isPending ? "…" : item.quantity}
        </span>
        <button
          type="button"
          className="hover:bg-brand-soft/55 grid size-10 place-items-center rounded-full text-lg transition-colors disabled:cursor-not-allowed disabled:opacity-35"
          onClick={() => updateQuantity(item.quantity + 1)}
          disabled={item.quantity >= 999 || updateMutation.isPending}
          aria-label={`${item.productName}の数量を1点増やす`}
        >
          ＋
        </button>
      </div>
      {error ? (
        <p className="mt-2 max-w-xs text-xs leading-5 text-red-700" role="alert">
          {error.message}
        </p>
      ) : null}
    </div>
  );
}
