"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { getLoginRoute } from "@/features/auth/utils/auth-routing";
import { normalizeApiError } from "@/lib/api/errors";
import { cn } from "@/lib/utils/cn";

import { useAddCartItem } from "../hooks/use-add-cart-item";

interface AddToCartButtonProps {
  className?: string;
  compact?: boolean;
  disabled?: boolean;
  productId: string;
  quantity?: number;
}

interface Feedback {
  message: string;
  type: "success" | "error";
}

function getCurrentReturnTo(): string {
  return `${window.location.pathname}${window.location.search}`;
}

export function AddToCartButton({
  className,
  compact = false,
  disabled = false,
  productId,
  quantity = 1,
}: AddToCartButtonProps) {
  const router = useRouter();
  const { isLoading: isAuthLoading, user } = useAuth();
  const addItemMutation = useAddCartItem();
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const handleAdd = async () => {
    setFeedback(null);

    if (!user) {
      router.push(getLoginRoute(getCurrentReturnTo()));
      return;
    }

    try {
      await addItemMutation.mutateAsync({ productId, quantity });
      setFeedback({ message: "カートに追加しました。", type: "success" });
    } catch (error) {
      setFeedback({ message: normalizeApiError(error).message, type: "error" });
    }
  };

  return (
    <div className={cn("min-w-0", className)}>
      <Button
        type="button"
        size={compact ? "sm" : "lg"}
        className="w-full"
        disabled={disabled || isAuthLoading}
        isLoading={addItemMutation.isPending}
        onClick={() => void handleAdd()}
      >
        {disabled ? "現在追加できません" : "カートに追加"}
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
