"use client";

import Link from "next/link";

import { Alert, Button } from "@/components/ui";
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
      <div className="max-w-2xl">
        <Alert variant="error" title="カートを読み込めませんでした">
          {error.message}
        </Alert>

        <Button
          className="mt-5"
          onClick={() => void cartQuery.refetch()}
        >
          もう一度試す
        </Button>
      </div>
    );
  }

  if (cartQuery.data.items.length === 0) {
    return (
      <div className="border-y border-brand/15 py-16 text-center sm:py-20">
        <p className="home-eyebrow">Your cart</p>

        <h2 className="mt-6 font-serif text-3xl text-brand-dark sm:text-4xl">
          カートは空です
        </h2>

        <p className="mx-auto mt-5 max-w-md text-sm leading-8 text-muted-foreground">
          季節の花から、お気に入りの一品を見つけてください。
        </p>

        <Link
          href="/products"
          className="mt-8 inline-flex min-h-11 items-center bg-brand-dark px-7 text-sm font-semibold text-white transition-colors hover:bg-brand"
        >
          商品を探す
        </Link>
      </div>
    );
  }

  const hasUnavailableItem = cartQuery.data.items.some(
    (item) => !item.isAvailable,
  );

  return (
    <div>
      {hasUnavailableItem ? (
        <Alert
          className="mb-8"
          variant="warning"
          title="確認が必要な商品があります"
        >
          販売状況または在庫が変わった商品があります。
          各商品の表示をご確認ください。
        </Alert>
      ) : null}

      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
        <div className="border-t border-brand/15">
          {cartQuery.data.items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
            />
          ))}
        </div>

        <CartSummary cart={cartQuery.data} />
      </div>
    </div>
  );
}