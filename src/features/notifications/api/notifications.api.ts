import { apiClient, toApiPathSegment } from "@/lib/api";

import type {
  MarkAllNotificationsReadResponse,
  Notification,
  NotificationListResponse,
  NotificationQuery,
  UnreadNotificationCountResponse,
} from "../types/notification";

export async function getNotifications(
  query: NotificationQuery,
): Promise<NotificationListResponse> {
  const params = new URLSearchParams();

  if (query.unreadOnly === true) {
    params.set("unreadOnly", "true");
  }

  if (query.page !== undefined) {
    params.set("page", String(query.page));
  }

  if (query.limit !== undefined) {
    params.set("limit", String(query.limit));
  }

  const response = await apiClient.get<NotificationListResponse>("/notifications", {
    params,
  });

  return response.data;
}

export async function getUnreadNotificationCount(): Promise<UnreadNotificationCountResponse> {
  const response = await apiClient.get<UnreadNotificationCountResponse>(
    "/notifications/unread-count",
  );

  return response.data;
}

export async function markNotificationRead(
  notificationId: string,
): Promise<Notification> {
  const response = await apiClient.patch<Notification>(
    `/notifications/${toApiPathSegment(notificationId)}/read`,
  );

  return response.data;
}

export async function markAllNotificationsRead(): Promise<MarkAllNotificationsReadResponse> {
  const response = await apiClient.patch<MarkAllNotificationsReadResponse>(
    "/notifications/read-all",
  );

  return response.data;
}
