"use client";

import { useQuery } from "@tanstack/react-query";

import { orderQueryOptions } from "../api/orders.queries";

export function useOrder(orderId: string, enabled = true) {
  return useQuery({ ...orderQueryOptions(orderId), enabled });
}
