import { apiClient, toApiPathSegment } from "@/lib/api";

import type {
  Address,
  AddressMessageResponse,
  CreateAddressRequest,
  UpdateAddressVariables,
} from "../types/address";

export async function getAddresses(): Promise<Address[]> {
  const response = await apiClient.get<Address[]>("/addresses");

  return response.data;
}

export async function createAddress(request: CreateAddressRequest): Promise<Address> {
  const response = await apiClient.post<Address>("/addresses", request);

  return response.data;
}

export async function updateAddress({
  addressId,
  request,
}: UpdateAddressVariables): Promise<Address> {
  const response = await apiClient.patch<Address>(
    `/addresses/${toApiPathSegment(addressId)}`,
    request,
  );

  return response.data;
}

export async function setDefaultAddress(addressId: string): Promise<Address> {
  const response = await apiClient.patch<Address>(
    `/addresses/${toApiPathSegment(addressId)}/default`,
  );

  return response.data;
}

export async function deleteAddress(addressId: string): Promise<AddressMessageResponse> {
  const response = await apiClient.delete<AddressMessageResponse>(
    `/addresses/${toApiPathSegment(addressId)}`,
  );

  return response.data;
}
