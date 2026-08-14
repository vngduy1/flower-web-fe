"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Alert, Button, Input } from "@/components/ui";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { normalizeApiError } from "@/lib/api";

import { useCreateProduct, useUpdateProduct } from "../hooks/use-admin-products";
import {
  productFormSchema,
  type ProductFormValues,
} from "../schemas/admin-product.schema";
import type { ProductWritePayload } from "../types/admin-product";
import { PRODUCT_STATUS_LABELS } from "../utils/admin-product";
import type { AdminProduct } from "@/features/products/types/product";

const controlClass =
  "min-h-11 w-full rounded-xl border bg-white px-3.5 text-sm focus:border-brand focus:outline-none";
const sectionClass = "border-brand/10 rounded-2xl border bg-white p-5 shadow-sm sm:p-6";

function localDateTime(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function defaults(product?: AdminProduct): ProductFormValues {
  return {
    productCode: product?.productCode ?? "",
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    categoryId:
      product?.categoryId !== undefined && product?.categoryId !== null
        ? String(product.categoryId)
        : "",
    description: product?.description ?? "",
    basePrice: product?.basePrice ?? "",
    salePrice: product?.salePrice ?? "",
    costPrice: product?.costPrice ?? "",
    status: product?.status ?? "DRAFT",
    isFeatured: product?.isFeatured ?? false,
    availableFrom: localDateTime(product?.availableFrom ?? null),
    availableUntil: localDateTime(product?.availableUntil ?? null),
    preparationDays: product?.preparationDays ?? 0,
  };
}

function payload(values: ProductFormValues, isEdit: boolean): ProductWritePayload {
  return {
    productCode: values.productCode.trim(),
    name: values.name.trim(),
    slug: values.slug.trim(),
    categoryId: values.categoryId,
    description: values.description,
    basePrice: values.basePrice,
    ...(values.salePrice ? { salePrice: values.salePrice } : {}),
    ...(values.costPrice ? { costPrice: values.costPrice } : {}),
    ...(!isEdit ? { status: values.status } : {}),
    isFeatured: values.isFeatured,
    ...(values.availableFrom
      ? { availableFrom: new Date(values.availableFrom).toISOString() }
      : {}),
    ...(values.availableUntil
      ? { availableUntil: new Date(values.availableUntil).toISOString() }
      : {}),
    preparationDays: values.preparationDays,
  };
}

export function ProductForm({ product }: { product?: AdminProduct }) {
  const isEdit = Boolean(product);
  const router = useRouter();
  const categories = useCategories();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct(product?.id ?? "");
  const [success, setSuccess] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaults(product),
  });

  useEffect(() => {
    if (product) {
      form.reset(defaults(product));
    }
  }, [product, form]);

  const categoryItems = categories.data?.items ?? [];

  const visibleCategories = [
    ...categoryItems,
    ...(product?.category &&
    !categoryItems.some((category) => String(category.id) === String(product.categoryId))
      ? [product.category]
      : []),
  ];

  const mutation = isEdit ? updateMutation : createMutation;

  const error = mutation.error ? normalizeApiError(mutation.error) : null;

  const fieldError = (name: keyof ProductFormValues) =>
    form.formState.errors[name]?.message;

  async function submit(values: ProductFormValues) {
    setSuccess(false);

    try {
      if (isEdit && product) {
        const fullPayload = payload(values, true);
        const dirtyFields = form.formState.dirtyFields;
        const changedPayload: ProductWritePayload = {};

        for (const key of Object.keys(fullPayload) as (keyof ProductWritePayload)[]) {
          if (dirtyFields[key as keyof ProductFormValues]) {
            Object.assign(changedPayload, {
              [key]: fullPayload[key],
            });
          }
        }

        await updateMutation.mutateAsync(changedPayload);

        form.reset(values);
        setSuccess(true);

        return;
      }

      const created = await createMutation.mutateAsync(payload(values, false));

      router.push(`/admin/products/${created.id}?created=true`);
    } catch {
      return;
    }
  }

  return (
    <form className="grid gap-6" onSubmit={form.handleSubmit(submit)} noValidate>
      {success ? <Alert variant="success">商品情報を更新しました。</Alert> : null}
      {error ? (
        <Alert variant="error" title="保存できませんでした">
          {error.messages.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </Alert>
      ) : null}
      <section className={sectionClass}>
        <h2 className="text-brand-dark font-serif text-xl font-semibold">基本情報</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Input
            id="product-code"
            label="商品コード"
            required
            error={fieldError("productCode")}
            {...form.register("productCode")}
          />
          <Input
            id="product-name"
            label="商品名"
            required
            error={fieldError("name")}
            {...form.register("name")}
          />
          <Input
            id="product-slug"
            label="スラッグ"
            required
            error={fieldError("slug")}
            {...form.register("slug")}
          />
          <label className="grid gap-2 text-sm font-semibold">
            カテゴリー{" "}
            <span>
              <select className={controlClass} {...form.register("categoryId")}>
                <option value="">選択してください</option>

                {visibleCategories
                  .filter(
                    (category) =>
                      category.isActive ||
                      String(category.id) === String(product?.categoryId),
                  )
                  .map((category) => (
                    <option key={category.id} value={String(category.id)}>
                      {category.name}
                      {!category.isActive ? "（停止中）" : ""}
                    </option>
                  ))}
              </select>
              {fieldError("categoryId") ? (
                <span className="mt-2 block text-sm text-red-700">
                  {fieldError("categoryId")}
                </span>
              ) : null}
            </span>
          </label>
          <label className="grid gap-2 text-sm font-semibold sm:col-span-2">
            説明
            <textarea
              rows={7}
              className={`${controlClass} py-3`}
              {...form.register("description")}
            />
            {fieldError("description") ? (
              <span className="text-sm text-red-700">{fieldError("description")}</span>
            ) : null}
          </label>
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className="text-brand-dark font-serif text-xl font-semibold">価格</h2>
        <div className="mt-5 grid items-start gap-5 sm:grid-cols-3">
          <Input
            id="base-price"
            label="通常価格"
            type="number"
            min="0"
            step="0.01"
            required
            error={fieldError("basePrice")}
            {...form.register("basePrice")}
          />

          <Input
            id="sale-price"
            label="セール価格"
            type="number"
            min="0"
            step="0.01"
            error={fieldError("salePrice")}
            {...form.register("salePrice")}
          />

          <Input
            id="cost-price"
            label="原価"
            type="number"
            min="0"
            step="0.01"
            hint={
              isEdit ? "現在の原価です。変更する場合のみ編集してください。" : undefined
            }
            error={fieldError("costPrice")}
            {...form.register("costPrice")}
          />
        </div>
        {isEdit && product?.salePrice ? (
          <p className="text-muted-foreground mt-4 text-xs">
            現在のセール価格や公開期間は、変更しない場合は空欄のままにしてください。
          </p>
        ) : null}
      </section>

      <section className={sectionClass}>
        <h2 className="text-brand-dark font-serif text-xl font-semibold">
          公開・提供設定
        </h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {!isEdit ? (
            <label className="grid gap-2 text-sm font-semibold">
              初期ステータス
              <select className={controlClass} {...form.register("status")}>
                {Object.entries(PRODUCT_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <Input
            id="preparation-days"
            label="準備日数"
            type="number"
            min="0"
            max="365"
            error={fieldError("preparationDays")}
            {...form.register("preparationDays", { valueAsNumber: true })}
          />
          <Input
            id="available-from"
            label="提供開始日時"
            type="datetime-local"
            error={fieldError("availableFrom")}
            {...form.register("availableFrom")}
          />
          <Input
            id="available-until"
            label="提供終了日時"
            type="datetime-local"
            error={fieldError("availableUntil")}
            {...form.register("availableUntil")}
          />
          <label className="flex items-center gap-3 text-sm font-semibold">
            <input type="checkbox" className="size-4" {...form.register("isFeatured")} />
            注目商品として表示
          </label>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Link
          href={product ? `/admin/products/${product.id}` : "/admin/products"}
          className="border-brand/25 text-brand-dark inline-flex min-w-28 items-center justify-center rounded-full border bg-white px-6 py-3 text-sm font-semibold transition hover:bg-gray-50"
        >
          キャンセル
        </Link>

        <Button
          type="submit"
          className="min-w-28"
          isLoading={mutation.isPending}
          disabled={isEdit && !form.formState.isDirty}
        >
          {isEdit ? "変更を保存" : "商品を登録"}
        </Button>
      </div>
    </form>
  );
}
