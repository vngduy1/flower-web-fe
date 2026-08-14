"use client";

import { useQuery } from "@tanstack/react-query";

import { availableDeliveryDatesQueryOptions } from "../api/delivery.queries";

export function useAvailableDeliveryDates(enabled = true) {
  return useQuery({ ...availableDeliveryDatesQueryOptions(), enabled });
}
