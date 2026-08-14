"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Alert, Button, EmptyState, Skeleton } from "@/components/ui";
import { normalizeApiError } from "@/lib/api";

import { useAdminOrders } from "../hooks/use-admin-orders";
import { parseAdminOrderQuery } from "../utils/admin-order";
import { AdminOrderFilters } from "./admin-order-filters";
import { AdminOrderTable } from "./admin-order-table";

export function AdminOrderList() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const query = parseAdminOrderQuery(searchParams);
  const orders = useAdminOrders(query);

  function update(values: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(values).forEach(([key, value]) =>
      value ? params.set(key, value) : params.delete(key),
    );
    if (!("page" in values)) params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  const pagination = orders.data?.pagination;
  return (
    <div className="mx-auto max-w-[1500px]">
      <div>
        <p className="text-accent text-xs font-bold tracking-[.18em] uppercase">
          Order management
        </p>
        <h1 className="text-brand-dark mt-2 font-serif text-3xl font-semibold">
          注文管理
        </h1>
        <p className="text-muted-foreground mt-3 text-sm">
          注文、支払い、配送状況を確認し、許可された次の状態へ更新します。
        </p>
      </div>
      <AdminOrderFilters query={query} update={update} />
      {orders.isPending ? (
        <div className="mt-6 grid gap-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : null}
      {orders.error ? (
        <Alert className="mt-6" variant="error" title="注文一覧を読み込めませんでした">
          <p>{normalizeApiError(orders.error).message}</p>
          <Button className="mt-3" size="sm" onClick={() => void orders.refetch()}>
            再試行
          </Button>
        </Alert>
      ) : null}
      {orders.data?.items.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="該当する注文はありません"
            description="検索条件を変更してください。"
          />
        </div>
      ) : null}
      {orders.data?.items.length ? <AdminOrderTable orders={orders.data.items} /> : null}
      {pagination && pagination.totalPages > 1 ? (
        <nav
          className="mt-6 flex items-center justify-center gap-3"
          aria-label="注文一覧ページ"
        >
          <Button
            variant="secondary"
            disabled={pagination.page <= 1}
            onClick={() => update({ page: String(pagination.page - 1) })}
          >
            前へ
          </Button>
          <span className="text-sm">
            {pagination.page} / {pagination.totalPages}（{pagination.total}件）
          </span>
          <Button
            variant="secondary"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => update({ page: String(pagination.page + 1) })}
          >
            次へ
          </Button>
        </nav>
      ) : null}
    </div>
  );
}
