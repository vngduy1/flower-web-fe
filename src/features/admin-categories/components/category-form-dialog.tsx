"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { Alert, Button, Input } from "@/components/ui";
import type { Category } from "@/features/categories/types/category";
import { normalizeApiError } from "@/lib/api";

import { useCreateCategory, useUpdateCategory } from "../hooks/use-admin-categories";
import {
  categoryFormSchema,
  type CategoryFormValues,
} from "../schemas/admin-category.schema";

export function CategoryFormDialog({
  categories,
  category,
  onClose,
}: {
  categories: Category[];
  category?: Category;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory(category?.id ?? "");
  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error ?? updateMutation.error;
  const error = mutationError ? normalizeApiError(mutationError) : null;
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      parentId: category?.parentId ?? "",
      isActive: category?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  }, []);

  const submit: SubmitHandler<CategoryFormValues> = async (values) => {
    try {
      const commonRequest = {
        name: values.name,
        slug: values.slug,
        isActive: values.isActive,
      };

      if (category) {
        await updateMutation.mutateAsync({
          ...commonRequest,
          parentId: values.parentId,
        });
      } else {
        await createMutation.mutateAsync({
          ...commonRequest,
          ...(values.parentId ? { parentId: values.parentId } : {}),
        });
      }

      dialogRef.current?.close();
    } catch {
      // Keep the normalized backend error visible so the operation can be retried.
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="bg-surface text-foreground m-auto w-[min(94vw,680px)] rounded-3xl border p-0 shadow-2xl backdrop:bg-black/40"
      aria-labelledby="category-form-title"
      onCancel={(event) => {
        if (isPending) event.preventDefault();
      }}
      onClose={onClose}
    >
      <form
        className="p-6 sm:p-8"
        onSubmit={(event) => void form.handleSubmit(submit)(event)}
        noValidate
      >
        <p className="text-accent text-xs font-bold tracking-[.16em] uppercase">
          Category
        </p>
        <h2
          id="category-form-title"
          className="text-brand-dark mt-3 font-serif text-2xl font-semibold"
        >
          カテゴリを{category ? "編集" : "作成"}
        </h2>
        {error ? (
          <Alert className="mt-5" variant="error" title="保存できませんでした">
            {error.messages.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </Alert>
        ) : null}
        <div className="mt-6 grid items-start gap-5 sm:grid-cols-2">
          <Input
            id="category-name"
            label="カテゴリ名"
            required
            maxLength={100}
            error={form.formState.errors.name?.message}
            {...form.register("name")}
          />

          <Input
            id="category-slug"
            label="スラッグ"
            hint="保存時に小文字化され、空白はハイフンに変換されます。"
            required
            maxLength={120}
            error={form.formState.errors.slug?.message}
            {...form.register("slug")}
          />
        </div>
        <div className="mt-5 grid gap-2">
          <label htmlFor="category-parent" className="text-sm font-semibold">
            親カテゴリ
          </label>
          <select
            id="category-parent"
            className="focus:border-brand min-h-11 w-full rounded-xl border bg-white px-3.5 text-base shadow-sm focus:outline-none sm:text-sm"
            {...form.register("parentId")}
          >
            <option value="">なし</option>
            {categories
              .filter((candidate) => candidate.id !== category?.id && candidate.isActive)
              .map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.name}
                  {candidate.isActive ? "" : "（無効）"}
                </option>
              ))}
          </select>
          <p className="text-muted-foreground text-sm">
            カテゴリが循環する親子関係になるような設定はできません。
          </p>
        </div>
        <label className="mt-5 flex min-h-11 items-center gap-3 text-sm font-semibold">
          <input type="checkbox" className="size-4" {...form.register("isActive")} />
          有効にする
        </label>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            disabled={isPending}
            onClick={() => dialogRef.current?.close()}
          >
            キャンセル
          </Button>
          <Button type="submit" isLoading={isPending}>
            {category ? "変更を保存" : "カテゴリを作成"}
          </Button>
        </div>
      </form>
    </dialog>
  );
}
