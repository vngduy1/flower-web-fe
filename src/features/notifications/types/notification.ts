export type NotificationType =
  | "ORDER_CREATED"
  | "PAYMENT_SUCCESS"
  | "ORDER_STATUS_CHANGED"
  | "ORDER_CANCELLED"
  | "REVIEW_SUBMITTED"
  | "REVIEW_APPROVED"
  | "REVIEW_REJECTED";

export interface NotificationReference {
  type: string;
  id: string | null;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  reference: NotificationReference | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationQuery {
  unreadOnly?: boolean;
  page?: number;
  limit?: number;
}

export interface NotificationListResponse {
  items: Notification[];
  unreadCount: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UnreadNotificationCountResponse {
  unreadCount: number;
}

export interface MarkAllNotificationsReadResponse {
  message: string;
  updatedCount: number;
}
