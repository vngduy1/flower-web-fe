"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { couponKeys } from "@/features/coupons/api/coupons.queries";
import { notificationKeys } from "@/features/notifications/api/notifications.queries";
import { productKeys } from "@/features/products/api/products.queries";

import { cancelOrder } from "../api/orders.api";
import { orderKeys } from "../api/orders.queries";

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: async (order) => {
      queryClient.setQueryData(orderKeys.detail(order.id), order);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: orderKeys.list() }),
        queryClient.invalidateQueries({ queryKey: orderKeys.detail(order.id) }),
        queryClient.invalidateQueries({ queryKey: couponKeys.available() }),
        queryClient.invalidateQueries({ queryKey: productKeys.all }),
        queryClient.invalidateQueries({ queryKey: notificationKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() }),
      ]);
    },
  });
}
