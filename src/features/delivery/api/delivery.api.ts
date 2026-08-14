import { apiClient } from "@/lib/api";

import type {
  AvailableDeliveryDate,
  AvailableDeliveryTimeSlot,
  DeliveryArea,
  DeliveryFeeResponse,
} from "../types/delivery";

export async function getDeliveryAreas(): Promise<DeliveryArea[]> {
  const response = await apiClient.get<DeliveryArea[]>("/delivery/areas");

  return response.data;
}

export async function getAvailableDeliveryDates(): Promise<AvailableDeliveryDate[]> {
  const response = await apiClient.get<AvailableDeliveryDate[]>(
    "/delivery/available-dates",
  );

  return response.data;
}

export async function getDeliveryTimeSlots(
  date: string,
): Promise<AvailableDeliveryTimeSlot[]> {
  const response = await apiClient.get<AvailableDeliveryTimeSlot[]>(
    "/delivery/time-slots",
    { params: { date } },
  );

  return response.data;
}

export async function getDeliveryFee(
  prefecture: string,
  city: string,
): Promise<DeliveryFeeResponse> {
  const response = await apiClient.get<DeliveryFeeResponse>("/delivery/fee", {
    params: { prefecture, city },
  });

  return response.data;
}
