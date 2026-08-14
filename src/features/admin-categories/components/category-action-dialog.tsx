"use client";

import { useEffect, useRef } from "react";

import { Alert, Button } from "@/components/ui";
import type { Category } from "@/features/categories/types/category";
import { normalizeApiError } from "@/lib/api";

import { useDeleteCategory, useUpdateCategory } from "../hooks/use-admin-categories";

type CategoryAction = "status" | "delete";

export function CategoryActionDialog({
  action,
  category,
  onClose,
  onDeleted,
}: {
  action: CategoryAction;
  category: Category;
  onClose: () => void;
  onDeleted: (category: Pick<Category, "id" | "name">) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const updateMutation = useUpdateCategory(category.id);
  const deleteMutation = useDeleteCategory();
  const mutation = action === "delete" ? deleteMutation : updateMutation;
  const error = mutation.error ? normalizeApiError(mutation.error) : null;
  const isDisabling = action === "status" && category.isActive;
  const title =
    action === "delete"
      ? "カテゴリを削除しますか？"
      : isDisabling
        ? "カテゴリを無効にしますか？"
        : "カテゴリを有効にしますか？";

  useEffect(() => {
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  }, []);

  async function confirm() {
    try {
      if (action === "delete") {
        await deleteMutation.mutateAsync(category.id);
        onDeleted({ id: category.id, name: category.name });
      } else {
        await updateMutation.mutateAsync({ isActive: !category.isActive });
      }
      dialogRef.current?.close();
    } catch {
      // Keep the normalized backend error visible so the operation can be retried.
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="bg-surface text-foreground m-auto w-[min(92vw,560px)] rounded-3xl border p-0 shadow-2xl backdrop:bg-black/40"
      aria-labelledby="category-action-title"
      aria-describedby="category-action-description"
      onCancel={(event) => {
        if (mutation.isPending) event.preventDefault();
      }}
      onClose={onClose}
    >
      <div className="p-6 sm:p-8">
        <p className="text-accent text-xs font-bold tracking-[.16em] uppercase">
          Confirmation
        </p>
        <h2
          id="category-action-title"
          className="text-brand-dark mt-3 font-serif text-2xl font-semibold"
        >
          {title}
        </h2>
        <p
          id="category-action-description"
          className="text-muted-foreground mt-3 text-sm"
        >
          対象: {category.name}
        </p>
        {action === "delete" ? (
          <Alert className="mt-5" variant="warning" title="ソフトデリートです">
            子カテゴリが存在する場合は削除できません。削除後も同じスラッグは予約され、
            この画面を離れるまでは復元できます。
          </Alert>
        ) : isDisabling ? (
          <Alert className="mt-5" variant="warning">
            無効化は商品へ自動反映されませんが、新規の商品登録・更新ではこのカテゴリを選択できなくなります。
          </Alert>
        ) : null}
        {error ? (
          <Alert className="mt-5" variant="error" title="操作を完了できませんでした">
            {error.messages.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </Alert>
        ) : null}
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            disabled={mutation.isPending}
            onClick={() => dialogRef.current?.close()}
          >
            キャンセル
          </Button>
          <Button
            variant={action === "delete" || isDisabling ? "danger" : "primary"}
            isLoading={mutation.isPending}
            onClick={() => void confirm()}
          >
            {action === "delete" ? "削除する" : isDisabling ? "無効にする" : "有効にする"}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
