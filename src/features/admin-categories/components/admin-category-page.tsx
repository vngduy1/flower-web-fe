"use client";

import { useState } from "react";
import Link from "next/link";

import { Alert, Button, EmptyState, Skeleton } from "@/components/ui";
import type { Category } from "@/features/categories/types/category";
import { normalizeApiError } from "@/lib/api";
import { formatDateTime } from "@/lib/format/date";

import { useAdminCategories, useRestoreCategory } from "../hooks/use-admin-categories";
import { CategoryActionDialog } from "./category-action-dialog";
import { CategoryFormDialog } from "./category-form-dialog";
import { CategoryStatusBadge } from "./category-status-badge";

interface DeletedCategory {
  id: string;
  name: string;
}

interface CategoryActionsProps {
  category: Category;
  onEdit: (category: Category) => void;
  onStatus: (category: Category) => void;
  onDelete: (category: Category) => void;
}

function CategoryActions({ category, onDelete, onEdit, onStatus }: CategoryActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant="secondary"
        aria-label={`${category.name}を編集`}
        onClick={() => onEdit(category)}
      >
        編集
      </Button>
      <Button
        size="sm"
        variant={category.isActive ? "ghost" : "secondary"}
        aria-label={`${category.name}を${category.isActive ? "無効化" : "有効化"}`}
        onClick={() => onStatus(category)}
      >
        {category.isActive ? "無効化" : "有効化"}
      </Button>
      <Button
        size="sm"
        variant="danger"
        aria-label={`${category.name}を削除`}
        onClick={() => onDelete(category)}
      >
        削除
      </Button>
    </div>
  );
}

function CategoryListSkeleton() {
  return (
    <div className="mt-6 grid gap-3" role="status" aria-label="カテゴリを読み込み中">
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} className="h-28 rounded-2xl" />
      ))}
    </div>
  );
}

export function AdminCategoryPage() {
  const query = useAdminCategories();
  const categories = query.data?.items ?? [];
  const restoreMutation = useRestoreCategory();
  const [formTarget, setFormTarget] = useState<{ category?: Category } | null>(null);
  const [actionTarget, setActionTarget] = useState<{
    action: "status" | "delete";
    category: Category;
  } | null>(null);
  const [deletedCategory, setDeletedCategory] = useState<DeletedCategory | null>(null);
  const restoreError = restoreMutation.error
    ? normalizeApiError(restoreMutation.error)
    : null;

  async function restoreDeletedCategory() {
    if (!deletedCategory) return;

    try {
      await restoreMutation.mutateAsync(deletedCategory.id);
      setDeletedCategory(null);
    } catch {
      // Keep the normalized backend error visible so the operation can be retried.
    }
  }

  function handleDeleted(category: DeletedCategory) {
    restoreMutation.reset();
    setDeletedCategory(category);
  }

  return (
    <div className="mx-auto max-w-375">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-accent text-xs font-bold tracking-[.18em] uppercase">
            Category operations
          </p>
          <h1 className="text-brand-dark mt-2 font-serif text-3xl font-semibold">
            カテゴリ管理
          </h1>
          <p className="text-muted-foreground mt-3 max-w-3xl text-sm leading-7">
            商品カテゴリの階層や公開状態を管理します。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/categories/deleted"
            className="border-brand/20 text-brand hover:bg-brand-soft rounded-full border bg-white px-5 py-3 text-sm font-semibold"
          >
            削除済みカテゴリ一覧
          </Link>

          <Button onClick={() => setFormTarget({})}>カテゴリを作成</Button>
        </div>
      </div>

      {deletedCategory ? (
        <Alert
          className="mt-4"
          variant={restoreError ? "error" : "success"}
          title={restoreError ? "復元できませんでした" : "カテゴリを削除しました"}
        >
          <p>
            {restoreError
              ? restoreError.message
              : `「${deletedCategory.name}」はソフトデリートされました。`}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              isLoading={restoreMutation.isPending}
              onClick={() => void restoreDeletedCategory()}
            >
              復元する
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={restoreMutation.isPending}
              onClick={() => setDeletedCategory(null)}
            >
              閉じる
            </Button>
          </div>
        </Alert>
      ) : null}

      <section
        className="border-brand/10 mt-8 rounded-3xl border bg-white p-5 shadow-sm sm:p-7"
        aria-labelledby="category-list-title"
      >
        <div>
          <p className="text-accent text-xs font-bold tracking-[.16em] uppercase">
            Categories
          </p>
          <h2
            id="category-list-title"
            className="text-brand-dark mt-2 font-serif text-2xl font-semibold"
          >
            カテゴリ一覧
          </h2>
        </div>

        {query.isPending ? <CategoryListSkeleton /> : null}
        {query.error ? (
          <Alert className="mt-6" variant="error" title="カテゴリを読み込めませんでした">
            <p>{normalizeApiError(query.error).message}</p>
            <Button className="mt-3" size="sm" onClick={() => void query.refetch()}>
              再試行
            </Button>
          </Alert>
        ) : null}
        {!query.isPending && !query.error && categories.length === 0 ? (
          <EmptyState
            className="mt-6"
            headingLevel="h2"
            title="カテゴリはありません"
            description="カテゴリが登録されていません。"
            action={
              <Button onClick={() => setFormTarget({})}>最初のカテゴリを作成</Button>
            }
          />
        ) : null}

        {categories.length > 0 ? (
          <>
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
                      <dt className="text-muted-foreground text-xs">子カテゴリ</dt>
                      <dd className="mt-1 font-medium">{category.children.length}件</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-muted-foreground text-xs">更新日時</dt>
                      <dd className="mt-1">{formatDateTime(category.updatedAt)}</dd>
                    </div>
                  </dl>
                  <div className="mt-4">
                    <CategoryActions
                      category={category}
                      onEdit={(target) => setFormTarget({ category: target })}
                      onStatus={(target) =>
                        setActionTarget({ action: "status", category: target })
                      }
                      onDelete={(target) =>
                        setActionTarget({ action: "delete", category: target })
                      }
                    />
                  </div>
                </article>
              ))}
            </div>

            <div className="border-brand/10 mt-6 hidden overflow-x-auto rounded-2xl border md:block">
              <table className="w-full min-w-[900px] text-left text-sm">
                <caption className="sr-only">カテゴリ一覧</caption>
                <thead className="bg-brand-soft/35 text-muted-foreground text-xs">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      カテゴリ
                    </th>
                    <th scope="col" className="px-4 py-3">
                      親カテゴリ
                    </th>
                    <th scope="col" className="px-4 py-3">
                      子カテゴリ
                    </th>
                    <th scope="col" className="px-4 py-3">
                      状態
                    </th>
                    <th scope="col" className="px-4 py-3">
                      作成・更新日時
                    </th>
                    <th scope="col" className="px-4 py-3">
                      <span className="sr-only">操作</span>
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
                        <p>{category.children.length}件</p>
                        {category.children.length ? (
                          <p className="text-muted-foreground mt-1 max-w-56 text-xs">
                            {category.children.map((child) => child.name).join("、")}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-4 py-4">
                        <CategoryStatusBadge isActive={category.isActive} />
                      </td>
                      <td className="px-4 py-4 text-xs">
                        <p>作成 {formatDateTime(category.createdAt)}</p>
                        <p className="text-muted-foreground mt-1">
                          更新 {formatDateTime(category.updatedAt)}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <CategoryActions
                          category={category}
                          onEdit={(target) => setFormTarget({ category: target })}
                          onStatus={(target) =>
                            setActionTarget({ action: "status", category: target })
                          }
                          onDelete={(target) =>
                            setActionTarget({ action: "delete", category: target })
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </section>

      {formTarget ? (
        <CategoryFormDialog
          category={formTarget.category}
          categories={categories}
          onClose={() => setFormTarget(null)}
        />
      ) : null}
      {actionTarget ? (
        <CategoryActionDialog
          action={actionTarget.action}
          category={actionTarget.category}
          onDeleted={handleDeleted}
          onClose={() => setActionTarget(null)}
        />
      ) : null}
    </div>
  );
}
