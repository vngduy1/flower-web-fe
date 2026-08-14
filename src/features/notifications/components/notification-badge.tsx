"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { apiClient } from "@/lib/api";
import { formatDateTime } from "@/lib/format/date";

type NotificationType =
  | "ORDER_CREATED"
  | "PAYMENT_SUCCESS"
  | "ORDER_STATUS_CHANGED"
  | "ORDER_CANCELLED"
  | "REVIEW_SUBMITTED"
  | "REVIEW_APPROVED"
  | "REVIEW_REJECTED";

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;

  reference: {
    type: string;
    id: string | null;
  } | null;
};

type NotificationResponse = {
  items: Notification[];
  unreadCount: number;
};

export function NotificationBadge({ isAdmin = false }: { isAdmin?: boolean }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<NotificationResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const notificationPageHref = isAdmin
    ? "/admin/notifications"
    : "/account/notifications";

  async function loadNotifications() {
    setLoading(true);

    try {
      const response = await apiClient.get<NotificationResponse>("/notifications", {
        params: {
          page: 1,
          limit: 5,
        },
      });

      setData(response.data);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle() {
    const nextOpen = !open;

    setOpen(nextOpen);

    if (nextOpen) {
      await loadNotifications();
    }
  }

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => void handleToggle()}
        className="hover:bg-brand-soft relative grid size-10 place-items-center rounded-full"
        aria-label="通知"
        aria-expanded={open}
      >
        <span aria-hidden="true">🔔</span>

        {(data?.unreadCount ?? 0) > 0 ? (
          <span className="absolute top-0 right-0 grid min-w-5 place-items-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
            {data?.unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="border-brand/10 absolute right-0 z-50 mt-3 w-[360px] overflow-hidden rounded-2xl border bg-white shadow-xl">
          <div className="border-brand/10 flex items-center justify-between border-b px-4 py-3">
            <p className="font-semibold">通知</p>

            <span className="text-muted-foreground text-xs">
              未読 {data?.unreadCount ?? 0}件
            </span>
          </div>

          {loading ? (
            <div className="text-muted-foreground px-4 py-8 text-center text-sm">
              読み込み中...
            </div>
          ) : data?.items.length ? (
            <div className="max-h-[420px] overflow-y-auto">
              {data.items.map((notification) => (
                <div
                  key={notification.id}
                  className="border-brand/10 border-b px-4 py-4 last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={
                        notification.isRead
                          ? "mt-1.5 size-2 rounded-full bg-slate-200"
                          : "bg-accent mt-1.5 size-2 rounded-full"
                      }
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{notification.title}</p>

                      <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-5">
                        {notification.message}
                      </p>

                      <p className="text-muted-foreground mt-2 text-[11px]">
                        {formatDateTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground px-4 py-8 text-center text-sm">
              通知はありません。
            </div>
          )}

          <div className="border-brand/10 border-t p-3">
            <Link
              href={notificationPageHref}
              onClick={() => setOpen(false)}
              className="text-brand-dark hover:bg-brand-soft flex min-h-10 items-center justify-center rounded-full text-sm font-semibold transition-colors"
            >
              すべての通知を見る
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
