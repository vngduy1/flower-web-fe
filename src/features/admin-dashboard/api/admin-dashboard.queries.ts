import { queryOptions } from "@tanstack/react-query";

import { getAdminCoupons } from "@/features/admin-coupons/api/admin-coupons.api";

import {
  getAdminDashboardLowStockProducts,
  getAdminDashboardRecentNotifications,
  getAdminDashboardRevenueChart,
  getAdminDashboardSummary,
  getAdminDashboardTopProducts,
} from "./admin-dashboard.api";

export const adminDashboardKeys = {
  all: ["admin-dashboard"] as const,
  summary: () => [...adminDashboardKeys.all, "summary"] as const,
  revenueChart: () => [...adminDashboardKeys.all, "revenue-chart"] as const,
  topProducts: (limit: number) =>
    [...adminDashboardKeys.all, "top-products", limit] as const,
  lowStockProducts: (limit: number) =>
    [...adminDashboardKeys.all, "low-stock-products", limit] as const,
  recentNotifications: (limit: number) =>
    [...adminDashboardKeys.all, "recent-notifications", limit] as const,
  couponCount: (filter: "all" | "active") =>
    [...adminDashboardKeys.all, "coupon-count", filter] as const,
};

export function adminDashboardSummaryQueryOptions() {
  return queryOptions({
    queryKey: adminDashboardKeys.summary(),
    queryFn: getAdminDashboardSummary,
    staleTime: 30_000,
  });
}

export function adminDashboardRevenueChartQueryOptions() {
  return queryOptions({
    queryKey: adminDashboardKeys.revenueChart(),
    queryFn: getAdminDashboardRevenueChart,
    staleTime: 30_000,
  });
}

export function adminDashboardTopProductsQueryOptions(limit: number) {
  return queryOptions({
    queryKey: adminDashboardKeys.topProducts(limit),
    queryFn: () => getAdminDashboardTopProducts(limit),
    staleTime: 30_000,
  });
}

export function adminDashboardLowStockProductsQueryOptions(limit: number) {
  return queryOptions({
    queryKey: adminDashboardKeys.lowStockProducts(limit),
    queryFn: () => getAdminDashboardLowStockProducts(limit),
    staleTime: 30_000,
  });
}

export function adminDashboardRecentNotificationsQueryOptions(limit: number) {
  return queryOptions({
    queryKey: adminDashboardKeys.recentNotifications(limit),
    queryFn: () => getAdminDashboardRecentNotifications(limit),
    staleTime: 30_000,
  });
}

export function adminDashboardCouponCountQueryOptions(filter: "all" | "active") {
  return queryOptions({
    queryKey: adminDashboardKeys.couponCount(filter),
    queryFn: () =>
      getAdminCoupons({
        page: 1,
        limit: 1,
        ...(filter === "active" ? { isActive: true } : {}),
      }),
    staleTime: 30_000,
  });
}
