"use client";

import { useQuery } from "@tanstack/react-query";

import {
  adminDashboardCouponCountQueryOptions,
  adminDashboardLowStockProductsQueryOptions,
  adminDashboardRecentNotificationsQueryOptions,
  adminDashboardRevenueChartQueryOptions,
  adminDashboardSummaryQueryOptions,
  adminDashboardTopProductsQueryOptions,
} from "../api/admin-dashboard.queries";

const TOP_PRODUCTS_LIMIT = 5;
const LOW_STOCK_LIMIT = 8;
const RECENT_NOTIFICATIONS_LIMIT = 8;

export function useAdminDashboard(enabled = true) {
  const summary = useQuery({ ...adminDashboardSummaryQueryOptions(), enabled });
  const revenueChart = useQuery({
    ...adminDashboardRevenueChartQueryOptions(),
    enabled,
  });
  const topProducts = useQuery({
    ...adminDashboardTopProductsQueryOptions(TOP_PRODUCTS_LIMIT),
    enabled,
  });
  const lowStockProducts = useQuery({
    ...adminDashboardLowStockProductsQueryOptions(LOW_STOCK_LIMIT),
    enabled,
  });
  const recentNotifications = useQuery({
    ...adminDashboardRecentNotificationsQueryOptions(RECENT_NOTIFICATIONS_LIMIT),
    enabled,
  });
  const couponCount = useQuery({
    ...adminDashboardCouponCountQueryOptions("all"),
    enabled,
  });
  const activeCouponCount = useQuery({
    ...adminDashboardCouponCountQueryOptions("active"),
    enabled,
  });

  const error =
    summary.error ??
    revenueChart.error ??
    topProducts.error ??
    lowStockProducts.error ??
    recentNotifications.error ??
    couponCount.error ??
    activeCouponCount.error;

  const isPending =
    summary.isPending ||
    revenueChart.isPending ||
    topProducts.isPending ||
    lowStockProducts.isPending ||
    recentNotifications.isPending ||
    couponCount.isPending ||
    activeCouponCount.isPending;

  const refetch = async (): Promise<void> => {
    await Promise.all([
      summary.refetch(),
      revenueChart.refetch(),
      topProducts.refetch(),
      lowStockProducts.refetch(),
      recentNotifications.refetch(),
      couponCount.refetch(),
      activeCouponCount.refetch(),
    ]);
  };

  return {
    activeCouponCount,
    couponCount,
    error,
    isPending,
    lowStockProducts,
    recentNotifications,
    refetch,
    revenueChart,
    summary,
    topProducts,
  };
}
