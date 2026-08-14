import { apiClient, toApiPathSegment } from "@/lib/api";

import type {
  AdminOrderDetail,
  AdminOrderListResponse,
  AdminOrderQuery,
  UpdateAdminOrderStatusRequest,
} from "../types/admin-order";

export async function getAdminOrders(query: AdminOrderQuery) {
  const response = await apiClient.get<AdminOrderListResponse>("/admin/orders", {
    params: query,
  });
  return response.data;
}

export async function getAdminOrder(id: string) {
  const response = await apiClient.get<AdminOrderDetail>(
    `/admin/orders/${toApiPathSegment(id)}`,
  );
  return response.data;
}

export async function updateAdminOrderStatus(
  id: string,
  request: UpdateAdminOrderStatusRequest,
) {
  const response = await apiClient.patch<AdminOrderDetail>(
    `/admin/orders/${toApiPathSegment(id)}/status`,
    request,
  );
  return response.data;
}
