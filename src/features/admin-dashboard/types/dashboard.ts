import type {
  NotificationReference,
  NotificationType,
} from "@/features/notifications/types/notification";
import type { OrderPaymentStatus, OrderStatus } from "@/features/orders/types/order";
import type { ProductStatus } from "@/features/products/types/product";

export interface AdminDashboardRecentOrder {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    fullName: string;
    email: string;
  };
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  totalQuantity: number;
  totalAmount: number;
  currency: string;
  createdAt: string;
}

export interface AdminDashboardSummary {
  orders: {
    total: number;
    today: number;
    pending: number;
    confirmed: number;
    preparing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  revenue: {
    today: number;
    thisMonth: number;
    currency: "JPY";
  };
  users: {
    total: number;
    newToday: number;
    newThisMonth: number;
  };
  products: {
    total: number;
    active: number;
    lowStock: number;
    outOfStock: number;
  };
  reviews: {
    pending: number;
    approved: number;
    rejected: number;
  };
  recentOrders: AdminDashboardRecentOrder[];
}

export interface AdminDashboardRevenueChart {
  from: string;
  to: string;
  currency: "JPY";
  items: Array<{
    date: string;
    orderCount: number;
    revenue: number;
  }>;
}

export interface AdminDashboardTopProducts {
  items: Array<{
    productId: string | null;
    productCode: string;
    productName: string;
    quantitySold: number;
    orderCount: number;
    revenue: number;
    averageRating: number;
    reviewCount: number;
  }>;
}

export type AdminDashboardStockStatus = "LOW_STOCK" | "OUT_OF_STOCK";

export interface AdminDashboardLowStockProducts {
  items: Array<{
    inventoryId: string;
    product: {
      id: string;
      productCode: string;
      name: string;
      slug: string;
      thumbnailUrl: string | null;
      status: ProductStatus;
    };
    stockQuantity: number;
    reservedQuantity: number;
    availableQuantity: number;
    lowStockThreshold: number;
    stockStatus: AdminDashboardStockStatus;
  }>;
}

export interface AdminDashboardRecentNotifications {
  items: Array<{
    id: string;
    user: {
      id: string;
      fullName: string;
      email: string;
    } | null;
    type: NotificationType;
    title: string;
    message: string;
    reference: NotificationReference | null;
    isRead: boolean;
    readAt: string | null;
    createdAt: string;
  }>;
}
