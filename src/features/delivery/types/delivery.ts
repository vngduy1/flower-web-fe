export interface DeliveryArea {
  id: string;
  prefecture: string;
  city: string;
  areaName: string;
  deliveryFee: number;
  isActive: boolean;
}

export interface AvailableDeliveryDate {
  date: string;
  available: true;
}

export interface DeliveryTimeSlot {
  id: string;
  slotCode: string;
  displayName: string;
  startTime: string;
  endTime: string;
  sortOrder: number;
}

export interface AvailableDeliveryTimeSlot {
  capacityId: string;
  deliveryDate: string;
  timeSlot: DeliveryTimeSlot;
  maxOrders: number;
  reservedOrders: number;
  remainingOrders: number;
  isAvailable: boolean;
}

export interface DeliveryFeeResponse {
  supported: true;
  deliveryAreaId: string;
  prefecture: string;
  city: string;
  areaName: string;
  deliveryFee: number;
}
