"use client";

import { useQuery } from "@tanstack/react-query";

import { checkoutPreviewQueryOptions } from "../api/checkout.queries";
import type { CheckoutPreviewRequest } from "../types/checkout";

export function useCheckoutPreview(
  request: CheckoutPreviewRequest | null,
  cartVersion: string | null,
) {
  return useQuery(checkoutPreviewQueryOptions(request, cartVersion));
}
