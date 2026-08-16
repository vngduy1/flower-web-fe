import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { formatYen } from "@/lib/format/currency";
import { formatDate } from "@/lib/format/date";

import type { AdminDashboardRevenueChart } from "../types/dashboard";

export function DashboardRevenuePanel({ chart }: { chart: AdminDashboardRevenueChart }) {
  const maximumRevenue = Math.max(...chart.items.map((item) => item.revenue), 0);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-accent text-[10px] font-bold tracking-[0.14em] uppercase">
            Revenue chart
          </p>
          <CardTitle className="mt-2">売上推移</CardTitle>
        </div>
        <p className="text-muted-foreground text-xs">
          {formatDate(chart.from)} — {formatDate(chart.to)}
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-2" tabIndex={0} aria-label="売上推移グラフ">
          <div className="flex h-56 min-w-180 items-end gap-2 border-b px-1 pt-5">
            {chart.items.map((item, index) => {
              const height =
                item.revenue > 0 && maximumRevenue > 0
                  ? `${Math.max((item.revenue / maximumRevenue) * 100, 4)}%`
                  : "2px";

              return (
                <div
                  key={item.date}
                  className="flex h-full min-w-4 flex-1 flex-col justify-end"
                >
                  <div
                    className="bg-brand hover:bg-brand-dark w-full rounded-t-md transition-colors"
                    role="img"
                    style={{ height }}
                    title={`${formatDate(item.date)}: ${formatYen(item.revenue)} / ${item.orderCount}件`}
                    aria-label={`${formatDate(item.date)}、売上${formatYen(item.revenue)}、注文${item.orderCount}件`}
                  />
                  <span className="text-muted-foreground mt-2 h-4 text-center text-[9px]">
                    {index % 5 === 0 || index === chart.items.length - 1
                      ? item.date.slice(5).replace("-", "/")
                      : ""}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-muted-foreground mt-3 text-xs leading-5">
          支払い済みの注文を日別に集計して表示します。
        </p>
      </CardContent>
    </Card>
  );
}
