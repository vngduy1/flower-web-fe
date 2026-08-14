"use client";

import { Button, EmptyState } from "@/components/ui";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { normalizeApiError } from "@/lib/api/errors";

import { AdminDashboardSkeleton } from "./admin-dashboard-skeleton";
import { DashboardCouponSummary } from "./dashboard-coupon-summary";
import { DashboardInventoryAlerts } from "./dashboard-inventory-alerts";
import { DashboardOrderSummary } from "./dashboard-order-summary";
import { DashboardProductSummary } from "./dashboard-product-summary";
import { DashboardRecentNotifications } from "./dashboard-recent-notifications";
import { DashboardRecentOrders } from "./dashboard-recent-orders";
import { DashboardRevenuePanel } from "./dashboard-revenue-panel";
import { DashboardSummaryCards } from "./dashboard-summary-cards";
import { useAdminDashboard } from "../hooks/use-admin-dashboard";

export function AdminDashboardContent() {
  const { user } = useAuth();
  const dashboard = useAdminDashboard(Boolean(user));

  if (dashboard.isPending) {
    return <AdminDashboardSkeleton />;
  }

  if (dashboard.error) {
    const error = normalizeApiError(dashboard.error);

    return (
      <EmptyState
        title="ダッシュボードを読み込めませんでした"
        description={error.message}
        code={error.statusCode ? String(error.statusCode) : "ERROR"}
        action={<Button onClick={() => void dashboard.refetch()}>再試行</Button>}
      />
    );
  }

  const summary = dashboard.summary.data;
  const revenueChart = dashboard.revenueChart.data;
  const topProducts = dashboard.topProducts.data;
  const lowStockProducts = dashboard.lowStockProducts.data;
  const recentNotifications = dashboard.recentNotifications.data;
  const couponCount = dashboard.couponCount.data?.pagination.total;
  const activeCouponCount = dashboard.activeCouponCount.data?.pagination.total;

  if (
    !summary ||
    !revenueChart ||
    !topProducts ||
    !lowStockProducts ||
    !recentNotifications ||
    couponCount === undefined ||
    activeCouponCount === undefined
  ) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="mb-8">
        <p className="text-accent text-xs font-bold tracking-[0.18em] uppercase">
          Administration overview
        </p>
        <h1 className="text-brand-dark mt-3 font-serif text-3xl font-semibold sm:text-4xl">
          管理ダッシュボード
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl text-sm leading-7">
          注文、売上、商品、在庫、クーポン、通知の最新状況を確認できます。
        </p>
      </div>

      <DashboardSummaryCards
        summary={summary}
        couponCount={couponCount}
        activeCouponCount={activeCouponCount}
      />

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <DashboardRevenuePanel chart={revenueChart} />
        <DashboardOrderSummary orders={summary.orders} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <DashboardProductSummary products={summary.products} topProducts={topProducts} />
        <DashboardInventoryAlerts inventory={lowStockProducts} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(280px,0.55fr)_minmax(0,1.45fr)]">
        <DashboardCouponSummary
          totalCount={couponCount}
          activeCount={activeCouponCount}
        />
        <DashboardRecentNotifications notifications={recentNotifications} />
      </div>

      <div className="mt-6">
        <DashboardRecentOrders orders={summary.recentOrders} />
      </div>
    </div>
  );
}
