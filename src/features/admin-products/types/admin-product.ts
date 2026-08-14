import type {
  ProductImage,
  ProductStatus,
  AdminProduct,
} from "@/features/products/types/product";

export type AdminStockStatus = "ALL" | "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
export type AdminInventoryStatus = Exclude<AdminStockStatus, "ALL"> | "NOT_MANAGED";
export type AdminProductSortBy =
  "createdAt" | "updatedAt" | "name" | "basePrice" | "salePrice" | "stockQuantity";
export type SortOrder = "ASC" | "DESC";

export interface AdminProductQuery {
  keyword?: string;
  categoryId?: string;
  status?: ProductStatus;
  isFeatured?: true;
  stockStatus?: AdminStockStatus;
  sortBy?: AdminProductSortBy;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
  deletedOnly?: boolean;
}

export interface AdminProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface AdminProductInventory {
  stockQuantity: number;
  reservedQuantity: number;
  availableQuantity: number | null;
  lowStockThreshold: number;
  isStockManaged: boolean;
  stockStatus: AdminInventoryStatus;
}

export interface AdminProductImageSummary {
  id: string;
  imageUrl: string;
  thumbnailUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface AdminProductSummary {
  id: string;
  productCode: string;
  name: string;
  slug: string;
  category: AdminProductCategory | null;
  basePrice: number;
  salePrice: number | null;
  currentPrice: number;
  status: ProductStatus;
  isFeatured: boolean;
  thumbnailUrl: string | null;
  inventory: AdminProductInventory | null;
  availableFrom: string | null;
  availableUntil: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AdminProductDetailResponse extends AdminProductSummary {
  product: AdminProduct;
  images: AdminProductImageSummary[];
}

export interface AdminProductDetail {
  summary: AdminProductDetailResponse;
  product: AdminProduct;
}

export interface AdminProductListResponse {
  items: AdminProductSummary[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface ProductWritePayload {
  productCode?: string;
  name?: string;
  slug?: string;
  categoryId?: string;
  description?: string;
  basePrice?: string;
  salePrice?: string;
  costPrice?: string;
  status?: ProductStatus;
  isFeatured?: boolean;
  availableFrom?: string;
  availableUntil?: string;
  preparationDays?: number;
}

export interface ProductImageWritePayload {
  altText?: string;
  sortOrder?: number;
  isPrimary?: boolean;
}

export interface ProductImageUploadVariables extends ProductImageWritePayload {
  productId: string;
  file: File;
  onProgress?: (progress: number) => void;
}

export interface ProductImageMutationVariables extends ProductImageWritePayload {
  productId: string;
  imageId: string;
}

export type { ProductImage, ProductStatus };
