"use client";

import { useState } from "react";

import { Button, Input } from "@/components/ui";
import {
  getOrderPaymentStatusLabel,
  getOrderStatusLabel,
} from "@/features/orders/utils/order-labels";

import type { AdminOrderQuery } from "../types/admin-order";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "../utils/admin-order";

const selectClass =
  "min-h-11 rounded-xl border bg-white px-3 text-sm focus:border-brand focus:outline-none";

export function AdminOrderFilters({
  query,
  update,
}: {
  query: AdminOrderQuery;
  update: (values: Record<string, string | undefined>) => void;
}) {
  const [keyword, setKeyword] = useState(query.keyword ?? "");

  return (
    <section className="border-brand/10 mt-7 rounded-2xl border bg-white p-4 shadow-sm">
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          update({ keyword: keyword.trim() || undefined });
        }}
      >
        <div className="grid gap-3 xl:grid-cols-[minmax(230px,1.5fr)_repeat(4,minmax(145px,1fr))_auto]">
          <Input
            id="admin-order-keyword"
            label="検索"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="注文番号・顧客名・メール・電話"
          />
          <label className="grid gap-2 text-sm font-semibold">
            注文ステータス
            <select
              className={selectClass}
              value={query.status ?? ""}
              onChange={(event) => update({ status: event.target.value || undefined })}
            >
              <option value="">すべて</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {getOrderStatusLabel(status)}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            支払い状態
            <select
              className={selectClass}
              value={query.paymentStatus ?? ""}
              onChange={(event) =>
                update({ paymentStatus: event.target.value || undefined })
              }
            >
              <option value="">すべて</option>
              {PAYMENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {getOrderPaymentStatusLabel(status)}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            並び順
            <select
              className={selectClass}
              value={query.sortBy ?? "createdAt"}
              onChange={(event) => update({ sortBy: event.target.value })}
            >
              <option value="createdAt">注文日時</option>
              <option value="updatedAt">更新日時</option>
              <option value="deliveryDate">配送日</option>
              <option value="totalAmount">合計金額</option>
              <option value="orderNumber">注文番号</option>
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
          <div className="flex items-end">
            <Button type="submit">検索</Button>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(145px,1fr))_auto]">
          <Input
            id="order-created-from"
            label="注文日（開始）"
            type="date"
            value={query.createdFrom ?? ""}
            onChange={(event) => update({ createdFrom: event.target.value || undefined })}
          />
          <Input
            id="order-created-to"
            label="注文日（終了）"
            type="date"
            value={query.createdTo ?? ""}
            onChange={(event) => update({ createdTo: event.target.value || undefined })}
          />
          <Input
            id="order-delivery-from"
            label="配送日（開始）"
            type="date"
            value={query.deliveryFrom ?? ""}
            onChange={(event) =>
              update({ deliveryFrom: event.target.value || undefined })
            }
          />
          <Input
            id="order-delivery-to"
            label="配送日（終了）"
            type="date"
            value={query.deliveryTo ?? ""}
            onChange={(event) => update({ deliveryTo: event.target.value || undefined })}
          />
          <div className="flex items-end">
            <Button
              variant="ghost"
              onClick={() => {
                setKeyword("");
                update({
                  keyword: undefined,
                  status: undefined,
                  paymentStatus: undefined,
                  createdFrom: undefined,
                  createdTo: undefined,
                  deliveryFrom: undefined,
                  deliveryTo: undefined,
                  sortBy: undefined,
                  sortOrder: undefined,
                });
              }}
            >
              条件をクリア
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
