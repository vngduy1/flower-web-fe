import { queryOptions } from "@tanstack/react-query";

import { getInventories, getInventory, getInventoryHistory } from "./admin-inventory.api";
import type { InventoryHistoryQuery, InventoryQuery } from "../types/inventory";

export const inventoryKeys = {
  all: ["admin-inventories"] as const,
  lists: () => [...inventoryKeys.all, "list"] as const,
  list: (query: InventoryQuery) => [...inventoryKeys.lists(), query] as const,
  details: () => [...inventoryKeys.all, "detail"] as const,
  detail: (productId: string) => [...inventoryKeys.details(), productId] as const,
  histories: (productId: string) =>
    [...inventoryKeys.detail(productId), "history"] as const,
  history: (productId: string, query: InventoryHistoryQuery) =>
    [...inventoryKeys.histories(productId), query] as const,
};

export const inventoriesQueryOptions = (query: InventoryQuery) =>
  queryOptions({
    queryKey: inventoryKeys.list(query),
    queryFn: () => getInventories(query),
    staleTime: 30_000,
  });

export const inventoryQueryOptions = (productId: string) =>
  queryOptions({
    queryKey: inventoryKeys.detail(productId),
    queryFn: () => getInventory(productId),
    staleTime: 30_000,
  });

export const inventoryHistoryQueryOptions = (
  productId: string,
  query: InventoryHistoryQuery,
) =>
  queryOptions({
    queryKey: inventoryKeys.history(productId, query),
    queryFn: () => getInventoryHistory(productId, query),
    staleTime: 15_000,
  });
