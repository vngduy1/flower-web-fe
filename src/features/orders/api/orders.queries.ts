import { queryOptions } from "@tanstack/react-query";

import { getOrder, getOrders } from "./orders.api";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: () => [...orderKeys.lists()] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (orderId: string) => [...orderKeys.all, "detail", orderId] as const,
};

export function ordersQueryOptions() {
  return queryOptions({
    queryKey: orderKeys.list(),
    queryFn: getOrders,
    staleTime: 15_000,
  });
}

export function orderQueryOptions(orderId: string) {
  return queryOptions({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => getOrder(orderId),
    staleTime: 15_000,
  });
}
