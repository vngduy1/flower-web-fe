"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Alert, Button, EmptyState, Skeleton } from "@/components/ui";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { formatYen } from "@/lib/format/currency";
import { formatDateTime } from "@/lib/format/date";
import { normalizeApiError } from "@/lib/api";

import { useAdminUser } from "../hooks/use-admin-users";
import { DeleteUserDialog } from "./delete-user-dialog";
import { UpdateUserRoleDialog } from "./update-user-role-dialog";
import { UpdateUserStatusDialog } from "./update-user-status-dialog";
import { UserRoleBadge } from "./user-role-badge";
import { UserStatusBadge } from "./user-status-badge";

export function AdminUserDetail({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const { user: currentUser } = useAuth();
  const detail = useAdminUser(id);

  if (detail.isPending) {
    return (
      <div
        className="grid gap-5"
        role="status"
        aria-label="ユーザー詳細を読み込んでいます"
      >
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (detail.error || !detail.data) {
    return (
      <EmptyState
        title="ユーザーを読み込めませんでした"
        description={normalizeApiError(detail.error).message}
        action={<Button onClick={() => void detail.refetch()}>再試行</Button>}
      />
    );
  }

  const user = detail.data;
  const isSelf = currentUser?.id === user.id;

  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/admin/users" className="text-brand text-sm font-semibold">
        ← ユーザー一覧
      </Link>

      {searchParams.get("created") === "true" ? (
        <Alert className="mt-5" variant="success">
          ユーザーを作成しました。パスワードは安全のため再表示されません。
        </Alert>
      ) : null}
      {searchParams.get("restored") === "true" ? (
        <Alert className="mt-5" variant="success">
          ユーザーを復元しました。
        </Alert>
      ) : null}
      {isSelf ? (
        <Alert className="mt-5" variant="info" title="現在ログイン中のアカウントです">
          自分自身のロール変更、状態変更、削除は禁止されています。
        </Alert>
      ) : null}

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-xs break-all">User ID {user.id}</p>
          <h1 className="text-brand-dark mt-2 font-serif text-3xl font-semibold">
            {user.fullName}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">{user.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <UserRoleBadge roleCode={user.role?.roleCode ?? null} />
          <UserStatusBadge status={user.status} />
        </div>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid content-start gap-6">
          <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-serif text-2xl font-semibold">アカウント情報</h2>
            <dl className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground text-xs">氏名</dt>
                <dd className="mt-1 font-semibold">{user.fullName}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">メールアドレス</dt>
                <dd className="mt-1 break-all">{user.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">電話番号</dt>
                <dd className="mt-1">{user.phone ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">ロール名</dt>
                <dd className="mt-1">{user.role?.roleName ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">登録日時</dt>
                <dd className="mt-1">{formatDateTime(user.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">更新日時</dt>
                <dd className="mt-1">{formatDateTime(user.updatedAt)}</dd>
              </div>
            </dl>
            <p className="text-muted-foreground mt-5 text-xs leading-6">
              管理者向けの氏名・メール・電話番号更新エンドポイントは公開されていないため、この画面では編集できません。
            </p>
          </section>

          <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-serif text-2xl font-semibold">注文サマリー</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="bg-brand-soft/35 rounded-2xl p-5">
                <p className="text-muted-foreground text-xs">総注文数</p>
                <p className="mt-2 text-2xl font-semibold">
                  {user.orderSummary.totalOrders.toLocaleString("ja-JP")}件
                </p>
              </div>
              <div className="bg-brand-soft/35 rounded-2xl p-5">
                <p className="text-muted-foreground text-xs">支払済み売上合計</p>
                <p className="mt-2 text-2xl font-semibold">
                  {formatYen(user.orderSummary.totalSpent)}
                </p>
              </div>
            </div>
            <p className="text-muted-foreground mt-4 text-xs leading-6">
              売上合計は、PAIDかつキャンセルされていない注文のみが集計しています。
            </p>
          </section>
        </div>

        <aside className="grid content-start gap-6">
          <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-serif text-xl font-semibold">ロール管理</h2>
            <p className="text-muted-foreground mt-2 text-xs leading-5">
              現在: {user.role?.roleName ?? "ロール情報なし"}
            </p>
            <div className="mt-4">
              <UpdateUserRoleDialog user={user} isSelf={isSelf} />
            </div>
          </section>

          <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-serif text-xl font-semibold">状態管理</h2>
            <div className="mt-4">
              <UpdateUserStatusDialog user={user} isSelf={isSelf} />
            </div>
          </section>

          <section className="rounded-2xl border border-red-200 bg-white p-5">
            <h2 className="font-semibold text-red-800">ユーザー削除</h2>
            <p className="text-muted-foreground mt-2 text-xs leading-5">
              ソフト削除を実行します。完全削除ではありません。
            </p>
            <div className="mt-4">
              <DeleteUserDialog
                userId={user.id}
                fullName={user.fullName}
                isSelf={isSelf}
              />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
