"use client";

import { useState } from "react";

import { Alert, Button, EmptyState, Skeleton } from "@/components/ui";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { normalizeApiError } from "@/lib/api/errors";

import { NotificationList } from "./notification-list";
import { useMarkAllNotificationsRead } from "../hooks/use-mark-all-notifications-read";
import { useNotifications } from "../hooks/use-notifications";

const PAGE_SIZE = 20;

export function NotificationsPageContent() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const notificationsQuery = useNotifications(
    { page, limit: PAGE_SIZE, ...(unreadOnly ? { unreadOnly: true } : {}) },
    Boolean(user),
  );
  const markAllMutation = useMarkAllNotificationsRead();
  const markAllError = markAllMutation.error
    ? normalizeApiError(markAllMutation.error)
    : null;

  if (notificationsQuery.isPending) {
    return (
      <div
        aria-busy="true"
        aria-label="通知を読み込み中"
        className="grid gap-4"
        role="status"
      >
        {[0, 1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-44 rounded-3xl" />
        ))}
      </div>
    );
  }

  if (notificationsQuery.error) {
    const error = normalizeApiError(notificationsQuery.error);

    return (
      <EmptyState
        title="通知を読み込めませんでした"
        description={error.message}
        code={error.statusCode ? String(error.statusCode) : "ERROR"}
        action={<Button onClick={() => void notificationsQuery.refetch()}>再試行</Button>}
      />
    );
  }

  const response = notificationsQuery.data;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(event) => {
              setUnreadOnly(event.target.checked);
              setPage(1);
            }}
            className="accent-brand size-4"
          />
          未読のみ表示
        </label>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-sm">
            未読 {response.unreadCount}件
          </span>
          {response.unreadCount > 0 ? (
            <Button
              size="sm"
              variant="secondary"
              isLoading={markAllMutation.isPending}
              onClick={() => markAllMutation.mutate()}
            >
              すべて既読にする
            </Button>
          ) : null}
        </div>
      </div>

      {markAllMutation.data ? (
        <Alert className="mb-5" variant="success">
          {markAllMutation.data.updatedCount}件の通知を既読にしました。
        </Alert>
      ) : null}
      {markAllError ? (
        <Alert className="mb-5" variant="error" title="通知を更新できませんでした">
          {markAllError.message}
        </Alert>
      ) : null}

      {response.items.length ? (
        <NotificationList notifications={response.items} isAdmin />
      ) : (
        <EmptyState
          title={unreadOnly ? "未読通知はありません" : "通知はまだありません"}
          description={
            unreadOnly
              ? "すべての通知を確認済みです。"
              : "注文やレビューの更新があると、ここに通知が届きます。"
          }
        />
      )}

      {response.pagination.totalPages > 1 ? (
        <nav
          className="mt-7 flex items-center justify-center gap-4"
          aria-label="通知ページ"
        >
          <Button
            size="sm"
            variant="secondary"
            disabled={page <= 1 || notificationsQuery.isFetching}
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
          >
            前へ
          </Button>
          <span className="text-muted-foreground text-sm">
            {response.pagination.page} / {response.pagination.totalPages}
          </span>
          <Button
            size="sm"
            variant="secondary"
            disabled={
              page >= response.pagination.totalPages || notificationsQuery.isFetching
            }
            onClick={() => setPage((current) => current + 1)}
          >
            次へ
          </Button>
        </nav>
      ) : null}
    </div>
  );
}
