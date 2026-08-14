import { apiClient, toApiPathSegment } from "@/lib/api";

import type {
  AdminCoupon,
  AdminCouponListResponse,
  AdminCouponQuery,
  CouponUsageListResponse,
  CouponUsageQuery,
  CreateAdminCouponRequest,
  DisableAdminCouponResponse,
  UpdateAdminCouponRequest,
} from "../types/admin-coupon";

function serializeBoolean(value: boolean): boolean | string {
  // The backend uses @Type(() => Boolean), where the literal string "false"
  // becomes true. An empty query value is the only validated false value.
  return value ? true : "";
}

export async function getAdminCoupons(query: AdminCouponQuery) {
  const response = await apiClient.get<AdminCouponListResponse>("/admin/coupons", {
    params: {
      ...(query.keyword ? { keyword: query.keyword } : {}),
      ...(query.isActive !== undefined
        ? { isActive: serializeBoolean(query.isActive) }
        : {}),
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    },
  });

  return response.data;
}

export async function getAdminCoupon(id: string) {
  const response = await apiClient.get<AdminCoupon>(
    `/admin/coupons/${toApiPathSegment(id)}`,
  );
  return response.data;
}

export async function createAdminCoupon(request: CreateAdminCouponRequest) {
  const response = await apiClient.post<AdminCoupon>("/admin/coupons", request);
  return response.data;
}

export async function updateAdminCoupon(id: string, request: UpdateAdminCouponRequest) {
  const response = await apiClient.patch<AdminCoupon>(
    `/admin/coupons/${toApiPathSegment(id)}`,
    request,
  );
  return response.data;
}

export async function disableAdminCoupon(id: string) {
  const response = await apiClient.delete<DisableAdminCouponResponse>(
    `/admin/coupons/${toApiPathSegment(id)}`,
  );
  return response.data;
}

export async function getCouponUsages(id: string, query: CouponUsageQuery) {
  const response = await apiClient.get<CouponUsageListResponse>(
    `/admin/coupons/${toApiPathSegment(id)}/usages`,
    {
      params: {
        ...(query.isReversed !== undefined
          ? { isReversed: serializeBoolean(query.isReversed) }
          : {}),
        page: query.page ?? 1,
        limit: query.limit ?? 20,
      },
    },
  );

  return response.data;
}
