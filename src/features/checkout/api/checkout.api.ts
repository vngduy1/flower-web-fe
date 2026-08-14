import { apiClient } from "@/lib/api";

import type { CheckoutPreviewRequest, CheckoutPreviewResponse } from "../types/checkout";

export async function getCheckoutPreview(
  request: CheckoutPreviewRequest,
): Promise<CheckoutPreviewResponse> {
  const response = await apiClient.post<CheckoutPreviewResponse>(
    "/checkout/preview",
    request,
  );

  return response.data;
}
