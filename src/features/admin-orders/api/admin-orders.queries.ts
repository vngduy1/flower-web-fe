import { queryOptions } from "@tanstack/react-query";

import { getAdminOrder, getAdminOrders } from "./admin-orders.api";
import type { AdminOrderQuery } from "../types/admin-order";

export const adminOrderKeys = {
  all: ["admin-orders"] as const,
  lists: () => [...adminOrderKeys.all, "list"] as const,
  list: (query: AdminOrderQuery) => [...adminOrderKeys.lists(), query] as const,
  details: () => [...adminOrderKeys.all, "detail"] as const,
  detail: (id: string) => [...adminOrderKeys.details(), id] as const,
};

export const adminOrdersQueryOptions = (query: AdminOrderQuery) =>
  queryOptions({
    queryKey: adminOrderKeys.list(query),
    queryFn: () => getAdminOrders(query),
    staleTime: 30_000,
  });

export const adminOrderQueryOptions = (id: string) =>
  queryOptions({
    queryKey: adminOrderKeys.detail(id),
    queryFn: () => getAdminOrder(id),
    staleTime: 15_000,
  });
