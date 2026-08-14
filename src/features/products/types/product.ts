import type { CategoryRelationResponse } from "@/features/categories/types/category";

export type ProductStatus = "DRAFT" | "ACTIVE" | "INACTIVE" | "SOLD_OUT";

export interface ProductResponse {
  id: string;
  productCode: string;
  name: string;
  slug: string;
  categoryId: string;
  category: CategoryRelationResponse;
  description: string | null;
  basePrice: string;
  salePrice: string | null;
  status: ProductStatus;
  isFeatured: boolean;
  availableFrom: string | null;
  availableUntil: string | null;
  preparationDays: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AdminProductResponse extends ProductResponse {
  costPrice: string | null;
}

export type Product = ProductResponse;
export type AdminProduct = AdminProductResponse;

export interface ProductImageResponse {
  id: string;
  productId: string;
  originalUrl: string;
  largeUrl: string;
  imageUrl: string;
  thumbnailUrl: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type ProductImage = ProductImageResponse;

export interface ProductInventoryResponse {
  id: string;
  productId: string;
  stockQuantity: number;
  reservedQuantity: number;
  lowStockThreshold: number;
  isStockManaged: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInventory extends ProductInventoryResponse {
  availableQuantity: number | null;
  isLowStock: boolean;
  isOutOfStock: boolean;
}

export interface ProductPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductListResponse {
  items: Product[];
  pagination: ProductPagination;
}

export interface ProductListResponsePayload {
  items: ProductResponse[];
  pagination: ProductPagination;
}

export interface ProductListQuery {
  keyword?: string;
  categoryId?: string;
  status?: ProductStatus;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
}

export interface ProductDetail {
  product: Product;
  images: ProductImage[];
  inventory: ProductInventory | null;
}
