export interface CartCurrency {
  code: "JPY";
  symbol: "¥";
  locale: "ja-JP";
}

export interface CartItem {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  thumbnailUrl: string | null;
  storedUnitPrice: number;
  currentUnitPrice: number;
  priceChanged: boolean;
  quantity: number;
  subtotal: number;
  availableQuantity: number;
  isAvailable: boolean;
}

export interface Cart {
  id: string;
  userId: string;
  currency: CartCurrency;
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddCartItemRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  itemId: string;
  quantity: number;
}

export interface ClearCartResponse {
  message: string;
}
