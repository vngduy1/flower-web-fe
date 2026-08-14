import { apiClient } from "@/lib/api";

import type {
  AvailableCouponsResponse,
  CouponValidationRequest,
  CouponValidationResponse,
} from "../types/coupon";

export async function getAvailableCoupons(): Promise<AvailableCouponsResponse> {
  const response = await apiClient.get<AvailableCouponsResponse>("/coupons/available", {
    params: { page: 1, limit: 100 },
  });

  return response.data;
}

export async function validateCoupon(
  request: CouponValidationRequest,
): Promise<CouponValidationResponse> {
  const response = await apiClient.post<CouponValidationResponse>(
    "/coupons/validate",
    request,
  );

  return response.data;
}
