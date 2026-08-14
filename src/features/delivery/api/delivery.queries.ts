import { queryOptions } from "@tanstack/react-query";

import {
  getAvailableDeliveryDates,
  getDeliveryAreas,
  getDeliveryFee,
  getDeliveryTimeSlots,
} from "./delivery.api";

export const deliveryKeys = {
  all: ["delivery"] as const,
  areas: () => [...deliveryKeys.all, "areas"] as const,
  dates: () => [...deliveryKeys.all, "available-dates"] as const,
  timeSlots: (date: string) => [...deliveryKeys.all, "time-slots", date] as const,
  fee: (prefecture: string, city: string) =>
    [...deliveryKeys.all, "fee", prefecture, city] as const,
};

export function deliveryAreasQueryOptions() {
  return queryOptions({
    queryKey: deliveryKeys.areas(),
    queryFn: getDeliveryAreas,
    staleTime: 60_000,
  });
}

export function availableDeliveryDatesQueryOptions() {
  return queryOptions({
    queryKey: deliveryKeys.dates(),
    queryFn: getAvailableDeliveryDates,
    staleTime: 0,
  });
}

export function deliveryTimeSlotsQueryOptions(date: string) {
  return queryOptions({
    queryKey: deliveryKeys.timeSlots(date),
    queryFn: () => getDeliveryTimeSlots(date),
    staleTime: 0,
  });
}

export function deliveryFeeQueryOptions(prefecture: string, city: string) {
  return queryOptions({
    queryKey: deliveryKeys.fee(prefecture, city),
    queryFn: () => getDeliveryFee(prefecture, city),
    staleTime: 60_000,
  });
}
