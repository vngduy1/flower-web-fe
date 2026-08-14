"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { failPayment } from "../api/payments.api";
import { paymentKeys } from "../api/payments.queries";

export function useFailPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: failPayment,
    onSuccess: (payment) => {
      queryClient.setQueryData(paymentKeys.detail(payment.id), payment);
    },
  });
}
