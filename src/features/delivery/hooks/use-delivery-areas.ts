"use client";

import { useQuery } from "@tanstack/react-query";

import { deliveryAreasQueryOptions } from "../api/delivery.queries";

export function useDeliveryAreas(enabled = true) {
  return useQuery({ ...deliveryAreasQueryOptions(), enabled });
}
