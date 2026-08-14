"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addCartItem } from "../api/cart.api";
import { cartKeys } from "../api/cart.queries";

export function useAddCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCartItem,
    onSettled: () => queryClient.invalidateQueries({ queryKey: cartKeys.current() }),
  });
}
