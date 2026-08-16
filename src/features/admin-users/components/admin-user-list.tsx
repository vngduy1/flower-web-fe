"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { Alert, Button, EmptyState, Skeleton } from "@/components/ui";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { normalizeApiError } from "@/lib/api";

import { useAdminUsers } from "../hooks/use-admin-users";
import { parseAdminUserId, parseAdminUserQuery } from "../utils/admin-user";
import { AdminUserFilters } from "./admin-user-filters";
import { AdminUserTable } from "./admin-user-table";
import { RestoreUserDialog } from "./restore-user-dialog";

export function AdminUserList() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: currentUser } = useAuth();
  const query = parseAdminUserQuery(searchParams);
  const users = useAdminUsers(query);
  const deletedId = parseAdminUserId(searchParams.get("deletedId"));
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

  const pagination = users.data?.pagination;

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

  return (
    <div className="mx-auto max-w-375">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-accent text-xs font-bold tracking-[.18em] uppercase">
            User management
          </p>
          <h1 className="text-brand-dark mt-2 font-serif text-3xl font-semibold">
            ユーザー管理
          </h1>
          <p className="text-muted-foreground mt-3 text-sm">
            アカウント、ロール、利用状態を管理します。
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="bg-brand hover:bg-brand-dark inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-white shadow-sm"
        >
          ユーザーを作成
        </Link>
      </div>

      {deletedId ? (
        <Alert className="mt-6" variant="warning" title="削除済みユーザーの復元">
          <p>
            ユーザーID {deletedId}{" "}
            が削除済みの場合は復元できます。現在有効な場合は拒否されます。
          </p>
          <div className="mt-3">
            <RestoreUserDialog userId={deletedId} />
          </div>
        </Alert>
      ) : null}

      <AdminUserFilters key={query.keyword ?? ""} query={query} update={update} />

      {users.isPending ? (
        <div
          className="mt-6 grid gap-3"
          role="status"
          aria-label="ユーザー一覧を読み込んでいます"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : null}

      {users.error ? (
        <Alert
          className="mt-6"
          variant="error"
          title="ユーザー一覧を読み込めませんでした"
        >
          <p>{normalizeApiError(users.error).message}</p>
          <Button className="mt-3" size="sm" onClick={() => void users.refetch()}>
            再試行
          </Button>
        </Alert>
      ) : null}

      {!users.error && users.data?.items.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            headingLevel="h2"
            title="該当するユーザーはいません"
            description="検索条件を変更するか、新しいユーザーを作成してください。"
            action={
              <Link
                href="/admin/users/new"
                className="bg-brand inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-white"
              >
                ユーザーを作成
              </Link>
            }
          />
        </div>
      ) : null}

      {users.data?.items.length && currentUser ? (
        <div
          className={users.isFetching ? "opacity-70" : undefined}
          aria-busy={users.isFetching || undefined}
        >
          <AdminUserTable users={users.data.items} currentUserId={currentUser.id} />
        </div>
      ) : null}

      {pagination && pagination.totalPages > 1 ? (
        <nav
          className="mt-6 flex items-center justify-center gap-3"
          aria-label="ユーザー一覧ページ"
        >
          <Button
            variant="secondary"
            disabled={pagination.page <= 1 || users.isFetching}
            onClick={() => update({ page: String(pagination.page - 1) })}
          >
            前へ
          </Button>
          <span className="text-sm">
            {pagination.page} / {pagination.totalPages}（{pagination.total}件）
          </span>
          <Button
            variant="secondary"
            disabled={pagination.page >= pagination.totalPages || users.isFetching}
            onClick={() => update({ page: String(pagination.page + 1) })}
          >
            次へ
          </Button>
        </nav>
      ) : null}
    </div>
  );
}
