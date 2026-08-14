"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { clearCart } from "../api/cart.api";
import { cartKeys } from "../api/cart.queries";

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSettled: () => queryClient.invalidateQueries({ queryKey: cartKeys.current() }),
  });
}
