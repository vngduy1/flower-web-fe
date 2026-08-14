"use client";

import { useQuery } from "@tanstack/react-query";

import { deliveryFeeQueryOptions } from "../api/delivery.queries";

export function useDeliveryFee(prefecture: string, city: string, enabled = true) {
  return useQuery({ ...deliveryFeeQueryOptions(prefecture, city), enabled });
}
