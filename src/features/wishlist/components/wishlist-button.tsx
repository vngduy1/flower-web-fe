"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { getLoginRoute } from "@/features/auth/utils/auth-routing";
import { normalizeApiError } from "@/lib/api/errors";
import { cn } from "@/lib/utils/cn";

import { useAddWishlistItem } from "../hooks/use-add-wishlist-item";
import { useRemoveWishlistItem } from "../hooks/use-remove-wishlist-item";
import { useWishlist } from "../hooks/use-wishlist";

interface WishlistButtonProps {
  className?: string;
  compact?: boolean;
  productId: string;
}

interface Feedback {
  message: string;
  type: "success" | "error";
}

function getCurrentReturnTo(): string {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

export function WishlistButton({
  className,
  compact = false,
  productId,
}: WishlistButtonProps) {
  const router = useRouter();
  const { isLoading: isAuthLoading, user } = useAuth();
  const wishlistQuery = useWishlist(Boolean(user));
  const addMutation = useAddWishlistItem();
  const removeMutation = useRemoveWishlistItem();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const isWishlisted = Boolean(
    wishlistQuery.data?.some((item) => item.product.id === productId),
  );
  const isPending = addMutation.isPending || removeMutation.isPending;

  const handleToggle = async () => {
    setFeedback(null);

    if (!user) {
      router.push(getLoginRoute(getCurrentReturnTo()));
      return;
    }

    if (wishlistQuery.error) {
      const result = await wishlistQuery.refetch();

      if (result.error) {
        setFeedback({
          message: normalizeApiError(result.error).message,
          type: "error",
        });
      }

      return;
    }

    try {
      if (isWishlisted) {
        await removeMutation.mutateAsync(productId);
        setFeedback({ message: "お気に入りから削除しました。", type: "success" });
      } else {
        await addMutation.mutateAsync(productId);
        setFeedback({ message: "お気に入りに追加しました。", type: "success" });
      }
    } catch (error) {
      setFeedback({ message: normalizeApiError(error).message, type: "error" });
    }
  };

  const label = isWishlisted ? "お気に入りから削除" : "お気に入りに追加";

  return (
    <div className={cn("min-w-0", className)}>
      <Button
        type="button"
        size={compact ? "sm" : "lg"}
        variant="secondary"
        className="w-full"
        disabled={isAuthLoading || (Boolean(user) && wishlistQuery.isPending)}
        isLoading={isPending}
        onClick={() => void handleToggle()}
        aria-label={label}
        aria-pressed={isWishlisted}
      >
        <span aria-hidden="true">{isWishlisted ? "♥" : "♡"}</span>
        {compact ? "お気に入り" : label}
      </Button>
      {feedback ? (
        <p
          className={cn(
            "mt-2 text-xs leading-5",
            feedback.type === "success" ? "text-brand" : "text-red-700",
          )}
          role={feedback.type === "error" ? "alert" : "status"}
        >
          {feedback.message}
        </p>
      ) : null}
    </div>
  );
}
