import { apiClient } from "@/lib/api";

import type {
  AdminDashboardLowStockProducts,
  AdminDashboardRecentNotifications,
  AdminDashboardRevenueChart,
  AdminDashboardSummary,
  AdminDashboardTopProducts,
} from "../types/dashboard";

export async function getAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  const response = await apiClient.get<AdminDashboardSummary>("/admin/dashboard/summary");

  return response.data;
}

export async function getAdminDashboardRevenueChart(): Promise<AdminDashboardRevenueChart> {
  const response = await apiClient.get<AdminDashboardRevenueChart>(
    "/admin/dashboard/revenue-chart",
  );

  return response.data;
}

export async function getAdminDashboardTopProducts(
  limit: number,
): Promise<AdminDashboardTopProducts> {
  const response = await apiClient.get<AdminDashboardTopProducts>(
    "/admin/dashboard/top-products",
    { params: { limit } },
  );

  return response.data;
}

export async function getAdminDashboardLowStockProducts(
  limit: number,
): Promise<AdminDashboardLowStockProducts> {
  const response = await apiClient.get<AdminDashboardLowStockProducts>(
    "/admin/dashboard/low-stock-products",
    { params: { limit } },
  );

  return response.data;
}

export async function getAdminDashboardRecentNotifications(
  limit: number,
): Promise<AdminDashboardRecentNotifications> {
  const response = await apiClient.get<AdminDashboardRecentNotifications>(
    "/admin/dashboard/recent-notifications",
    { params: { limit } },
  );

  return response.data;
}
