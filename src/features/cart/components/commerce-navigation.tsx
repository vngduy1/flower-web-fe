"use client";

import Link from "next/link";

import { Skeleton } from "@/components/ui";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useWishlist } from "@/features/wishlist/hooks/use-wishlist";

import { useCart } from "../hooks/use-cart";

function formatCount(count: number | undefined): string {
  if (!count) {
    return "";
  }

  return count > 99 ? "99+" : String(count);
}

export function CommerceNavigation() {
  const { isLoading: isAuthLoading, user } = useAuth();
  const cartQuery = useCart(Boolean(user));
  const wishlistQuery = useWishlist(Boolean(user));

  if (isAuthLoading) {
    return (
      <div className="flex gap-2" aria-hidden="true">
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="size-10 rounded-full" />
      </div>
    );
  }

  const cartCount = user ? formatCount(cartQuery.data?.totalQuantity) : "";
  const wishlistCount = user ? formatCount(wishlistQuery.data?.length) : "";

  return (
    <nav className="flex items-center gap-1" aria-label="お買い物メニュー">
      <Link
        href="/account/wishlist"
        className="text-brand-dark hover:bg-brand-soft/55 relative grid size-10 place-items-center rounded-full text-lg transition-colors"
        aria-label={wishlistCount ? `お気に入り ${wishlistCount}件` : "お気に入り"}
      >
        <span aria-hidden="true">♡</span>
        <span
          className={`bg-accent absolute -top-0.5 -right-0.5 grid min-h-4 min-w-4 place-items-center rounded-full px-1 text-[9px] font-bold text-white ${wishlistCount ? "opacity-100" : "opacity-0"}`}
        >
          {wishlistCount}
        </span>
      </Link>
      <Link
        href="/cart"
        className="text-brand-dark hover:bg-brand-soft/55 relative grid size-10 place-items-center rounded-full text-base transition-colors"
        aria-label={cartCount ? `カート 商品${cartCount}点` : "カート"}
      >
        <span aria-hidden="true">袋</span>
        <span
          className={`bg-brand absolute -top-0.5 -right-0.5 grid min-h-4 min-w-4 place-items-center rounded-full px-1 text-[9px] font-bold text-white ${cartCount ? "opacity-100" : "opacity-0"}`}
        >
          {cartCount}
        </span>
      </Link>
    </nav>
  );
}
