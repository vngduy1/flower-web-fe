"use client";

import { useMutation } from "@tanstack/react-query";

import { validateCoupon } from "../api/coupons.api";

export function useValidateCoupon() {
  return useMutation({ mutationFn: validateCoupon });
}
