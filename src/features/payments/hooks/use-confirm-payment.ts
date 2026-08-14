"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { orderKeys } from "@/features/orders/api/orders.queries";

import { confirmPayment } from "../api/payments.api";
import { paymentKeys } from "../api/payments.queries";

export function useConfirmPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmPayment,
    onSuccess: async (payment) => {
      queryClient.setQueryData(paymentKeys.detail(payment.id), payment);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: orderKeys.all }),
        queryClient.invalidateQueries({
          queryKey: paymentKeys.detail(payment.id),
        }),
      ]);
    },
  });
}
