"use client";

import Link from "next/link";

import { Button, EmptyState } from "@/components/ui";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { normalizeApiError } from "@/lib/api/errors";

import { WishlistGrid } from "./wishlist-grid";
import { WishlistSkeleton } from "./wishlist-skeleton";
import { useWishlist } from "../hooks/use-wishlist";

export function WishlistPageContent() {
  const { user } = useAuth();
  const wishlistQuery = useWishlist(Boolean(user));

  if (wishlistQuery.isPending) {
    return <WishlistSkeleton />;
  }

  if (wishlistQuery.error) {
    const error = normalizeApiError(wishlistQuery.error);

    return (
      <EmptyState
        title="お気に入りを読み込めませんでした"
        description={error.message}
        code={error.statusCode ? String(error.statusCode) : "ERROR"}
        action={<Button onClick={() => void wishlistQuery.refetch()}>再試行</Button>}
      />
    );
  }

  if (!wishlistQuery.data?.length) {
    return (
      <EmptyState
        title="お気に入りはまだありません"
        description="気になる商品を保存すると、ここからいつでも確認できます。"
        action={
          <Link
            href="/products"
            className="bg-brand hover:bg-brand-dark inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-white transition-colors"
          >
            商品を探す
          </Link>
        }
      />
    );
  }

  return <WishlistGrid items={wishlistQuery.data} />;
}
