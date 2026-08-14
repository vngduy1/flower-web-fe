"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { markAllNotificationsRead } from "../api/notifications.api";
import { notificationKeys } from "../api/notifications.queries";
import type { UnreadNotificationCountResponse } from "../types/notification";

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: async () => {
      queryClient.setQueryData<UnreadNotificationCountResponse>(
        notificationKeys.unreadCount(),
        { unreadCount: 0 },
      );

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: notificationKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() }),
      ]);
    },
  });
}
