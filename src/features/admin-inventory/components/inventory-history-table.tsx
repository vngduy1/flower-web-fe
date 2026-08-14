"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Alert, Button, Skeleton } from "@/components/ui";
import { normalizeApiError } from "@/lib/api";
import { formatDateTime } from "@/lib/format/date";

import { useInventoryHistory } from "../hooks/use-inventory";
import { CHANGE_TYPE_LABELS, parseHistoryQuery } from "../utils/inventory";

export function InventoryHistoryTable({ productId }: { productId: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const query = parseHistoryQuery(searchParams);
  const history = useInventoryHistory(productId, query);

  function update(values: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(values).forEach(([key, value]) =>
      value ? params.set(key, value) : params.delete(key),
    );
    if (!("historyPage" in values)) params.delete("historyPage");
    router.push(`${pathname}?${params.toString()}#inventory-history`);
  }

  const pagination = history.data?.pagination;
  return (
    <section
      id="inventory-history"
      className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-semibold">在庫履歴</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            在庫の変更履歴を新しい順に表示します。
          </p>
        </div>
        <label className="grid gap-2 text-sm font-semibold">
          変更種別
          <select
            className="min-h-10 rounded-xl border bg-white px-3 text-sm"
            value={query.changeType ?? ""}
            onChange={(event) => update({ changeType: event.target.value || undefined })}
          >
            <option value="">すべて</option>
            {Object.entries(CHANGE_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {history.isPending ? (
        <div className="mt-5 grid gap-3">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : null}
      {history.error ? (
        <Alert className="mt-5" variant="error">
          {normalizeApiError(history.error).message}
          <Button className="mt-3" size="sm" onClick={() => void history.refetch()}>
            再試行
          </Button>
        </Alert>
      ) : null}
      {history.data?.items.length === 0 ? (
        <p className="text-muted-foreground mt-5 rounded-xl bg-slate-50 p-5 text-sm">
          該当する履歴はありません。
        </p>
      ) : null}
      {history.data?.items.length ? (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-brand-soft/30 text-xs">
              <tr>
                <th className="p-3">日時</th>
                <th className="p-3">種別</th>
                <th className="p-3">変更前</th>
                <th className="p-3">差分</th>
                <th className="p-3">変更後</th>
                <th className="p-3">理由</th>
                <th className="p-3">操作者</th>
              </tr>
            </thead>
            <tbody>
              {history.data.items.map((item) => (
                <tr key={item.id} className="border-brand/10 border-t">
                  <td className="p-3 text-xs">{formatDateTime(item.createdAt)}</td>
                  <td className="p-3">{CHANGE_TYPE_LABELS[item.changeType]}</td>
                  <td className="p-3">{item.quantityBefore}</td>
                  <td
                    className={`p-3 font-semibold ${item.quantityChange < 0 ? "text-red-700" : item.quantityChange > 0 ? "text-emerald-700" : ""}`}
                  >
                    {item.quantityChange > 0 ? "+" : ""}
                    {item.quantityChange}
                  </td>
                  <td className="p-3">{item.quantityAfter}</td>
                  <td className="p-3">{item.reason ?? "—"}</td>
                  <td className="p-3">
                    {item.changedBy ? (
                      <>
                        <p>{item.changedBy.fullName}</p>
                        <p className="text-muted-foreground text-xs">
                          {item.changedBy.email}
                        </p>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {pagination && pagination.totalPages > 1 ? (
        <nav
          className="mt-5 flex items-center justify-center gap-3"
          aria-label="在庫履歴ページ"
        >
          <Button
            size="sm"
            variant="secondary"
            disabled={pagination.page <= 1}
            onClick={() => update({ historyPage: String(pagination.page - 1) })}
          >
            前へ
          </Button>
          <span className="text-sm">
            {pagination.page} / {pagination.totalPages}（{pagination.total}件）
          </span>
          <Button
            size="sm"
            variant="secondary"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => update({ historyPage: String(pagination.page + 1) })}
          >
            次へ
          </Button>
        </nav>
      ) : null}
    </section>
  );
}
