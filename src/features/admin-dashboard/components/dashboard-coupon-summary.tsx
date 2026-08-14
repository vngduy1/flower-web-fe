import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

interface DashboardCouponSummaryProps {
  activeCount: number;
  totalCount: number;
}

export function DashboardCouponSummary({
  activeCount,
  totalCount,
}: DashboardCouponSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <p className="text-accent text-[10px] font-bold tracking-[0.14em] uppercase">
          Coupon summary
        </p>
        <CardTitle className="mt-2">クーポン</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-5 text-center">
            <dt className="text-xs">登録数</dt>
            <dd className="text-brand-dark mt-2 font-serif text-3xl font-semibold">
              {totalCount.toLocaleString("ja-JP")}
            </dd>
          </div>
          <div className="rounded-2xl bg-white p-5 text-center">
            <dt className="text-xs">有効設定</dt>
            <dd className="text-brand-dark mt-2 font-serif text-3xl font-semibold">
              {activeCount.toLocaleString("ja-JP")}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-xs leading-5">
          有効設定数は管理APIの isActive=true
          件数です。開始前・期限切れ・利用上限到達は別条件のため合算していません。
        </p>
      </CardContent>
    </Card>
  );
}
