import { formatYen } from "@/lib/format/currency";

import type { AdminCouponFormValues } from "../schemas/admin-coupon.schema";
import type {
  AdminCoupon,
  AdminCouponQuery,
  CouponUsageQuery,
  CreateAdminCouponRequest,
} from "../types/admin-coupon";

const PAGE_SIZE = 20;

export function parseAdminCouponQuery(params: URLSearchParams): AdminCouponQuery {
  const page = Number(params.get("page"));
  const active = params.get("isActive");

  return {
    keyword: params.get("keyword")?.trim() || undefined,
    isActive: active === "true" ? true : active === "false" ? false : undefined,
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
    limit: PAGE_SIZE,
  };
}

export function parseCouponUsageQuery(params: URLSearchParams): CouponUsageQuery {
  const page = Number(params.get("usagePage"));
  const reversed = params.get("isReversed");

  return {
    isReversed: reversed === "true" ? true : reversed === "false" ? false : undefined,
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
    limit: PAGE_SIZE,
  };
}

export function toLocalDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function getCouponFormDefaults(coupon?: AdminCoupon): AdminCouponFormValues {
  const now = new Date();
  const defaultEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1_000);

  return {
    code: coupon?.code ?? "",
    name: coupon?.name ?? "",
    description: coupon?.description ?? "",
    discountType: coupon?.discountType ?? "PERCENTAGE",
    discountValue: coupon ? String(coupon.discountValue) : "",
    minimumOrderAmount: coupon ? String(coupon.minimumOrderAmount) : "0",
    maximumDiscountAmount:
      coupon?.maximumDiscountAmount !== null &&
      coupon?.maximumDiscountAmount !== undefined
        ? String(coupon.maximumDiscountAmount)
        : "",
    usageLimit:
      coupon?.usageLimit !== null && coupon?.usageLimit !== undefined
        ? String(coupon.usageLimit)
        : "",
    perUserLimit:
      coupon?.perUserLimit !== null && coupon?.perUserLimit !== undefined
        ? String(coupon.perUserLimit)
        : "",
    startsAt: coupon
      ? toLocalDateTime(coupon.startsAt)
      : toLocalDateTime(now.toISOString()),
    endsAt: coupon
      ? toLocalDateTime(coupon.endsAt)
      : toLocalDateTime(defaultEnd.toISOString()),
    isActive: coupon?.isActive ?? true,
  };
}

function optionalNumber(value: string): number | undefined {
  return value.trim() ? Number(value) : undefined;
}

export function buildAdminCouponRequest(
  values: AdminCouponFormValues,
): CreateAdminCouponRequest {
  return {
    code: values.code.trim().toUpperCase(),
    name: values.name.trim(),
    description: values.description.trim(),
    discountType: values.discountType,
    discountValue: Number(values.discountValue),
    minimumOrderAmount: Number(values.minimumOrderAmount),
    ...(optionalNumber(values.maximumDiscountAmount) !== undefined
      ? { maximumDiscountAmount: Number(values.maximumDiscountAmount) }
      : {}),
    ...(optionalNumber(values.usageLimit) !== undefined
      ? { usageLimit: Number(values.usageLimit) }
      : {}),
    ...(optionalNumber(values.perUserLimit) !== undefined
      ? { perUserLimit: Number(values.perUserLimit) }
      : {}),
    startsAt: new Date(values.startsAt).toISOString(),
    endsAt: new Date(values.endsAt).toISOString(),
    isActive: values.isActive,
  };
}

export function getUnclearableCouponFields(
  coupon: AdminCoupon,
  values: AdminCouponFormValues,
): Array<"maximumDiscountAmount" | "usageLimit" | "perUserLimit"> {
  const fields: Array<"maximumDiscountAmount" | "usageLimit" | "perUserLimit"> = [];

  if (coupon.maximumDiscountAmount !== null && !values.maximumDiscountAmount) {
    fields.push("maximumDiscountAmount");
  }
  if (coupon.usageLimit !== null && !values.usageLimit) {
    fields.push("usageLimit");
  }
  if (coupon.perUserLimit !== null && !values.perUserLimit) {
    fields.push("perUserLimit");
  }

  return fields;
}

export function formatCouponDiscount(
  coupon: Pick<AdminCoupon, "discountType" | "discountValue">,
): string {
  return coupon.discountType === "PERCENTAGE"
    ? `${coupon.discountValue}%`
    : formatYen(coupon.discountValue);
}

export function getCouponAvailabilityLabel(coupon: AdminCoupon): string {
  if (!coupon.isActive) return "利用不可（無効）";
  if (!coupon.availability.hasStarted) return "開始前";
  if (coupon.availability.hasExpired) return "期限切れ";
  if (coupon.availability.usageLimitReached) return "利用上限到達";
  return "現在利用可能";
}

export function getCouponAvailabilityTone(
  coupon: AdminCoupon,
): "success" | "warning" | "muted" {
  if (
    coupon.isActive &&
    coupon.availability.hasStarted &&
    !coupon.availability.hasExpired &&
    !coupon.availability.usageLimitReached
  ) {
    return "success";
  }

  return coupon.isActive ? "warning" : "muted";
}
