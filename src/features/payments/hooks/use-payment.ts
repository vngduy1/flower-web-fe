"use client";

import { useQuery } from "@tanstack/react-query";

import { paymentQueryOptions } from "../api/payments.queries";

export function usePayment(paymentId: string, enabled = true) {
  return useQuery({ ...paymentQueryOptions(paymentId), enabled });
}
