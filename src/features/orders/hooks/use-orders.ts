"use client";

import { useQuery } from "@tanstack/react-query";

import { ordersQueryOptions } from "../api/orders.queries";

export function useOrders(enabled = true) {
  return useQuery({ ...ordersQueryOptions(), enabled });
}
