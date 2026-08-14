import type { ProductStatus } from "@/features/products/types/product";

export interface WishlistProduct {
  id: string;
  productCode: string;
  name: string;
  slug: string;
  thumbnailUrl: string | null;
  basePrice: number;
  salePrice: number | null;
  currentPrice: number;
  status: ProductStatus;
  isAvailable: boolean;
}

export interface WishlistItem {
  id: string;
  product: WishlistProduct;
  createdAt: string;
}

export interface AddWishlistItemResponse {
  message: string;
  id: string;
  productId: string;
  createdAt: string;
}

export interface RemoveWishlistItemResponse {
  message: string;
}
