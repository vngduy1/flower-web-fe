"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";

import { adminDashboardKeys } from "@/features/admin-dashboard/api/admin-dashboard.queries";
import { couponKeys } from "@/features/coupons/api/coupons.queries";

import {
  createAdminCoupon,
  disableAdminCoupon,
  updateAdminCoupon,
} from "../api/admin-coupons.api";
import {
  adminCouponKeys,
  adminCouponQueryOptions,
  adminCouponsQueryOptions,
  couponUsagesQueryOptions,
} from "../api/admin-coupons.queries";
import type {
  AdminCouponQuery,
  CouponUsageQuery,
  CreateAdminCouponRequest,
  UpdateAdminCouponRequest,
} from "../types/admin-coupon";

export const useAdminCoupons = (query: AdminCouponQuery) =>
  useQuery(adminCouponsQueryOptions(query));

export const useAdminCoupon = (id: string) => useQuery(adminCouponQueryOptions(id));

export const useCouponUsages = (id: string, query: CouponUsageQuery) =>
  useQuery(couponUsagesQueryOptions(id, query));

async function invalidateCouponDependencies(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: adminCouponKeys.lists() }),
    queryClient.invalidateQueries({ queryKey: couponKeys.available() }),
    queryClient.invalidateQueries({
      queryKey: adminDashboardKeys.couponCount("all"),
    }),
    queryClient.invalidateQueries({
      queryKey: adminDashboardKeys.couponCount("active"),
    }),
  ]);
}

export function useCreateAdminCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateAdminCouponRequest) => createAdminCoupon(request),
    onSuccess: async (coupon) => {
      queryClient.setQueryData(adminCouponKeys.detail(coupon.id), coupon);
      await invalidateCouponDependencies(queryClient);
    },
  });
}

export function useUpdateAdminCoupon(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateAdminCouponRequest) => updateAdminCoupon(id, request),
    onSuccess: async (coupon) => {
      await Promise.all([
        invalidateCouponDependencies(queryClient),
        queryClient.invalidateQueries({
          queryKey: adminCouponKeys.detail(id),
        }),
      ]);
      queryClient.setQueryData(adminCouponKeys.detail(id), coupon);
    },
  });
}

export function useDisableAdminCoupon(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => disableAdminCoupon(id),
    onSuccess: async () => {
      await Promise.all([
        invalidateCouponDependencies(queryClient),
        queryClient.invalidateQueries({
          queryKey: adminCouponKeys.detail(id),
        }),
      ]);
    },
  });
}
