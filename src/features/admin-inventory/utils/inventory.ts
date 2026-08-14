import type {
  InventoryChangeType,
  InventoryHistoryQuery,
  InventoryQuery,
  InventoryStockStatus,
} from "../types/inventory";

export const INVENTORY_STATUS_LABELS: Record<InventoryStockStatus, string> = {
  NOT_MANAGED: "在庫管理なし",
  OUT_OF_STOCK: "在庫切れ",
  LOW_STOCK: "残りわずか",
  IN_STOCK: "在庫あり",
};

export const CHANGE_TYPE_LABELS: Record<InventoryChangeType, string> = {
  IMPORT: "入荷",
  MANUAL_INCREASE: "手動増加",
  MANUAL_DECREASE: "手動減少",
  ADJUSTMENT: "在庫数を指定",
  ORDER_RESERVED: "注文引当",
  ORDER_CANCELLED: "注文キャンセル",
  ORDER_COMPLETED: "注文完了",
};

const stockStatuses = [
  "ALL",
  "IN_STOCK",
  "LOW_STOCK",
  "OUT_OF_STOCK",
  "NOT_MANAGED",
] as const;
const sortFields = [
  "productName",
  "stockQuantity",
  "availableQuantity",
  "updatedAt",
] as const;
const changeTypes = Object.keys(CHANGE_TYPE_LABELS) as InventoryChangeType[];

export function parseInventoryQuery(params: URLSearchParams): InventoryQuery {
  const page = Number(params.get("page"));
  const stockStatus = params.get("stockStatus");
  const sortBy = params.get("sortBy");
  const sortOrder = params.get("sortOrder");
  return {
    keyword: params.get("keyword") || undefined,
    categoryId: params.get("categoryId") || undefined,
    stockStatus: stockStatuses.find((value) => value === stockStatus),
    sortBy: sortFields.find((value) => value === sortBy),
    sortOrder: sortOrder === "ASC" || sortOrder === "DESC" ? sortOrder : undefined,
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
    limit: 20,
  };
}

export function parseHistoryQuery(params: URLSearchParams): InventoryHistoryQuery {
  const page = Number(params.get("historyPage"));
  const changeType = params.get("changeType");
  return {
    changeType: changeTypes.find((value) => value === changeType),
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
    limit: 20,
  };
}
