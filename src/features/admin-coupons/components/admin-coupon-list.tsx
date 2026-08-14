"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Alert, Button, EmptyState, Skeleton } from "@/components/ui";
import { normalizeApiError } from "@/lib/api";

import { useAdminCoupons } from "../hooks/use-admin-coupons";
import { parseAdminCouponQuery } from "../utils/admin-coupon";
import { AdminCouponFilters } from "./admin-coupon-filters";
import { AdminCouponTable } from "./admin-coupon-table";

export function AdminCouponList() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = parseAdminCouponQuery(searchParams);
  const coupons = useAdminCoupons(query);

  function update(values: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    if (!("page" in values)) {
      params.delete("page");
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  const pagination = coupons.data?.pagination;

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-accent text-xs font-bold tracking-[.18em] uppercase">
            Coupon management
          </p>
          <h1 className="text-brand-dark mt-2 font-serif text-3xl font-semibold">
            クーポン管理
          </h1>
          <p className="text-muted-foreground mt-3 text-sm">
            クーポンの公開設定、利用条件、利用状況を管理します。
          </p>
        </div>
        <Link
          href="/admin/coupons/new"
          className="bg-brand hover:bg-brand-dark inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-white shadow-sm"
        >
          クーポンを作成
        </Link>
      </div>

      <AdminCouponFilters key={query.keyword ?? ""} query={query} update={update} />

      {coupons.isPending ? (
        <div className="mt-6 grid gap-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : null}

      {coupons.error ? (
        <Alert
          className="mt-6"
          variant="error"
          title="クーポン一覧を読み込めませんでした"
        >
          <p>{normalizeApiError(coupons.error).message}</p>
          <Button className="mt-3" size="sm" onClick={() => void coupons.refetch()}>
            再試行
          </Button>
        </Alert>
      ) : null}

      {coupons.data?.items.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="該当するクーポンはありません"
            description="検索条件を変更するか、新しいクーポンを作成してください。"
            action={
              <Link
                href="/admin/coupons/new"
                className="bg-brand inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-white"
              >
                クーポンを作成
              </Link>
            }
          />
        </div>
      ) : null}

      {coupons.data?.items.length ? (
        <div className={coupons.isFetching ? "opacity-70" : undefined}>
          <AdminCouponTable coupons={coupons.data.items} />
        </div>
      ) : null}

      {pagination && pagination.totalPages > 1 ? (
        <nav
          className="mt-6 flex items-center justify-center gap-3"
          aria-label="クーポン一覧ページ"
        >
          <Button
            variant="secondary"
            disabled={pagination.page <= 1 || coupons.isFetching}
            onClick={() => update({ page: String(pagination.page - 1) })}
          >
            前へ
          </Button>
          <span className="text-sm">
            {pagination.page} / {pagination.totalPages}（{pagination.total}件）
          </span>
          <Button
            variant="secondary"
            disabled={pagination.page >= pagination.totalPages || coupons.isFetching}
            onClick={() => update({ page: String(pagination.page + 1) })}
          >
            次へ
          </Button>
        </nav>
      ) : null}
    </div>
  );
}
