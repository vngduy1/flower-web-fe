import { queryOptions } from "@tanstack/react-query";

import { getNotifications, getUnreadNotificationCount } from "./notifications.api";
import type { NotificationQuery } from "../types/notification";

export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (query: NotificationQuery) => [...notificationKeys.lists(), query] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};

export function notificationsQueryOptions(query: NotificationQuery) {
  return queryOptions({
    queryKey: notificationKeys.list(query),
    queryFn: () => getNotifications(query),
    staleTime: 15_000,
  });
}

export function unreadNotificationCountQueryOptions() {
  return queryOptions({
    queryKey: notificationKeys.unreadCount(),
    queryFn: getUnreadNotificationCount,
    staleTime: 15_000,
    refetchInterval: 60_000,
  });
}
