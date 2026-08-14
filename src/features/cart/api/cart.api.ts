import { apiClient, toApiPathSegment } from "@/lib/api";

import type {
  AddCartItemRequest,
  Cart,
  ClearCartResponse,
  UpdateCartItemRequest,
} from "../types/cart";

export async function getCart(): Promise<Cart> {
  const response = await apiClient.get<Cart>("/cart");

  return response.data;
}

export async function addCartItem(request: AddCartItemRequest): Promise<Cart> {
  const response = await apiClient.post<Cart>("/cart/items", request);

  return response.data;
}

export async function updateCartItem({
  itemId,
  quantity,
}: UpdateCartItemRequest): Promise<Cart> {
  const response = await apiClient.patch<Cart>(
    `/cart/items/${toApiPathSegment(itemId)}`,
    {
      quantity,
    },
  );

  return response.data;
}

export async function removeCartItem(itemId: string): Promise<Cart> {
  const response = await apiClient.delete<Cart>(
    `/cart/items/${toApiPathSegment(itemId)}`,
  );

  return response.data;
}

export async function clearCart(): Promise<ClearCartResponse> {
  const response = await apiClient.delete<ClearCartResponse>("/cart");

  return response.data;
}
