"use client";

import { useQuery } from "@tanstack/react-query";

import { unreadNotificationCountQueryOptions } from "../api/notifications.queries";

export function useUnreadNotificationCount(enabled = true) {
  return useQuery({ ...unreadNotificationCountQueryOptions(), enabled });
}
