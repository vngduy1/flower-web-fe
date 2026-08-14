"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cartKeys } from "@/features/cart/api/cart.queries";
import { couponKeys } from "@/features/coupons/api/coupons.queries";

import { createOrder } from "../api/orders.api";
import { orderKeys } from "../api/orders.queries";

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: async (order) => {
      queryClient.setQueryData(orderKeys.detail(order.id), order);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: cartKeys.current() }),
        queryClient.invalidateQueries({ queryKey: couponKeys.available() }),
        queryClient.invalidateQueries({ queryKey: orderKeys.list() }),
      ]);
    },
  });
}
