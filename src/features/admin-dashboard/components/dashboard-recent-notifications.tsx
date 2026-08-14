import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import type { NotificationType } from "@/features/notifications/types/notification";
import { formatDateTime } from "@/lib/format/date";
import { cn } from "@/lib/utils/cn";

import type { AdminDashboardRecentNotifications } from "../types/dashboard";

const notificationLabels: Record<NotificationType, string> = {
  ORDER_CREATED: "注文受付",
  PAYMENT_SUCCESS: "支払い完了",
  ORDER_STATUS_CHANGED: "注文状況更新",
  ORDER_CANCELLED: "注文キャンセル",

  REVIEW_SUBMITTED: "レビュー投稿",
  REVIEW_APPROVED: "レビュー承認",
  REVIEW_REJECTED: "レビュー非承認",
};

export function DashboardRecentNotifications({
  notifications,
}: {
  notifications: AdminDashboardRecentNotifications;
}) {
  return (
    <Card>
      <CardHeader>
        <p className="text-accent text-[10px] font-bold tracking-[0.14em] uppercase">
          Recent notifications
        </p>
        <CardTitle className="mt-2">最近の通知</CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.items.length ? (
          <div className="divide-y rounded-2xl border bg-white px-4">
            {notifications.items.map((notification) => (
              <article
                key={notification.id}
                className="grid grid-cols-[10px_1fr] gap-3 py-4"
              >
                <span
                  className={cn(
                    "mt-2 size-2 rounded-full",
                    notification.isRead ? "bg-slate-200" : "bg-accent",
                  )}
                  aria-hidden="true"
                />
                <span className="sr-only">{notification.isRead ? "既読" : "未読"}</span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-accent text-[10px] font-bold tracking-[0.1em] uppercase">
                        {notificationLabels[notification.type]}
                      </p>
                      <h3 className="text-foreground mt-1 text-sm font-semibold">
                        {notification.title}
                      </h3>
                    </div>
                    <time className="text-xs" dateTime={notification.createdAt}>
                      {formatDateTime(notification.createdAt)}
                    </time>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-6">
                    {notification.message}
                  </p>
                  <p className="mt-2 text-xs">
                    {notification.user
                      ? `${notification.user.fullName} / ${notification.user.email}`
                      : "ユーザー情報なし"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border bg-white px-4 py-8 text-center text-sm">
            通知はまだありません。
          </p>
        )}
      </CardContent>
    </Card>
  );
}
