import { queryOptions } from "@tanstack/react-query";

import {
  getAdminDeliveryAreas,
  getAdminDeliveryBlackoutDates,
  getAdminDeliveryCapacities,
  getAdminDeliveryTimeSlots,
} from "./admin-delivery.api";

export const adminDeliveryKeys = {
  all: ["admin-delivery"] as const,
  areas: () => [...adminDeliveryKeys.all, "areas"] as const,
  timeSlots: () => [...adminDeliveryKeys.all, "time-slots"] as const,
  blackoutDates: () => [...adminDeliveryKeys.all, "blackout-dates"] as const,
  capacities: () => [...adminDeliveryKeys.all, "capacities"] as const,
};

export const adminDeliveryAreasQueryOptions = () =>
  queryOptions({
    queryKey: adminDeliveryKeys.areas(),
    queryFn: getAdminDeliveryAreas,
    staleTime: 30_000,
  });

export const adminDeliveryTimeSlotsQueryOptions = () =>
  queryOptions({
    queryKey: adminDeliveryKeys.timeSlots(),
    queryFn: getAdminDeliveryTimeSlots,
    staleTime: 30_000,
  });

export const adminDeliveryBlackoutDatesQueryOptions = () =>
  queryOptions({
    queryKey: adminDeliveryKeys.blackoutDates(),
    queryFn: getAdminDeliveryBlackoutDates,
    staleTime: 30_000,
  });

export const adminDeliveryCapacitiesQueryOptions = () =>
  queryOptions({
    queryKey: adminDeliveryKeys.capacities(),
    queryFn: getAdminDeliveryCapacities,
    staleTime: 30_000,
  });
