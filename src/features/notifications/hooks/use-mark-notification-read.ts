"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { markNotificationRead } from "../api/notifications.api";
import { notificationKeys } from "../api/notifications.queries";
import type {
  NotificationListResponse,
  UnreadNotificationCountResponse,
} from "../types/notification";

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: async (notification) => {
      queryClient.setQueriesData<NotificationListResponse>(
        { queryKey: notificationKeys.lists() },
        (current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            items: current.items.map((item) =>
              item.id === notification.id ? notification : item,
            ),
          };
        },
      );
      queryClient.setQueryData<UnreadNotificationCountResponse>(
        notificationKeys.unreadCount(),
        (current) =>
          current ? { unreadCount: Math.max(current.unreadCount - 1, 0) } : current,
      );

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: notificationKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() }),
      ]);
    },
  });
}
