import { NotificationItem } from "./notification-item";
import type { Notification } from "../types/notification";

export function NotificationList({
  notifications,
  isAdmin = false,
}: {
  notifications: Notification[];
  isAdmin?: boolean;
}) {
  return (
    <div className="grid gap-4">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
}
