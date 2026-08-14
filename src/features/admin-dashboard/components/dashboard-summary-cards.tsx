import { Card } from "@/components/ui";
import { formatYen } from "@/lib/format/currency";

import type { AdminDashboardSummary } from "../types/dashboard";

interface SummaryCardProps {
  detail: string;
  eyebrow: string;
  value: string;
}

function SummaryCard({ detail, eyebrow, value }: SummaryCardProps) {
  return (
    <Card className="border-brand/10 p-5 sm:p-6">
      <p className="text-accent text-[10px] font-bold tracking-[0.14em] uppercase">
        {eyebrow}
      </p>
      <p className="text-brand-dark mt-3 font-serif text-3xl font-semibold">{value}</p>
      <p className="text-muted-foreground mt-2 text-xs leading-5">{detail}</p>
    </Card>
  );
}

interface DashboardSummaryCardsProps {
  activeCouponCount: number;
  couponCount: number;
  summary: AdminDashboardSummary;
}

export function DashboardSummaryCards({
  activeCouponCount,
  couponCount,
  summary,
}: DashboardSummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <SummaryCard
        eyebrow="Today revenue"
        value={formatYen(summary.revenue.today)}
        detail={`今月 ${formatYen(summary.revenue.thisMonth)}`}
      />
      <SummaryCard
        eyebrow="Orders"
        value={summary.orders.total.toLocaleString("ja-JP")}
        detail={`本日 ${summary.orders.today.toLocaleString("ja-JP")}件`}
      />
      <SummaryCard
        eyebrow="Products"
        value={summary.products.active.toLocaleString("ja-JP")}
        detail={`登録 ${summary.products.total.toLocaleString("ja-JP")}件 / 在庫切れ ${summary.products.outOfStock.toLocaleString("ja-JP")}件`}
      />
      <SummaryCard
        eyebrow="Users"
        value={summary.users.total.toLocaleString("ja-JP")}
        detail={`今月の新規 ${summary.users.newThisMonth.toLocaleString("ja-JP")}人`}
      />
      <SummaryCard
        eyebrow="Reviews"
        value={summary.reviews.pending.toLocaleString("ja-JP")}
        detail={`承認待ち / 承認済み ${summary.reviews.approved.toLocaleString("ja-JP")}件`}
      />
      <SummaryCard
        eyebrow="Coupons"
        value={activeCouponCount.toLocaleString("ja-JP")}
        detail={`有効設定 / 登録 ${couponCount.toLocaleString("ja-JP")}件`}
      />
    </div>
  );
}
