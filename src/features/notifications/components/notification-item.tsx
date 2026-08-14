"use client";

import Link from "next/link";

import { Alert, Button } from "@/components/ui";
import { normalizeApiError } from "@/lib/api/errors";
import { formatDateTime } from "@/lib/format/date";
import { cn } from "@/lib/utils/cn";

import { useMarkNotificationRead } from "../hooks/use-mark-notification-read";
import type { Notification, NotificationType } from "../types/notification";

const typeLabels: Record<NotificationType, string> = {
  ORDER_CREATED: "注文受付",
  PAYMENT_SUCCESS: "支払い完了",
  ORDER_STATUS_CHANGED: "注文状況",
  ORDER_CANCELLED: "注文キャンセル",
  REVIEW_SUBMITTED: "レビュー投稿",
  REVIEW_APPROVED: "レビュー承認",
  REVIEW_REJECTED: "レビュー非承認",
};

function getReferenceHref(notification: Notification, isAdmin: boolean): string | null {
  if (notification.reference?.type === "ORDER" && notification.reference.id) {
    return isAdmin
      ? `/admin/orders/${notification.reference.id}`
      : `/account/orders/${notification.reference.id}`;
  }
  console.log("isAdmin", isAdmin);

  if (notification.reference?.type === "REVIEW" && notification.reference.id) {
    return isAdmin ? `/admin/reviews/${notification.reference.id}` : "/account/reviews";
  }

  return null;
}

function getReferenceLabel(notification: Notification): string {
  if (notification.reference?.type === "ORDER") {
    return "注文を見る";
  }

  if (notification.reference?.type === "REVIEW") {
    return notification.type === "REVIEW_SUBMITTED" ? "レビューを確認" : "レビューを見る";
  }

  return "詳細を見る";
}

export function NotificationItem({
  notification,
  isAdmin = false,
}: {
  notification: Notification;
  isAdmin?: boolean;
}) {
  const markReadMutation = useMarkNotificationRead();

  const error = markReadMutation.error ? normalizeApiError(markReadMutation.error) : null;

  const referenceHref = getReferenceHref(notification, isAdmin);
  const referenceLabel = getReferenceLabel(notification);

  return (
    <article
      className={cn(
        "rounded-3xl border p-5 transition-colors sm:p-6",
        notification.isRead ? "bg-white" : "border-brand/20 bg-brand-soft/40",
      )}
    >
      <div className="flex items-start gap-4">
        <span
          className={cn(
            "mt-1 size-2.5 shrink-0 rounded-full",
            notification.isRead ? "bg-slate-200" : "bg-accent",
          )}
          aria-hidden="true"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-accent text-[10px] font-bold tracking-[0.12em] uppercase">
                {typeLabels[notification.type]}
              </p>

              <h2 className="text-foreground mt-1 font-semibold">{notification.title}</h2>
            </div>

            <time
              className="text-muted-foreground text-xs"
              dateTime={notification.createdAt}
            >
              {formatDateTime(notification.createdAt)}
            </time>
          </div>

          <p className="text-muted-foreground mt-3 text-sm leading-7 whitespace-pre-line">
            {notification.message}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {!notification.isRead ? (
              <Button
                size="sm"
                variant="secondary"
                isLoading={markReadMutation.isPending}
                onClick={() => markReadMutation.mutate(notification.id)}
              >
                既読にする
              </Button>
            ) : null}

            {referenceHref ? (
              <Link
                href={referenceHref}
                className="text-brand-dark hover:bg-brand-soft inline-flex min-h-9 items-center rounded-full px-3 text-sm font-semibold transition-colors"
              >
                {referenceLabel}
              </Link>
            ) : null}
          </div>

          {error ? (
            <Alert className="mt-4" variant="error">
              {error.message}
            </Alert>
          ) : null}
        </div>
      </div>
    </article>
  );
}
