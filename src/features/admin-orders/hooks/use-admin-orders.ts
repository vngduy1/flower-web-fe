"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adminDashboardKeys } from "@/features/admin-dashboard/api/admin-dashboard.queries";
import { adminProductKeys } from "@/features/admin-products/api/admin-products.queries";
import { inventoryKeys } from "@/features/admin-inventory/api/admin-inventory.queries";
import { notificationKeys } from "@/features/notifications/api/notifications.queries";
import { orderKeys } from "@/features/orders/api/orders.queries";
import { productKeys } from "@/features/products/api/products.queries";

import { updateAdminOrderStatus } from "../api/admin-orders.api";
import {
  adminOrderKeys,
  adminOrderQueryOptions,
  adminOrdersQueryOptions,
} from "../api/admin-orders.queries";
import type {
  AdminOrderQuery,
  UpdateAdminOrderStatusRequest,
} from "../types/admin-order";

export const useAdminOrders = (query: AdminOrderQuery) =>
  useQuery(adminOrdersQueryOptions(query));
export const useAdminOrder = (id: string) => useQuery(adminOrderQueryOptions(id));

export function useUpdateAdminOrderStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UpdateAdminOrderStatusRequest) =>
      updateAdminOrderStatus(id, request),
    onSuccess: async (order, request) => {
      const invalidations = [
        queryClient.invalidateQueries({ queryKey: adminOrderKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: adminOrderKeys.detail(id) }),
        queryClient.invalidateQueries({ queryKey: orderKeys.all }),
        queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
        queryClient.invalidateQueries({ queryKey: adminDashboardKeys.summary() }),
        queryClient.invalidateQueries({
          queryKey: [...adminDashboardKeys.all, "recent-notifications"],
        }),
      ];

      if (request.status === "CANCELLED") {
        invalidations.push(
          queryClient.invalidateQueries({ queryKey: inventoryKeys.all }),
          queryClient.invalidateQueries({ queryKey: adminProductKeys.all }),
          queryClient.invalidateQueries({ queryKey: productKeys.all }),
          queryClient.invalidateQueries({
            queryKey: adminDashboardKeys.revenueChart(),
          }),
          queryClient.invalidateQueries({
            queryKey: [...adminDashboardKeys.all, "top-products"],
          }),
          queryClient.invalidateQueries({
            queryKey: [...adminDashboardKeys.all, "low-stock-products"],
          }),
        );
      }

      await Promise.all(invalidations);
      queryClient.setQueryData(adminOrderKeys.detail(id), order);
    },
  });
}
