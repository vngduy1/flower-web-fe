"use client";

import { useState } from "react";

import { Button, Input } from "@/components/ui";

import type { AdminUserQuery } from "../types/admin-user";
import {
  ROLE_CODES,
  ROLE_LABELS,
  USER_STATUSES,
  USER_STATUS_LABELS,
} from "../utils/admin-user";

const selectClass =
  "focus:border-brand min-h-11 rounded-xl border bg-white px-3 text-sm shadow-sm focus:outline-none";

export function AdminUserFilters({
  query,
  update,
}: {
  query: AdminUserQuery;
  update: (values: Record<string, string | undefined>) => void;
}) {
  const [keyword, setKeyword] = useState(query.keyword ?? "");

  return (
    <section className="border-brand/10 mt-7 rounded-2xl border bg-white p-4 shadow-sm">
      <form
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(260px,1fr)_180px_180px_auto_auto] xl:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          update({ keyword: keyword.trim() || undefined });
        }}
      >
        <Input
          id="admin-user-keyword"
          label="キーワード"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="氏名・メール・電話番号"
        />
        <label className="grid gap-2 text-sm font-semibold">
          ロール
          <select
            className={selectClass}
            value={query.roleCode ?? ""}
            onChange={(event) => update({ roleCode: event.target.value || undefined })}
          >
            <option value="">すべて</option>
            {ROLE_CODES.map((roleCode) => (
              <option key={roleCode} value={roleCode}>
                {ROLE_LABELS[roleCode]}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          アカウント状態
          <select
            className={selectClass}
            value={query.status ?? ""}
            onChange={(event) => update({ status: event.target.value || undefined })}
          >
            <option value="">すべて</option>
            {USER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {USER_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </label>
        <Button type="submit">検索</Button>
        <Button
          variant="ghost"
          onClick={() => {
            setKeyword("");
            update({ keyword: undefined, roleCode: undefined, status: undefined });
          }}
        >
          条件をクリア
        </Button>
      </form>
    </section>
  );
}
