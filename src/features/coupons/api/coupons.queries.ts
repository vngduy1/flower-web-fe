import { queryOptions } from "@tanstack/react-query";

import { getAvailableCoupons } from "./coupons.api";

export const couponKeys = {
  all: ["coupons"] as const,
  available: () => [...couponKeys.all, "available"] as const,
};

export function availableCouponsQueryOptions() {
  return queryOptions({
    queryKey: couponKeys.available(),
    queryFn: getAvailableCoupons,
    staleTime: 30_000,
  });
}
