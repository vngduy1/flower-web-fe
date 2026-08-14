"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeWishlistItem } from "../api/wishlist.api";
import { wishlistKeys } from "../api/wishlist.queries";

export function useRemoveWishlistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeWishlistItem,
    onSettled: () => queryClient.invalidateQueries({ queryKey: wishlistKeys.list() }),
  });
}
