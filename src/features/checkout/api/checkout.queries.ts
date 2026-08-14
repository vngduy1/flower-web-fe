import { queryOptions, skipToken } from "@tanstack/react-query";

import { getCheckoutPreview } from "./checkout.api";
import type { CheckoutPreviewRequest } from "../types/checkout";

export const checkoutKeys = {
  all: ["checkout"] as const,
  preview: (request: CheckoutPreviewRequest | null, cartVersion: string | null) =>
    [...checkoutKeys.all, "preview", request, cartVersion] as const,
};

export function checkoutPreviewQueryOptions(
  request: CheckoutPreviewRequest | null,
  cartVersion: string | null,
) {
  return queryOptions({
    queryKey: checkoutKeys.preview(request, cartVersion),
    queryFn: request ? () => getCheckoutPreview(request) : skipToken,
    staleTime: 0,
  });
}
