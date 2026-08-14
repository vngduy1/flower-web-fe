import { apiClient, toApiPathSegment } from "@/lib/api";

import type {
  AdjustInventoryRequest,
  Inventory,
  InventoryHistoryQuery,
  InventoryHistoryResponse,
  InventoryListResponse,
  InventoryQuery,
  UpdateInventorySettingsRequest,
} from "../types/inventory";

export async function getInventories(query: InventoryQuery) {
  const response = await apiClient.get<InventoryListResponse>("/admin/inventories", {
    params: query,
  });
  return response.data;
}

export async function getInventory(productId: string) {
  const response = await apiClient.get<Inventory>(
    `/admin/inventories/${toApiPathSegment(productId)}`,
  );
  return response.data;
}

export async function adjustInventory(
  productId: string,
  request: AdjustInventoryRequest,
) {
  const response = await apiClient.post<Inventory>(
    `/admin/inventories/${toApiPathSegment(productId)}/adjust`,
    request,
  );
  return response.data;
}

export async function updateInventorySettings(
  productId: string,
  request: UpdateInventorySettingsRequest,
) {
  const response = await apiClient.patch<Inventory>(
    `/admin/inventories/${toApiPathSegment(productId)}/settings`,
    request,
  );
  return response.data;
}

export async function getInventoryHistory(
  productId: string,
  query: InventoryHistoryQuery,
) {
  const response = await apiClient.get<InventoryHistoryResponse>(
    `/admin/inventories/${toApiPathSegment(productId)}/histories`,
    { params: query },
  );
  return response.data;
}
