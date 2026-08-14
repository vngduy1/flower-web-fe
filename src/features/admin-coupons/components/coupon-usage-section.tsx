"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Alert, Button, EmptyState, Skeleton } from "@/components/ui";
import { normalizeApiError } from "@/lib/api";

import { useCouponUsages } from "../hooks/use-admin-coupons";
import { parseCouponUsageQuery } from "../utils/admin-coupon";
import { CouponUsageTable } from "./coupon-usage-table";

const selectClass =
  "focus:border-brand min-h-11 rounded-xl border bg-white px-3 text-sm focus:outline-none";

export function CouponUsageSection({ couponId }: { couponId: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = parseCouponUsageQuery(searchParams);
  const usages = useCouponUsages(couponId, query);

  function update(values: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(values).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

    if (!("usagePage" in values)) params.delete("usagePage");

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }

  const pagination = usages.data?.pagination;

  return (
    <section className="border-brand/10 mt-8 rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-accent text-xs font-bold tracking-[.16em] uppercase">
            Usage history
          </p>
          <h2 className="text-brand-dark mt-2 font-serif text-2xl font-semibold">
            利用履歴
          </h2>
          <p className="text-muted-foreground mt-2 text-xs">
            取消は注文キャンセル処理が記録します。手動取消操作はありません。
          </p>
        </div>
        <label className="grid gap-2 text-sm font-semibold">
          取消状態
          <select
            className={selectClass}
            value={query.isReversed === undefined ? "" : String(query.isReversed)}
            onChange={(event) => update({ isReversed: event.target.value || undefined })}
          >
            <option value="">すべて</option>
            <option value="false">有効な利用</option>
            <option value="true">取消済み</option>
          </select>
        </label>
      </div>

      {usages.isPending ? (
        <div className="mt-5 grid gap-3">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : null}

      {usages.error ? (
        <Alert className="mt-5" variant="error" title="利用履歴を読み込めませんでした">
          <p>{normalizeApiError(usages.error).message}</p>
          <Button className="mt-3" size="sm" onClick={() => void usages.refetch()}>
            再試行
          </Button>
        </Alert>
      ) : null}

      {usages.data?.items.length === 0 ? (
        <EmptyState
          className="mt-5 max-w-none py-10"
          title="利用履歴はありません"
          description="選択した条件に一致するクーポン利用はまだありません。"
        />
      ) : null}

      {usages.data?.items.length ? (
        <div className={usages.isFetching ? "opacity-70" : undefined}>
          <CouponUsageTable usages={usages.data.items} />
        </div>
      ) : null}

      {pagination && pagination.totalPages > 1 ? (
        <nav
          className="mt-5 flex items-center justify-center gap-3"
          aria-label="クーポン利用履歴ページ"
        >
          <Button
            variant="secondary"
            disabled={pagination.page <= 1 || usages.isFetching}
            onClick={() => update({ usagePage: String(pagination.page - 1) })}
          >
            前へ
          </Button>
          <span className="text-sm">
            {pagination.page} / {pagination.totalPages}（{pagination.total}件）
          </span>
          <Button
            variant="secondary"
            disabled={pagination.page >= pagination.totalPages || usages.isFetching}
            onClick={() => update({ usagePage: String(pagination.page + 1) })}
          >
            次へ
          </Button>
        </nav>
      ) : null}
    </section>
  );
}
