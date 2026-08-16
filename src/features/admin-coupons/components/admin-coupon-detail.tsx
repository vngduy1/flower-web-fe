"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Alert, Button, EmptyState, Skeleton } from "@/components/ui";
import { formatYen } from "@/lib/format/currency";
import { formatDateTime } from "@/lib/format/date";
import { normalizeApiError } from "@/lib/api";

import { useAdminCoupon } from "../hooks/use-admin-coupons";
import { formatCouponDiscount } from "../utils/admin-coupon";
import { CouponAvailabilityBadge } from "./coupon-availability-badge";
import { CouponForm } from "./coupon-form";
import { CouponUsageSection } from "./coupon-usage-section";
import { DisableCouponDialog } from "./disable-coupon-dialog";

function limit(value: number | null): string {
  return value === null ? "無制限" : value.toLocaleString("ja-JP");
}

export function AdminCouponDetail({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const detail = useAdminCoupon(id);

  if (detail.isPending) {
    return (
      <div className="grid gap-5">
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-180 rounded-2xl" />
      </div>
    );
  }

  if (detail.error || !detail.data) {
    return (
      <EmptyState
        title="クーポンを読み込めませんでした"
        description={normalizeApiError(detail.error).message}
        action={<Button onClick={() => void detail.refetch()}>再試行</Button>}
      />
    );
  }

  const coupon = detail.data;

  return (
    <div className="mx-auto max-w-350">
      <Link href="/admin/coupons" className="text-brand text-sm font-semibold">
        ← クーポン一覧
      </Link>

      {searchParams.get("created") === "true" ? (
        <Alert className="mt-5" variant="success">
          クーポンを作成しました。設定内容と利用可否をご確認ください。
        </Alert>
      ) : null}

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-xs">Coupon ID {coupon.id}</p>
          <h1 className="text-brand-dark mt-2 font-serif text-3xl font-semibold">
            {coupon.code}
          </h1>
          <p className="mt-2 font-semibold">{coupon.name}</p>
        </div>
        <CouponAvailabilityBadge coupon={coupon} />
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <CouponForm coupon={coupon} />
        <aside className="grid content-start gap-6">
          <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-serif text-xl font-semibold">割引と利用状況</h2>
            <dl className="mt-4 grid gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs">割引</dt>
                <dd className="font-semibold">{formatCouponDiscount(coupon)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">最低注文額</dt>
                <dd>{formatYen(coupon.minimumOrderAmount)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">最大割引額</dt>
                <dd>
                  {coupon.maximumDiscountAmount === null
                    ? "上限なし"
                    : formatYen(coupon.maximumDiscountAmount)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">利用数 / 総上限</dt>
                <dd>
                  {coupon.usedCount.toLocaleString("ja-JP")} / {limit(coupon.usageLimit)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">残り利用数</dt>
                <dd>{limit(coupon.remainingUsage)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">お客様ごとの上限</dt>
                <dd>{limit(coupon.perUserLimit)}</dd>
              </div>
            </dl>
          </section>

          <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-serif text-xl font-semibold">利用可否の根拠</h2>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">有効設定</dt>
                <dd>{coupon.isActive ? "有効" : "無効"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">開始済み</dt>
                <dd>{coupon.availability.hasStarted ? "はい" : "いいえ"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">期限切れ</dt>
                <dd>{coupon.availability.hasExpired ? "はい" : "いいえ"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">利用上限到達</dt>
                <dd>{coupon.availability.usageLimitReached ? "はい" : "いいえ"}</dd>
              </div>
            </dl>
          </section>

          <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-serif text-xl font-semibold">日時</h2>
            <dl className="mt-4 grid gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs">開始日時</dt>
                <dd>{formatDateTime(coupon.startsAt)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">終了日時</dt>
                <dd>{formatDateTime(coupon.endsAt)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">登録日時</dt>
                <dd>{formatDateTime(coupon.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">更新日時</dt>
                <dd>{formatDateTime(coupon.updatedAt)}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-red-200 bg-white p-5">
            <h2 className="font-semibold text-red-800">公開状態を変更</h2>
            <p className="text-muted-foreground mt-2 text-xs leading-6">
              無効化はソフト無効化です。利用履歴は削除されません。
            </p>
            <div className="mt-4">
              <DisableCouponDialog coupon={coupon} />
            </div>
          </section>
        </aside>
      </div>

      <CouponUsageSection couponId={coupon.id} />
    </div>
  );
}
