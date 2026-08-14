import type { CouponDiscountType } from "@/features/coupons/types/coupon";
import type { OrderStatus } from "@/features/orders/types/order";

export interface AdminCouponQuery {
  keyword?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CouponUsageQuery {
  isReversed?: boolean;
  page?: number;
  limit?: number;
}

export interface AdminCoupon {
  id: string;
  code: string;
  name: string;
  description: string | null;
  discountType: CouponDiscountType;
  discountValue: number;
  minimumOrderAmount: number;
  maximumDiscountAmount: number | null;
  usageLimit: number | null;
  usedCount: number;
  remainingUsage: number | null;
  perUserLimit: number | null;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  availability: {
    hasStarted: boolean;
    hasExpired: boolean;
    usageLimitReached: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdminCouponListResponse {
  items: AdminCoupon[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminCouponUsage {
  id: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  } | null;
  order: {
    id: string;
    orderNumber: string;
    status: OrderStatus;
  } | null;
  discountAmount: number;
  isReversed: boolean;
  reversedAt: string | null;
  usedAt: string;
}

export interface CouponUsageListResponse {
  items: AdminCouponUsage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateAdminCouponRequest {
  code: string;
  name: string;
  description?: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  usageLimit?: number;
  perUserLimit?: number;
  startsAt: string;
  endsAt: string;
  isActive?: boolean;
}

export type UpdateAdminCouponRequest = Partial<CreateAdminCouponRequest>;

export interface DisableAdminCouponResponse {
  message: string;
}

export type { CouponDiscountType };
