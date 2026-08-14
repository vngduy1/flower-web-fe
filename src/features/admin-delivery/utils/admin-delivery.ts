import type {
  AdminDeliveryArea,
  AdminDeliveryBlackoutDate,
  AdminDeliveryCapacity,
  AdminDeliveryTimeSlot,
  CreateAdminDeliveryAreaRequest,
  CreateAdminDeliveryBlackoutDateRequest,
  CreateAdminDeliveryCapacityRequest,
  CreateAdminDeliveryTimeSlotRequest,
} from "../types/admin-delivery";
import type {
  DeliveryAreaFormValues,
  DeliveryBlackoutDateFormValues,
  DeliveryCapacityFormValues,
  DeliveryTimeSlotFormValues,
} from "../schemas/admin-delivery.schema";

export const normalizeTimeInput = (value: string): string => value.slice(0, 5);

export function getDeliveryAreaDefaults(
  area?: AdminDeliveryArea,
): DeliveryAreaFormValues {
  return {
    prefecture: area?.prefecture ?? "",
    city: area?.city ?? "",
    areaName: area?.areaName ?? "",
    deliveryFee: area ? String(area.deliveryFee) : "",
    isActive: area?.isActive ?? true,
  };
}

export function buildDeliveryAreaRequest(
  values: DeliveryAreaFormValues,
): CreateAdminDeliveryAreaRequest {
  return {
    prefecture: values.prefecture,
    city: values.city,
    areaName: values.areaName,
    deliveryFee: Number(values.deliveryFee),
    isActive: values.isActive,
  };
}

export function getDeliveryTimeSlotDefaults(
  timeSlot?: AdminDeliveryTimeSlot,
): DeliveryTimeSlotFormValues {
  return {
    slotCode: timeSlot?.slotCode ?? "",
    displayName: timeSlot?.displayName ?? "",
    startTime: timeSlot ? normalizeTimeInput(timeSlot.startTime) : "",
    endTime: timeSlot ? normalizeTimeInput(timeSlot.endTime) : "",
    defaultCapacity: timeSlot ? String(timeSlot.defaultCapacity) : "20",
    sortOrder: timeSlot ? String(timeSlot.sortOrder) : "0",
    isActive: timeSlot?.isActive ?? true,
  };
}

export function buildDeliveryTimeSlotRequest(
  values: DeliveryTimeSlotFormValues,
): CreateAdminDeliveryTimeSlotRequest {
  return {
    slotCode: values.slotCode,
    displayName: values.displayName,
    startTime: values.startTime,
    endTime: values.endTime,
    defaultCapacity: Number(values.defaultCapacity),
    sortOrder: Number(values.sortOrder),
    isActive: values.isActive,
  };
}

export function getDeliveryBlackoutDateDefaults(
  blackoutDate?: AdminDeliveryBlackoutDate,
): DeliveryBlackoutDateFormValues {
  return {
    blackoutDate: blackoutDate?.blackoutDate ?? "",
    reason: blackoutDate?.reason ?? "",
    isActive: blackoutDate?.isActive ?? true,
  };
}

export function buildDeliveryBlackoutDateRequest(
  values: DeliveryBlackoutDateFormValues,
): CreateAdminDeliveryBlackoutDateRequest {
  return values;
}

export function getDeliveryCapacityDefaults(
  capacity?: AdminDeliveryCapacity,
): DeliveryCapacityFormValues {
  return {
    deliveryDate: capacity?.deliveryDate ?? "",
    timeSlotId: capacity?.timeSlot?.id ?? "",
    maxOrders: capacity ? String(capacity.maxOrders) : "",
    isActive: capacity?.isActive ?? true,
  };
}

export function buildDeliveryCapacityRequest(
  values: DeliveryCapacityFormValues,
): CreateAdminDeliveryCapacityRequest {
  return {
    deliveryDate: values.deliveryDate,
    timeSlotId: values.timeSlotId,
    maxOrders: Number(values.maxOrders),
    isActive: values.isActive,
  };
}
