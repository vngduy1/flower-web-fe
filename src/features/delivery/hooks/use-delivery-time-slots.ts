"use client";

import { useQuery } from "@tanstack/react-query";

import { deliveryTimeSlotsQueryOptions } from "../api/delivery.queries";

export function useDeliveryTimeSlots(date: string, enabled = true) {
  return useQuery({ ...deliveryTimeSlotsQueryOptions(date), enabled });
}
