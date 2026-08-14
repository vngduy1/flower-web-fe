"use client";

import { useState } from "react";

import { Button, Input } from "@/components/ui";

import type { AdminCouponQuery } from "../types/admin-coupon";

const selectClass =
  "focus:border-brand min-h-11 rounded-xl border bg-white px-3 text-sm shadow-sm focus:outline-none";

export function AdminCouponFilters({
  query,
  update,
}: {
  query: AdminCouponQuery;
  update: (values: Record<string, string | undefined>) => void;
}) {
  const [keyword, setKeyword] = useState(query.keyword ?? "");

  return (
    <section className="border-brand/10 mt-7 rounded-2xl border bg-white p-4 shadow-sm">
      <form
        className="grid gap-4 sm:grid-cols-[minmax(240px,1fr)_minmax(180px,auto)_auto_auto] sm:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          update({ keyword: keyword.trim() || undefined });
        }}
      >
        <Input
          id="admin-coupon-keyword"
          label="キーワード"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="コードまたはクーポン名"
        />
        <label className="grid gap-2 text-sm font-semibold">
          有効設定
          <select
            className={selectClass}
            value={query.isActive === undefined ? "" : String(query.isActive)}
            onChange={(event) => update({ isActive: event.target.value || undefined })}
          >
            <option value="">すべて</option>
            <option value="true">有効</option>
            <option value="false">無効</option>
          </select>
        </label>
        <Button type="submit">検索</Button>
        <Button
          variant="ghost"
          onClick={() => {
            setKeyword("");
            update({ keyword: undefined, isActive: undefined });
          }}
        >
          条件をクリア
        </Button>
      </form>
    </section>
  );
}
