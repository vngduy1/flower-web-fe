import Link from "next/link";

import { formatYen } from "@/lib/format/currency";
import { formatDateTime } from "@/lib/format/date";

import type { AdminCoupon } from "../types/admin-coupon";
import { formatCouponDiscount } from "../utils/admin-coupon";
import { CouponAvailabilityBadge } from "./coupon-availability-badge";

function valueOrUnlimited(value: number | null): string {
  return value === null ? "無制限" : value.toLocaleString("ja-JP");
}

function maximumDiscount(value: number | null): string {
  return value === null ? "上限なし" : formatYen(value);
}

export function AdminCouponTable({ coupons }: { coupons: AdminCoupon[] }) {
  return (
    <>
      <div className="mt-6 grid gap-3 xl:hidden">
        {coupons.map((coupon) => (
          <article
            key={coupon.id}
            className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Link
                  href={`/admin/coupons/${coupon.id}`}
                  className="text-brand font-bold hover:underline"
                >
                  {coupon.code}
                </Link>
                <p className="mt-1 font-semibold">{coupon.name}</p>
              </div>
              <p className="text-lg font-semibold">{formatCouponDiscount(coupon)}</p>
            </div>
            <div className="mt-3">
              <CouponAvailabilityBadge coupon={coupon} />
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs">最低注文額</dt>
                <dd>{formatYen(coupon.minimumOrderAmount)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">最大割引額</dt>
                <dd>{maximumDiscount(coupon.maximumDiscountAmount)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">総利用数</dt>
                <dd>
                  {coupon.usedCount.toLocaleString("ja-JP")} /{" "}
                  {valueOrUnlimited(coupon.usageLimit)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">残り利用数</dt>
                <dd>{valueOrUnlimited(coupon.remainingUsage)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">お客様ごとの上限</dt>
                <dd>{valueOrUnlimited(coupon.perUserLimit)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">有効期間</dt>
                <dd>
                  {formatDateTime(coupon.startsAt)}
                  <br />〜 {formatDateTime(coupon.endsAt)}
                </dd>
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
            <Link
              href={`/admin/coupons/${coupon.id}`}
              className="text-brand mt-5 inline-flex text-sm font-semibold"
            >
              詳細と利用履歴を見る →
            </Link>
          </article>
        ))}
      </div>

      <div className="border-brand/10 mt-6 hidden overflow-x-auto rounded-2xl border bg-white shadow-sm xl:block">
        <table className="w-full min-w-345 text-left text-sm">
          <thead className="bg-brand-soft/35 text-muted-foreground text-xs">
            <tr>
              <th className="px-4 py-3 font-semibold">コード・名称</th>
              <th className="px-4 py-3 font-semibold">割引</th>
              <th className="px-4 py-3 font-semibold">注文条件</th>
              <th className="px-4 py-3 font-semibold">利用状況</th>
              <th className="px-4 py-3 font-semibold">お客様上限</th>
              <th className="px-4 py-3 font-semibold">有効期間</th>
              <th className="px-4 py-3 font-semibold">利用可否</th>
              <th className="px-4 py-3 font-semibold">登録・更新</th>
            </tr>
          </thead>
          <tbody className="divide-brand/10 divide-y">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="align-top">
                <td className="px-4 py-4">
                  <Link
                    href={`/admin/coupons/${coupon.id}`}
                    className="text-brand font-bold hover:underline"
                  >
                    {coupon.code}
                  </Link>
                  <p className="mt-1 max-w-52 font-semibold">{coupon.name}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-semibold">{formatCouponDiscount(coupon)}</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    最大 {maximumDiscount(coupon.maximumDiscountAmount)}
                  </p>
                </td>
                <td className="px-4 py-4">最低 {formatYen(coupon.minimumOrderAmount)}</td>
                <td className="px-4 py-4">
                  <p>
                    使用 {coupon.usedCount.toLocaleString("ja-JP")} /{" "}
                    {valueOrUnlimited(coupon.usageLimit)}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    残り {valueOrUnlimited(coupon.remainingUsage)}
                  </p>
                </td>
                <td className="px-4 py-4">{valueOrUnlimited(coupon.perUserLimit)}</td>
                <td className="px-4 py-4 text-xs leading-6">
                  {formatDateTime(coupon.startsAt)}
                  <br />〜 {formatDateTime(coupon.endsAt)}
                </td>
                <td className="px-4 py-4">
                  <CouponAvailabilityBadge coupon={coupon} />
                </td>
                <td className="px-4 py-4 text-xs leading-6">
                  登録 {formatDateTime(coupon.createdAt)}
                  <br />
                  更新 {formatDateTime(coupon.updatedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
