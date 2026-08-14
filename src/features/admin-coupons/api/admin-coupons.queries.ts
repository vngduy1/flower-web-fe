import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { getAdminCoupon, getAdminCoupons, getCouponUsages } from "./admin-coupons.api";
import type { AdminCouponQuery, CouponUsageQuery } from "../types/admin-coupon";

export const adminCouponKeys = {
  all: ["admin-coupons"] as const,
  lists: () => [...adminCouponKeys.all, "list"] as const,
  list: (query: AdminCouponQuery) => [...adminCouponKeys.lists(), query] as const,
  details: () => [...adminCouponKeys.all, "detail"] as const,
  detail: (id: string) => [...adminCouponKeys.details(), id] as const,
  usages: (id: string) => [...adminCouponKeys.detail(id), "usages"] as const,
  usageList: (id: string, query: CouponUsageQuery) =>
    [...adminCouponKeys.usages(id), query] as const,
};

export const adminCouponsQueryOptions = (query: AdminCouponQuery) =>
  queryOptions({
    queryKey: adminCouponKeys.list(query),
    queryFn: () => getAdminCoupons(query),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

export const adminCouponQueryOptions = (id: string) =>
  queryOptions({
    queryKey: adminCouponKeys.detail(id),
    queryFn: () => getAdminCoupon(id),
    staleTime: 30_000,
  });

export const couponUsagesQueryOptions = (id: string, query: CouponUsageQuery) =>
  queryOptions({
    queryKey: adminCouponKeys.usageList(id, query),
    queryFn: () => getCouponUsages(id, query),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });
