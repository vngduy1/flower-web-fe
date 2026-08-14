export type CouponDiscountType = "FIXED_AMOUNT" | "PERCENTAGE";

export interface AvailableCoupon {
  id: string;
  code: string;
  name: string;
  description: string | null;
  discountType: CouponDiscountType;
  discountValue: number;
  maximumDiscountAmount: number | null;
  minimumOrderAmount: number;
  usageLimit: number | null;
  remainingUsage: number | null;
  perUserLimit: number | null;
  userUsageCount: number;
  remainingPerUser: number | null;
  startsAt: string;
  endsAt: string;
}

export interface AvailableCouponsResponse {
  items: AvailableCoupon[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CouponValidationRequest {
  code: string;
}

export interface CouponValidationResponse {
  valid: true;
  coupon: {
    id: string;
    code: string;
    name: string;
    description: string | null;
    discountType: CouponDiscountType;
    discountValue: number;
    minimumOrderAmount: number;
    maximumDiscountAmount: number | null;
  };
  subtotal: number;
  discountAmount: number;
  totalAfterDiscount: number;
  currency: "JPY";
}
