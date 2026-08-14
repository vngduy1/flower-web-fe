"use client";

import { useQuery } from "@tanstack/react-query";

import { availableCouponsQueryOptions } from "../api/coupons.queries";

export function useAvailableCoupons(enabled = true) {
  return useQuery({ ...availableCouponsQueryOptions(), enabled });
}
