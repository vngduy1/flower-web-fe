import { apiClient, toApiPathSegment } from "@/lib/api";

import type {
  AddWishlistItemResponse,
  RemoveWishlistItemResponse,
  WishlistItem,
} from "../types/wishlist";

export async function getWishlist(): Promise<WishlistItem[]> {
  const response = await apiClient.get<WishlistItem[]>("/wishlist");

  return response.data;
}

export async function addWishlistItem(
  productId: string,
): Promise<AddWishlistItemResponse> {
  const response = await apiClient.post<AddWishlistItemResponse>(
    `/wishlist/${toApiPathSegment(productId)}`,
  );

  return response.data;
}

export async function removeWishlistItem(
  productId: string,
): Promise<RemoveWishlistItemResponse> {
  const response = await apiClient.delete<RemoveWishlistItemResponse>(
    `/wishlist/${toApiPathSegment(productId)}`,
  );

  return response.data;
}
