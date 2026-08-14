import type { OrderPaymentStatus, OrderStatus } from "../types/order";

const orderStatusLabels: Record<OrderStatus, string> = {
  PENDING: "注文受付・支払い待ち",
  CONFIRMED: "注文確定",
  PREPARING: "準備中",
  SHIPPED: "発送済み",
  DELIVERED: "配達完了",
  CANCELLED: "キャンセル済み",
};

const paymentStatusLabels: Record<OrderPaymentStatus, string> = {
  UNPAID: "未払い",
  PENDING: "支払い処理中",
  PAID: "支払い済み",
  FAILED: "支払い失敗",
  REFUNDED: "返金済み",
};

export function getOrderStatusLabel(status: OrderStatus): string {
  return orderStatusLabels[status];
}

export function getOrderPaymentStatusLabel(status: OrderPaymentStatus): string {
  return paymentStatusLabels[status];
}
