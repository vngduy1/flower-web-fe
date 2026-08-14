import type { ProductStatus } from "@/features/products/types/product";
import type { AdminInventoryStatus, AdminProductQuery } from "../types/admin-product";

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  DRAFT: "下書き",
  ACTIVE: "公開中",
  INACTIVE: "非公開",
  SOLD_OUT: "売り切れ",
};

export const STOCK_STATUS_LABELS: Record<AdminInventoryStatus, string> = {
  NOT_MANAGED: "在庫管理なし",
  IN_STOCK: "在庫あり",
  LOW_STOCK: "残りわずか",
  OUT_OF_STOCK: "在庫切れ",
};

const statuses: ProductStatus[] = ["DRAFT", "ACTIVE", "INACTIVE", "SOLD_OUT"];
const stockStatuses = ["ALL", "IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"] as const;
const sortFields = [
  "createdAt",
  "updatedAt",
  "name",
  "basePrice",
  "salePrice",
  "stockQuantity",
] as const;

export function parseAdminProductQuery(params: URLSearchParams): AdminProductQuery {
  const status = params.get("status");
  const stockStatus = params.get("stockStatus");
  const sortBy = params.get("sortBy");
  const sortOrder = params.get("sortOrder");
  const page = Number(params.get("page"));
  return {
    keyword: params.get("keyword") || undefined,
    categoryId: params.get("categoryId") || undefined,
    status: statuses.find((value) => value === status),
    isFeatured: params.get("isFeatured") === "true" ? true : undefined,
    stockStatus: stockStatuses.find((value) => value === stockStatus),
    sortBy: sortFields.find((value) => value === sortBy),
    sortOrder: sortOrder === "ASC" || sortOrder === "DESC" ? sortOrder : undefined,
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
    limit: 20,
  };
}
