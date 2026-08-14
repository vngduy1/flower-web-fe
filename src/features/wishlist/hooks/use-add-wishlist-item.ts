"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addWishlistItem } from "../api/wishlist.api";
import { wishlistKeys } from "../api/wishlist.queries";

export function useAddWishlistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addWishlistItem,
    onSettled: () => queryClient.invalidateQueries({ queryKey: wishlistKeys.list() }),
  });
}
