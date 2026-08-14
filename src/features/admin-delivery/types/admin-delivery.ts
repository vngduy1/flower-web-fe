export interface AdminDeliveryArea {
  id: string;
  prefecture: string;
  city: string;
  areaName: string;
  deliveryFee: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminDeliveryAreaRequest {
  prefecture: string;
  city: string;
  areaName: string;
  deliveryFee: number;
  isActive?: boolean;
}

export type UpdateAdminDeliveryAreaRequest = Partial<CreateAdminDeliveryAreaRequest>;

export interface AdminDeliveryTimeSlot {
  id: string;
  slotCode: string;
  displayName: string;
  startTime: string;
  endTime: string;
  defaultCapacity: number;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminDeliveryTimeSlotRequest {
  slotCode: string;
  displayName: string;
  startTime: string;
  endTime: string;
  defaultCapacity: number;
  sortOrder?: number;
  isActive?: boolean;
}

export type UpdateAdminDeliveryTimeSlotRequest =
  Partial<CreateAdminDeliveryTimeSlotRequest>;

export interface AdminDeliveryBlackoutDate {
  id: string;
  blackoutDate: string;
  reason: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminDeliveryBlackoutDateRequest {
  blackoutDate: string;
  reason: string;
  isActive?: boolean;
}

export type UpdateAdminDeliveryBlackoutDateRequest =
  Partial<CreateAdminDeliveryBlackoutDateRequest>;

export interface AdminDeliveryCapacityTimeSlot {
  id: string;
  slotCode: string;
  displayName: string;
  startTime: string;
  endTime: string;
}

export interface AdminDeliveryCapacity {
  id: string;
  deliveryDate: string;
  timeSlot: AdminDeliveryCapacityTimeSlot | null;
  maxOrders: number;
  reservedOrders: number;
  remainingOrders: number;
  isFull: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminDeliveryCapacityRequest {
  deliveryDate: string;
  timeSlotId: string;
  maxOrders: number;
  isActive?: boolean;
}

export type UpdateAdminDeliveryCapacityRequest =
  Partial<CreateAdminDeliveryCapacityRequest>;

export interface DisableAdminDeliveryResponse {
  message: string;
}

export type AdminDeliveryResourceKind = "area" | "timeSlot" | "blackoutDate" | "capacity";
