"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCartItem } from "../api/cart.api";
import { cartKeys } from "../api/cart.queries";

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartItem,
    onSettled: () => queryClient.invalidateQueries({ queryKey: cartKeys.current() }),
  });
}
