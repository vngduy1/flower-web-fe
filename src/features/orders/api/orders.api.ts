import { apiClient, toApiPathSegment } from "@/lib/api";

import type {
  CancelOrderVariables,
  CreateOrderVariables,
  Order,
  OrderDetail,
  OrderListItem,
} from "../types/order";

export async function createOrder({
  request,
  idempotencyKey,
}: CreateOrderVariables): Promise<Order> {
  const response = await apiClient.post<Order>("/orders", request, {
    headers: { "Idempotency-Key": idempotencyKey },
  });

  return response.data;
}

export async function getOrder(orderId: string): Promise<OrderDetail> {
  const response = await apiClient.get<OrderDetail>(
    `/orders/${toApiPathSegment(orderId)}`,
  );

  return response.data;
}

export async function getOrders(): Promise<OrderListItem[]> {
  const response = await apiClient.get<OrderListItem[]>("/orders");

  return response.data;
}

export async function cancelOrder({
  orderId,
  request,
}: CancelOrderVariables): Promise<Order> {
  const response = await apiClient.patch<Order>(
    `/orders/${toApiPathSegment(orderId)}/cancel`,
    request,
  );

  return response.data;
}
