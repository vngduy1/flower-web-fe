"use client";

import Link from "next/link";

import { Alert, Button, EmptyState, Skeleton } from "@/components/ui";
import { normalizeApiError } from "@/lib/api";
import { formatDateTime } from "@/lib/format/date";

import { useAdminCategories, useRestoreCategory } from "../hooks/use-admin-categories";
import { CategoryStatusBadge } from "./category-status-badge";

function CategoryListSkeleton() {
  return (
    <div
      className="mt-6 grid gap-3"
      role="status"
      aria-label="削除済みカテゴリを読み込み中"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} className="h-28 rounded-2xl" />
      ))}
    </div>
  );
}

export function DeletedCategoryList() {
  const query = useAdminCategories({
    deletedOnly: true,
  });

  const categories = query.data?.items ?? [];

  const restoreMutation = useRestoreCategory();

  async function handleRestore(id: string) {
    try {
      await restoreMutation.mutateAsync(id);
    } catch {
      // Error is displayed below.
    }
  }

  const restoreError = restoreMutation.error
    ? normalizeApiError(restoreMutation.error)
    : null;

  return (
    <div className="mx-auto max-w-375">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-accent text-xs font-bold tracking-[.18em] uppercase">
            Category operations
          </p>

          <h1 className="text-brand-dark mt-2 font-serif text-3xl font-semibold">
            削除済みカテゴリ一覧
          </h1>

          <p className="text-muted-foreground mt-3 max-w-3xl text-sm leading-7">
            削除されたカテゴリを確認し、必要に応じて復元できます。
          </p>
        </div>

        <Link
          href="/admin/categories"
          className="border-brand/20 text-brand hover:bg-brand-soft rounded-full border bg-white px-5 py-3 text-sm font-semibold"
        >
          カテゴリ一覧に戻る
        </Link>
      </div>

      {/* Restore error */}
      {restoreError ? (
        <Alert className="mt-6" variant="error" title="カテゴリを復元できませんでした">
          <p>{restoreError.message}</p>
        </Alert>
      ) : null}

      <section
        className="border-brand/10 mt-8 rounded-3xl border bg-white p-5 shadow-sm sm:p-7"
        aria-labelledby="deleted-category-list-title"
      >
        <div>
          <p className="text-accent text-xs font-bold tracking-[.16em] uppercase">
            Deleted categories
          </p>

          <h2
            id="deleted-category-list-title"
            className="text-brand-dark mt-2 font-serif text-2xl font-semibold"
          >
            削除済みカテゴリ
          </h2>
        </div>

        {/* Loading */}
        {query.isPending ? <CategoryListSkeleton /> : null}

        {/* Load error */}
        {query.error ? (
          <Alert
            className="mt-6"
            variant="error"
            title="削除済みカテゴリを読み込めませんでした"
          >
            <p>{normalizeApiError(query.error).message}</p>

            <Button className="mt-3" size="sm" onClick={() => void query.refetch()}>
              再試行
            </Button>
          </Alert>
        ) : null}

        {/* Empty */}
        {categories.length === 0 ? (
          <EmptyState
            className="mt-6"
            headingLevel="h2"
            title="削除済みカテゴリはありません"
            description="削除されたカテゴリがある場合、ここに表示されます。"
          />
        ) : null}

        {categories.length ? (
          <>
            {/* Mobile */}
            <div className="mt-6 grid gap-4 md:hidden">
              {categories.map((category) => (
                <article
                  key={category.id}
                  className="border-brand/10 rounded-2xl border p-4"
                  aria-label={category.name}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-brand-dark truncate font-semibold">
                        {category.name}
                      </h3>

                      <p className="text-muted-foreground mt-1 text-xs break-all">
                        {category.slug}
                      </p>
                    </div>

                    <CategoryStatusBadge isActive={category.isActive} />
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-muted-foreground text-xs">親カテゴリ</dt>
                      <dd className="mt-1 font-medium">
                        {category.parent?.name ?? "なし"}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-muted-foreground text-xs">削除日時</dt>
                      <dd className="mt-1 font-medium">
                        {category.deletedAt ? formatDateTime(category.deletedAt) : "—"}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 border-t pt-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      isLoading={restoreMutation.isPending}
                      onClick={() => void handleRestore(category.id)}
                    >
                      復元
                    </Button>
                  </div>
                </article>
              ))}
            </div>

            {/* Desktop */}
            <div className="border-brand/10 mt-6 hidden overflow-x-auto rounded-2xl border md:block">
              <table className="w-full min-w-[850px] text-left text-sm">
                <caption className="sr-only">削除済みカテゴリ一覧</caption>

                <thead className="bg-brand-soft/35 text-muted-foreground text-xs">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      カテゴリ
                    </th>
                    <th scope="col" className="px-4 py-3">
                      親カテゴリ
                    </th>
                    <th scope="col" className="px-4 py-3">
                      状態
                    </th>
                    <th scope="col" className="px-4 py-3">
                      削除日時
                    </th>
                    <th scope="col" className="px-4 py-3">
                      操作
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-brand/10 divide-y">
                  {categories.map((category) => (
                    <tr key={category.id} className="align-top">
                      <td className="px-4 py-4">
                        <p className="font-semibold">{category.name}</p>

                        <p className="text-muted-foreground mt-1 text-xs break-all">
                          {category.slug}
                        </p>

                        <p className="text-muted-foreground mt-1 text-[11px]">
                          ID: {category.id}
                        </p>
                      </td>

                      <td className="px-4 py-4">{category.parent?.name ?? "なし"}</td>

                      <td className="px-4 py-4">
                        <CategoryStatusBadge isActive={category.isActive} />
                      </td>

                      <td className="px-4 py-4 text-xs">
                        {category.deletedAt ? formatDateTime(category.deletedAt) : "—"}
                      </td>

                      <td className="px-4 py-4">
                        <Button
                          size="sm"
                          variant="secondary"
                          isLoading={restoreMutation.isPending}
                          onClick={() => void handleRestore(category.id)}
                        >
                          復元
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}
