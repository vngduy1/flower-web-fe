"use client";

import { Alert, Button, Skeleton } from "@/components/ui";
import { NotificationList } from "@/features/notifications/components/notification-list";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { normalizeApiError } from "@/lib/api";

export default function AdminNotificationsPage() {
  const notifications = useNotifications({
    page: 1,
    limit: 20,
  });

  if (notifications.isPending) {
    return (
      <div className="mx-auto max-w-6xl">
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  if (notifications.error) {
    return (
      <div className="mx-auto max-w-6xl">
        <Alert variant="error">
          <p>{normalizeApiError(notifications.error).message}</p>

          <Button size="sm" className="mt-3" onClick={() => void notifications.refetch()}>
            再試行
          </Button>
        </Alert>
      </div>
    );
  }

  const data = notifications.data;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-7">
        <p className="text-accent text-xs font-semibold tracking-[0.2em]">
          NOTIFICATIONS
        </p>

        <h1 className="text-brand-dark mt-2 font-serif text-3xl font-semibold">通知</h1>

        <p className="text-muted-foreground mt-2 text-sm">
          注文、支払い、レビューに関する最新のお知らせです。
        </p>
      </div>

      {data?.items.length ? (
        <NotificationList notifications={data.items} isAdmin />
      ) : (
        <p className="rounded-3xl border bg-white px-6 py-12 text-center text-sm">
          通知はまだありません。
        </p>
      )}
    </div>
  );
}
