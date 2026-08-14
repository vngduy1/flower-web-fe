import { apiClient, toApiPathSegment } from "@/lib/api";

import type {
  AdminDeliveryArea,
  AdminDeliveryBlackoutDate,
  AdminDeliveryCapacity,
  AdminDeliveryTimeSlot,
  CreateAdminDeliveryAreaRequest,
  CreateAdminDeliveryBlackoutDateRequest,
  CreateAdminDeliveryCapacityRequest,
  CreateAdminDeliveryTimeSlotRequest,
  DisableAdminDeliveryResponse,
  UpdateAdminDeliveryAreaRequest,
  UpdateAdminDeliveryBlackoutDateRequest,
  UpdateAdminDeliveryCapacityRequest,
  UpdateAdminDeliveryTimeSlotRequest,
} from "../types/admin-delivery";

const areaPath = (id: string) => `/admin/delivery-areas/${toApiPathSegment(id)}`;
const timeSlotPath = (id: string) => `/admin/delivery-time-slots/${toApiPathSegment(id)}`;
const blackoutDatePath = (id: string) =>
  `/admin/delivery-blackout-dates/${toApiPathSegment(id)}`;
const capacityPath = (id: string) => `/admin/delivery-capacities/${toApiPathSegment(id)}`;

export async function getAdminDeliveryAreas(): Promise<AdminDeliveryArea[]> {
  const response = await apiClient.get<AdminDeliveryArea[]>("/admin/delivery-areas");

  return response.data;
}

export async function createAdminDeliveryArea(
  request: CreateAdminDeliveryAreaRequest,
): Promise<AdminDeliveryArea> {
  const response = await apiClient.post<AdminDeliveryArea>(
    "/admin/delivery-areas",
    request,
  );

  return response.data;
}

export async function updateAdminDeliveryArea(
  id: string,
  request: UpdateAdminDeliveryAreaRequest,
): Promise<AdminDeliveryArea> {
  const response = await apiClient.patch<AdminDeliveryArea>(areaPath(id), request);

  return response.data;
}

export async function disableAdminDeliveryArea(
  id: string,
): Promise<DisableAdminDeliveryResponse> {
  const response = await apiClient.delete<DisableAdminDeliveryResponse>(areaPath(id));

  return response.data;
}

export async function getAdminDeliveryTimeSlots(): Promise<AdminDeliveryTimeSlot[]> {
  const response = await apiClient.get<AdminDeliveryTimeSlot[]>(
    "/admin/delivery-time-slots",
  );

  return response.data;
}

export async function createAdminDeliveryTimeSlot(
  request: CreateAdminDeliveryTimeSlotRequest,
): Promise<AdminDeliveryTimeSlot> {
  const response = await apiClient.post<AdminDeliveryTimeSlot>(
    "/admin/delivery-time-slots",
    request,
  );

  return response.data;
}

export async function updateAdminDeliveryTimeSlot(
  id: string,
  request: UpdateAdminDeliveryTimeSlotRequest,
): Promise<AdminDeliveryTimeSlot> {
  const response = await apiClient.patch<AdminDeliveryTimeSlot>(
    timeSlotPath(id),
    request,
  );

  return response.data;
}

export async function disableAdminDeliveryTimeSlot(
  id: string,
): Promise<DisableAdminDeliveryResponse> {
  const response = await apiClient.delete<DisableAdminDeliveryResponse>(timeSlotPath(id));

  return response.data;
}

export async function getAdminDeliveryBlackoutDates(): Promise<
  AdminDeliveryBlackoutDate[]
> {
  const response = await apiClient.get<AdminDeliveryBlackoutDate[]>(
    "/admin/delivery-blackout-dates",
  );

  return response.data;
}

export async function createAdminDeliveryBlackoutDate(
  request: CreateAdminDeliveryBlackoutDateRequest,
): Promise<AdminDeliveryBlackoutDate> {
  const response = await apiClient.post<AdminDeliveryBlackoutDate>(
    "/admin/delivery-blackout-dates",
    request,
  );

  return response.data;
}

export async function updateAdminDeliveryBlackoutDate(
  id: string,
  request: UpdateAdminDeliveryBlackoutDateRequest,
): Promise<AdminDeliveryBlackoutDate> {
  const response = await apiClient.patch<AdminDeliveryBlackoutDate>(
    blackoutDatePath(id),
    request,
  );

  return response.data;
}

export async function disableAdminDeliveryBlackoutDate(
  id: string,
): Promise<DisableAdminDeliveryResponse> {
  const response = await apiClient.delete<DisableAdminDeliveryResponse>(
    blackoutDatePath(id),
  );

  return response.data;
}

export async function getAdminDeliveryCapacities(): Promise<AdminDeliveryCapacity[]> {
  const response = await apiClient.get<AdminDeliveryCapacity[]>(
    "/admin/delivery-capacities",
  );

  return response.data;
}

export async function createAdminDeliveryCapacity(
  request: CreateAdminDeliveryCapacityRequest,
): Promise<AdminDeliveryCapacity> {
  const response = await apiClient.post<AdminDeliveryCapacity>(
    "/admin/delivery-capacities",
    request,
  );

  return response.data;
}

export async function updateAdminDeliveryCapacity(
  id: string,
  request: UpdateAdminDeliveryCapacityRequest,
): Promise<AdminDeliveryCapacity> {
  const response = await apiClient.patch<AdminDeliveryCapacity>(
    capacityPath(id),
    request,
  );

  return response.data;
}

export async function disableAdminDeliveryCapacity(
  id: string,
): Promise<DisableAdminDeliveryResponse> {
  const response = await apiClient.delete<DisableAdminDeliveryResponse>(capacityPath(id));

  return response.data;
}
