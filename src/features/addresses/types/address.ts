export interface Address {
  id: string;
  userId: string;
  label: string | null;
  recipientName: string;
  recipientPhone: string;
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine1: string;
  addressLine2: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateAddressRequest {
  label?: string;
  recipientName: string;
  recipientPhone: string;
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  isDefault?: boolean;
}

export type UpdateAddressRequest = Partial<Omit<CreateAddressRequest, "isDefault">>;

export interface UpdateAddressVariables {
  addressId: string;
  request: UpdateAddressRequest;
}

export interface AddressMessageResponse {
  message: string;
}
