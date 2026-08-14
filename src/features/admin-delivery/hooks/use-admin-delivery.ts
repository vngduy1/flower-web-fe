"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";

import { deliveryKeys } from "@/features/delivery/api/delivery.queries";

import {
  createAdminDeliveryArea,
  createAdminDeliveryBlackoutDate,
  createAdminDeliveryCapacity,
  createAdminDeliveryTimeSlot,
  disableAdminDeliveryArea,
  disableAdminDeliveryBlackoutDate,
  disableAdminDeliveryCapacity,
  disableAdminDeliveryTimeSlot,
  updateAdminDeliveryArea,
  updateAdminDeliveryBlackoutDate,
  updateAdminDeliveryCapacity,
  updateAdminDeliveryTimeSlot,
} from "../api/admin-delivery.api";
import {
  adminDeliveryAreasQueryOptions,
  adminDeliveryBlackoutDatesQueryOptions,
  adminDeliveryCapacitiesQueryOptions,
  adminDeliveryKeys,
  adminDeliveryTimeSlotsQueryOptions,
} from "../api/admin-delivery.queries";
import type {
  AdminDeliveryResourceKind,
  CreateAdminDeliveryAreaRequest,
  CreateAdminDeliveryBlackoutDateRequest,
  CreateAdminDeliveryCapacityRequest,
  CreateAdminDeliveryTimeSlotRequest,
  UpdateAdminDeliveryAreaRequest,
  UpdateAdminDeliveryBlackoutDateRequest,
  UpdateAdminDeliveryCapacityRequest,
  UpdateAdminDeliveryTimeSlotRequest,
} from "../types/admin-delivery";

export const useAdminDeliveryAreas = () => useQuery(adminDeliveryAreasQueryOptions());

export const useAdminDeliveryTimeSlots = () =>
  useQuery(adminDeliveryTimeSlotsQueryOptions());

export const useAdminDeliveryBlackoutDates = () =>
  useQuery(adminDeliveryBlackoutDatesQueryOptions());

export const useAdminDeliveryCapacities = () =>
  useQuery(adminDeliveryCapacitiesQueryOptions());

const customerTimeSlotPrefix = [...deliveryKeys.all, "time-slots"] as const;
const customerFeePrefix = [...deliveryKeys.all, "fee"] as const;

async function invalidateAreaSurfaces(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: adminDeliveryKeys.areas() }),
    queryClient.invalidateQueries({ queryKey: deliveryKeys.areas() }),
    queryClient.invalidateQueries({ queryKey: customerFeePrefix }),
  ]);
}

async function invalidateTimeSlotSurfaces(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: adminDeliveryKeys.timeSlots() }),
    queryClient.invalidateQueries({ queryKey: adminDeliveryKeys.capacities() }),
    queryClient.invalidateQueries({ queryKey: deliveryKeys.dates() }),
    queryClient.invalidateQueries({ queryKey: customerTimeSlotPrefix }),
  ]);
}

async function invalidateBlackoutDateSurfaces(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: adminDeliveryKeys.blackoutDates() }),
    queryClient.invalidateQueries({ queryKey: deliveryKeys.dates() }),
    queryClient.invalidateQueries({ queryKey: customerTimeSlotPrefix }),
  ]);
}

async function invalidateCapacitySurfaces(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: adminDeliveryKeys.capacities() }),
    queryClient.invalidateQueries({ queryKey: deliveryKeys.dates() }),
    queryClient.invalidateQueries({ queryKey: customerTimeSlotPrefix }),
  ]);
}

export function useCreateAdminDeliveryArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateAdminDeliveryAreaRequest) =>
      createAdminDeliveryArea(request),
    onSuccess: () => invalidateAreaSurfaces(queryClient),
  });
}

export function useUpdateAdminDeliveryArea(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateAdminDeliveryAreaRequest) =>
      updateAdminDeliveryArea(id, request),
    onSuccess: () => invalidateAreaSurfaces(queryClient),
  });
}

export function useCreateAdminDeliveryTimeSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateAdminDeliveryTimeSlotRequest) =>
      createAdminDeliveryTimeSlot(request),
    onSuccess: () => invalidateTimeSlotSurfaces(queryClient),
  });
}

export function useUpdateAdminDeliveryTimeSlot(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateAdminDeliveryTimeSlotRequest) =>
      updateAdminDeliveryTimeSlot(id, request),
    onSuccess: () => invalidateTimeSlotSurfaces(queryClient),
  });
}

export function useCreateAdminDeliveryBlackoutDate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateAdminDeliveryBlackoutDateRequest) =>
      createAdminDeliveryBlackoutDate(request),
    onSuccess: () => invalidateBlackoutDateSurfaces(queryClient),
  });
}

export function useUpdateAdminDeliveryBlackoutDate(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateAdminDeliveryBlackoutDateRequest) =>
      updateAdminDeliveryBlackoutDate(id, request),
    onSuccess: () => invalidateBlackoutDateSurfaces(queryClient),
  });
}

export function useCreateAdminDeliveryCapacity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateAdminDeliveryCapacityRequest) =>
      createAdminDeliveryCapacity(request),
    onSuccess: () => invalidateCapacitySurfaces(queryClient),
  });
}

export function useUpdateAdminDeliveryCapacity(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateAdminDeliveryCapacityRequest) =>
      updateAdminDeliveryCapacity(id, request),
    onSuccess: () => invalidateCapacitySurfaces(queryClient),
  });
}

async function setResourceActive(
  kind: AdminDeliveryResourceKind,
  id: string,
  isActive: boolean,
) {
  if (isActive) {
    switch (kind) {
      case "area":
        return updateAdminDeliveryArea(id, { isActive: true });
      case "timeSlot":
        return updateAdminDeliveryTimeSlot(id, { isActive: true });
      case "blackoutDate":
        return updateAdminDeliveryBlackoutDate(id, { isActive: true });
      case "capacity":
        return updateAdminDeliveryCapacity(id, { isActive: true });
    }
  }

  switch (kind) {
    case "area":
      return disableAdminDeliveryArea(id);
    case "timeSlot":
      return disableAdminDeliveryTimeSlot(id);
    case "blackoutDate":
      return disableAdminDeliveryBlackoutDate(id);
    case "capacity":
      return disableAdminDeliveryCapacity(id);
  }
}

function invalidateResource(queryClient: QueryClient, kind: AdminDeliveryResourceKind) {
  switch (kind) {
    case "area":
      return invalidateAreaSurfaces(queryClient);
    case "timeSlot":
      return invalidateTimeSlotSurfaces(queryClient);
    case "blackoutDate":
      return invalidateBlackoutDateSurfaces(queryClient);
    case "capacity":
      return invalidateCapacitySurfaces(queryClient);
  }
}

export function useSetAdminDeliveryResourceActive(
  kind: AdminDeliveryResourceKind,
  id: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isActive: boolean) => setResourceActive(kind, id, isActive),
    onSuccess: () => invalidateResource(queryClient, kind),
  });
}
