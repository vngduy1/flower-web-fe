"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { Alert, Button, EmptyState, Skeleton } from "@/components/ui";
import { normalizeApiError } from "@/lib/api";

import { useAdminReviews } from "../hooks/use-admin-reviews";
import { parseAdminReviewId, parseAdminReviewQuery } from "../utils/admin-review";
import { AdminReviewFilters } from "./admin-review-filters";
import { AdminReviewTable } from "./admin-review-table";
import { RestoreReviewDialog } from "./restore-review-dialog";

export function AdminReviewList() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = parseAdminReviewQuery(searchParams);
  const reviews = useAdminReviews(query);
  const deletedId = parseAdminReviewId(searchParams.get("deletedId"));
  const paginationCorrectionRef = useRef<string | null>(null);

  function update(values: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(values).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

    if (!("page" in values)) params.delete("page");
    params.delete("deletedId");

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  const pagination = reviews.data?.pagination;

  useEffect(() => {
    if (!pagination || pagination.page <= Math.max(pagination.totalPages, 1)) {
      paginationCorrectionRef.current = null;
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (pagination.totalPages > 1) {
      params.set("page", String(pagination.totalPages));
    } else {
      params.delete("page");
    }

    const queryString = params.toString();
    const destination = queryString ? `${pathname}?${queryString}` : pathname;

    if (paginationCorrectionRef.current !== destination) {
      paginationCorrectionRef.current = destination;
      router.replace(destination);
    }
  }, [pagination, pathname, router, searchParams]);

  const filterKey = JSON.stringify([
    query.keyword ?? null,
    query.productId ?? null,
    query.userId ?? null,
  ]);

  return (
    <div className="mx-auto max-w-375">
      <div>
        <p className="text-accent text-xs font-bold tracking-[.18em] uppercase">
          Review moderation
        </p>
        <h1 className="text-brand-dark mt-2 font-serif text-3xl font-semibold">
          レビュー管理
        </h1>
        <p className="text-muted-foreground mt-3 text-sm">
          商品レビューの内容を確認し、公開または非承認にします。
        </p>
      </div>

      {deletedId ? (
        <Alert className="mt-6" variant="warning" title="削除済みレビューの復元">
          <p>
            レビューID {deletedId}
            が削除済みの場合は復元できます。現在有効な場合が拒否されます。
          </p>
          <div className="mt-3">
            <RestoreReviewDialog reviewId={deletedId} />
          </div>
        </Alert>
      ) : null}

      <AdminReviewFilters key={filterKey} query={query} update={update} />

      {reviews.isPending ? (
        <div
          className="mt-6 grid gap-3"
          role="status"
          aria-label="レビュー一覧を読み込んでいます"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : null}

      {reviews.error ? (
        <Alert
          className="mt-6"
          variant="error"
          title="レビュー一覧を読み込めませんでした"
        >
          <p>{normalizeApiError(reviews.error).message}</p>
          <Button className="mt-3" size="sm" onClick={() => void reviews.refetch()}>
            再試行
          </Button>
        </Alert>
      ) : null}

      {!reviews.error && reviews.data?.items.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            headingLevel="h2"
            title="該当するレビューはありません"
            description="検索条件を変更してください。"
          />
        </div>
      ) : null}

      {reviews.data?.items.length ? (
        <div
          className={reviews.isFetching ? "opacity-70" : undefined}
          aria-busy={reviews.isFetching || undefined}
        >
          <AdminReviewTable reviews={reviews.data.items} />
        </div>
      ) : null}

      {pagination && pagination.totalPages > 1 ? (
        <nav
          className="mt-6 flex items-center justify-center gap-3"
          aria-label="レビュー一覧ページ"
        >
          <Button
            variant="secondary"
            disabled={pagination.page <= 1 || reviews.isFetching}
            onClick={() => update({ page: String(pagination.page - 1) })}
          >
            前へ
          </Button>
          <span className="text-sm">
            {pagination.page} / {pagination.totalPages}（{pagination.total}件）
          </span>
          <Button
            variant="secondary"
            disabled={pagination.page >= pagination.totalPages || reviews.isFetching}
            onClick={() => update({ page: String(pagination.page + 1) })}
          >
            次へ
          </Button>
        </nav>
      ) : null}
    </div>
  );
}
