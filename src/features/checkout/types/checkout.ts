import type { CartCurrency } from "@/features/cart/types/cart";

export interface CheckoutPreviewRequest {
  addressId: string;
  deliveryDate: string;
  deliveryTimeSlot?: string;
}

export interface CheckoutPreviewResponse {
  address: {
    id: string;
    label: string | null;
    recipientName: string;
    recipientPhone: string;
    postalCode: string;
    prefecture: string;
    city: string;
    addressLine1: string;
    addressLine2: string | null;
  };
  items: Array<{
    cartItemId: string;
    productId: string;
    productCode: string;
    productName: string;
    thumbnailUrl: string | null;
    quantity: number;
    storedUnitPrice: number;
    currentUnitPrice: number;
    unitPrice: number;
    subtotal: number;
    availableQuantity: number;
    isAvailable: boolean;
    priceChanged: boolean;
  }>;
  delivery: {
    date: string;
    timeSlot: string | null;
    fee: number;
  };
  currency: CartCurrency;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  canCheckout: boolean;
  warnings: string[];
}
