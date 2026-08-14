import { queryOptions } from "@tanstack/react-query";

import { getPayment } from "./payments.api";

export const paymentKeys = {
  all: ["payments"] as const,
  detail: (paymentId: string) => [...paymentKeys.all, "detail", paymentId] as const,
};

export function paymentQueryOptions(paymentId: string) {
  return queryOptions({
    queryKey: paymentKeys.detail(paymentId),
    queryFn: () => getPayment(paymentId),
    staleTime: 15_000,
  });
}
