"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { notificationsQueryOptions } from "../api/notifications.queries";
import type { NotificationQuery } from "../types/notification";

export function useNotifications(query: NotificationQuery, enabled = true) {
  return useQuery({
    ...notificationsQueryOptions(query),
    enabled,
    placeholderData: keepPreviousData,
  });
}
