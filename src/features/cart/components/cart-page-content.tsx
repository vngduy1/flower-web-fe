"use client";

import Link from "next/link";

import { Alert, Button, EmptyState } from "@/components/ui";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { normalizeApiError } from "@/lib/api/errors";

import { CartItemRow } from "./cart-item-row";
import { CartSkeleton } from "./cart-skeleton";
import { CartSummary } from "./cart-summary";
import { useCart } from "../hooks/use-cart";

export function CartPageContent() {
  const { user } = useAuth();
  const cartQuery = useCart(Boolean(user));

  if (cartQuery.isPending) {
    return <CartSkeleton />;
  }

  if (cartQuery.error) {
    const error = normalizeApiError(cartQuery.error);

    return (
      <div>
        <Alert variant="error" title="カートを読み込めませんでした">
          {error.message}
        </Alert>
        <Button className="mt-5" onClick={() => void cartQuery.refetch()}>
          もう一度試す
        </Button>
      </div>
    );
  }

  if (cartQuery.data.items.length === 0) {
    return (
      <EmptyState
        code="Your cart"
        title="カートは空です"
        description="季節の花から、お気に入りの一品を見つけてください。"
        action={
          <Link
            href="/products"
            className="bg-brand hover:bg-brand-dark inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-white"
          >
            商品を探す
          </Link>
        }
      />
    );
  }

  const hasUnavailableItem = cartQuery.data.items.some((item) => !item.isAvailable);

  return (
    <div>
      {hasUnavailableItem ? (
        <Alert className="mb-6" variant="warning" title="確認が必要な商品があります">
          販売状況または在庫が変わった商品があります。各商品の表示をご確認ください。
        </Alert>
      ) : null}
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-4">
          {cartQuery.data.items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>
        <CartSummary cart={cartQuery.data} />
      </div>
    </div>
  );
}
