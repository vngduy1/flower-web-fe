"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adminDashboardKeys } from "@/features/admin-dashboard/api/admin-dashboard.queries";
import { adminProductKeys } from "@/features/admin-products/api/admin-products.queries";
import { productKeys } from "@/features/products/api/products.queries";

import { adjustInventory, updateInventorySettings } from "../api/admin-inventory.api";
import {
  inventoriesQueryOptions,
  inventoryHistoryQueryOptions,
  inventoryKeys,
  inventoryQueryOptions,
} from "../api/admin-inventory.queries";
import type {
  AdjustInventoryRequest,
  InventoryHistoryQuery,
  InventoryQuery,
} from "../types/inventory";

export const useInventories = (query: InventoryQuery) =>
  useQuery(inventoriesQueryOptions(query));
export const useInventory = (productId: string) =>
  useQuery(inventoryQueryOptions(productId));
export const useInventoryHistory = (productId: string, query: InventoryHistoryQuery) =>
  useQuery(inventoryHistoryQueryOptions(productId, query));

function useInvalidateInventory() {
  const queryClient = useQueryClient();
  return async (productId: string) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all }),
      queryClient.invalidateQueries({ queryKey: adminProductKeys.all }),
      queryClient.invalidateQueries({ queryKey: productKeys.all }),
      queryClient.invalidateQueries({ queryKey: adminDashboardKeys.all }),
      queryClient.invalidateQueries({ queryKey: inventoryKeys.detail(productId) }),
    ]);
  };
}

export function useAdjustInventory(productId: string) {
  const invalidate = useInvalidateInventory();
  return useMutation({
    mutationFn: (request: AdjustInventoryRequest) => adjustInventory(productId, request),
    onSuccess: () => invalidate(productId),
  });
}

export function useUpdateThreshold(productId: string) {
  const invalidate = useInvalidateInventory();
  return useMutation({
    mutationFn: (lowStockThreshold: number) =>
      updateInventorySettings(productId, { lowStockThreshold }),
    onSuccess: () => invalidate(productId),
  });
}

export function useUpdateStockManaged(productId: string) {
  const invalidate = useInvalidateInventory();
  return useMutation({
    mutationFn: (isStockManaged: boolean) =>
      updateInventorySettings(productId, { isStockManaged }),
    onSuccess: () => invalidate(productId),
  });
}
