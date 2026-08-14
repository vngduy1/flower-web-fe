export type InventoryStockStatus =
  "NOT_MANAGED" | "OUT_OF_STOCK" | "LOW_STOCK" | "IN_STOCK";

export type InventoryStockFilter = InventoryStockStatus | "ALL";
export type InventorySortBy =
  "productName" | "stockQuantity" | "availableQuantity" | "updatedAt";
export type InventorySortOrder = "ASC" | "DESC";

export type InventoryChangeType =
  | "IMPORT"
  | "MANUAL_INCREASE"
  | "MANUAL_DECREASE"
  | "ADJUSTMENT"
  | "ORDER_RESERVED"
  | "ORDER_CANCELLED"
  | "ORDER_COMPLETED";

export type AdminAdjustmentType = Extract<
  InventoryChangeType,
  "IMPORT" | "MANUAL_INCREASE" | "MANUAL_DECREASE" | "ADJUSTMENT"
>;

export interface InventoryQuery {
  keyword?: string;
  categoryId?: string;
  stockStatus?: InventoryStockFilter;
  sortBy?: InventorySortBy;
  sortOrder?: InventorySortOrder;
  page?: number;
  limit?: number;
}

export interface InventoryHistoryQuery {
  changeType?: InventoryChangeType;
  page?: number;
  limit?: number;
}

export interface InventoryProduct {
  id: string;
  productCode: string;
  name: string;
  slug: string;
  category: { id: string; name: string } | null;
}

export interface Inventory {
  id: string;
  product: InventoryProduct;
  stockQuantity: number;
  reservedQuantity: number;
  availableQuantity: number | null;
  lowStockThreshold: number;
  isStockManaged: boolean;
  stockStatus: InventoryStockStatus;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryListResponse {
  items: Inventory[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface InventoryHistory {
  id: string;
  changeType: InventoryChangeType;
  quantityBefore: number;
  quantityChange: number;
  quantityAfter: number;
  reservedBefore: number;
  reservedAfter: number;
  reason: string | null;
  changedBy: { id: string; fullName: string; email: string } | null;
  createdAt: string;
}

export interface InventoryHistoryResponse {
  items: InventoryHistory[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface AdjustInventoryRequest {
  changeType: AdminAdjustmentType;
  quantity: number;
  reason?: string;
}

export interface UpdateInventorySettingsRequest {
  lowStockThreshold?: number;
  isStockManaged?: boolean;
}
