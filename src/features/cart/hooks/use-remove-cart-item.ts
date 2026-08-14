"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeCartItem } from "../api/cart.api";
import { cartKeys } from "../api/cart.queries";

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCartItem,
    onSettled: () => queryClient.invalidateQueries({ queryKey: cartKeys.current() }),
  });
}
