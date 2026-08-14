import { apiClient, toApiPathSegment } from "@/lib/api";

import type { CreatePaymentRequest, Payment } from "../types/payment";

export async function createPayment(request: CreatePaymentRequest): Promise<Payment> {
  const response = await apiClient.post<Payment>("/payments", request);

  return response.data;
}

export async function getPayment(paymentId: string): Promise<Payment> {
  const response = await apiClient.get<Payment>(
    `/payments/${toApiPathSegment(paymentId)}`,
  );

  return response.data;
}

export async function confirmPayment(paymentId: string): Promise<Payment> {
  const response = await apiClient.post<Payment>(
    `/payments/${toApiPathSegment(paymentId)}/confirm`,
  );

  return response.data;
}

export async function failPayment(paymentId: string): Promise<Payment> {
  const response = await apiClient.post<Payment>(
    `/payments/${toApiPathSegment(paymentId)}/fail`,
  );

  return response.data;
}
