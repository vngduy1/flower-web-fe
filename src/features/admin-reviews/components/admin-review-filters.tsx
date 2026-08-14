"use client";

import { useState } from "react";

import { Button, Input } from "@/components/ui";

import type { AdminReviewQuery } from "../types/admin-review";
import {
  ADMIN_REVIEW_SORT_FIELDS,
  ADMIN_REVIEW_SORT_LABELS,
  REVIEW_STATUSES,
  REVIEW_STATUS_LABELS,
} from "../utils/admin-review";

const selectClass =
  "focus:border-brand min-h-11 rounded-xl border bg-white px-3 text-sm focus:outline-none";

export function AdminReviewFilters({
  query,
  update,
}: {
  query: AdminReviewQuery;
  update: (values: Record<string, string | undefined>) => void;
}) {
  const [keyword, setKeyword] = useState(query.keyword ?? "");
  const [productId, setProductId] = useState(query.productId ?? "");
  const [userId, setUserId] = useState(query.userId ?? "");

  return (
    <section className="border-brand/10 mt-7 rounded-2xl border bg-white p-4 shadow-sm">
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          update({
            keyword: keyword.trim() || undefined,
            productId: productId.trim() || undefined,
            userId: userId.trim() || undefined,
          });
        }}
      >
        <div className="grid gap-3 xl:grid-cols-[minmax(230px,1.5fr)_minmax(130px,.7fr)_minmax(130px,.7fr)_auto] xl:items-end">
          <Input
            id="admin-review-keyword"
            label="キーワード"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="タイトル・本文・商品・顧客・注文番号"
          />
          <Input
            id="admin-review-product-id"
            label="商品ID"
            value={productId}
            onChange={(event) => setProductId(event.target.value)}
          />
          <Input
            id="admin-review-user-id"
            label="顧客ID"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
          />
          <Button type="submit">検索</Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[repeat(6,minmax(130px,1fr))_auto] xl:items-end">
          <label className="grid gap-2 text-sm font-semibold">
            審査状態
            <select
              className={selectClass}
              value={query.status ?? ""}
              onChange={(event) => update({ status: event.target.value || undefined })}
            >
              <option value="">すべて</option>
              {REVIEW_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {REVIEW_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            評価
            <select
              className={selectClass}
              value={query.rating ?? ""}
              onChange={(event) => update({ rating: event.target.value || undefined })}
            >
              <option value="">すべて</option>
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating}点
                </option>
              ))}
            </select>
          </label>
          <Input
            id="admin-review-created-from"
            label="作成日（開始）"
            type="date"
            value={query.createdFrom ?? ""}
            onChange={(event) => update({ createdFrom: event.target.value || undefined })}
          />
          <Input
            id="admin-review-created-to"
            label="作成日（終了）"
            type="date"
            value={query.createdTo ?? ""}
            onChange={(event) => update({ createdTo: event.target.value || undefined })}
          />
          <label className="grid gap-2 text-sm font-semibold">
            並び順
            <select
              className={selectClass}
              value={query.sortBy ?? "createdAt"}
              onChange={(event) => update({ sortBy: event.target.value })}
            >
              {ADMIN_REVIEW_SORT_FIELDS.map((field) => (
                <option key={field} value={field}>
                  {ADMIN_REVIEW_SORT_LABELS[field]}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            方向
            <select
              className={selectClass}
              value={query.sortOrder ?? "DESC"}
              onChange={(event) => update({ sortOrder: event.target.value })}
            >
              <option value="DESC">降順</option>
              <option value="ASC">昇順</option>
            </select>
          </label>
          <Button
            variant="ghost"
            onClick={() => {
              setKeyword("");
              setProductId("");
              setUserId("");
              update({
                keyword: undefined,
                productId: undefined,
                userId: undefined,
                status: undefined,
                rating: undefined,
                createdFrom: undefined,
                createdTo: undefined,
                sortBy: undefined,
                sortOrder: undefined,
              });
            }}
          >
            条件をクリア
          </Button>
        </div>
      </form>
    </section>
  );
}
