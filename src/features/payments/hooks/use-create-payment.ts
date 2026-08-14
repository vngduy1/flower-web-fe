"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createPayment } from "../api/payments.api";
import { paymentKeys } from "../api/payments.queries";

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPayment,
    onSuccess: (payment) => {
      queryClient.setQueryData(paymentKeys.detail(payment.id), payment);
    },
  });
}
