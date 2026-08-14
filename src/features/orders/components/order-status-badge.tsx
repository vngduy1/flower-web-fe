import { cn } from "@/lib/utils/cn";

import type { OrderPaymentStatus, OrderStatus } from "../types/order";
import { getOrderPaymentStatusLabel, getOrderStatusLabel } from "../utils/order-labels";

const orderStatusClasses: Record<OrderStatus, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-800",
  CONFIRMED: "border-blue-200 bg-blue-50 text-blue-800",
  PREPARING: "border-violet-200 bg-violet-50 text-violet-800",
  SHIPPED: "border-cyan-200 bg-cyan-50 text-cyan-800",
  DELIVERED: "border-emerald-200 bg-emerald-50 text-emerald-800",
  CANCELLED: "border-slate-200 bg-slate-100 text-slate-700",
};

const paymentStatusClasses: Record<OrderPaymentStatus, string> = {
  UNPAID: "border-amber-200 bg-amber-50 text-amber-800",
  PENDING: "border-blue-200 bg-blue-50 text-blue-800",
  PAID: "border-emerald-200 bg-emerald-50 text-emerald-800",
  FAILED: "border-red-200 bg-red-50 text-red-800",
  REFUNDED: "border-slate-200 bg-slate-100 text-slate-700",
};

interface BadgeProps {
  className?: string;
}

export function OrderStatusBadge({
  className,
  status,
}: BadgeProps & { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold",
        orderStatusClasses[status],
        className,
      )}
    >
      {getOrderStatusLabel(status)}
    </span>
  );
}

export function PaymentStatusBadge({
  className,
  status,
}: BadgeProps & { status: OrderPaymentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold",
        paymentStatusClasses[status],
        className,
      )}
    >
      {getOrderPaymentStatusLabel(status)}
    </span>
  );
}
