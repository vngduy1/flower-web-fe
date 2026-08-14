import type { AddressFormValues } from "../schemas/address.schema";
import type {
  Address,
  CreateAddressRequest,
  UpdateAddressRequest,
} from "../types/address";

export const emptyAddressFormValues: AddressFormValues = {
  label: "",
  recipientName: "",
  recipientPhone: "",
  postalCode: "",
  prefecture: "",
  city: "",
  addressLine1: "",
  addressLine2: "",
  isDefault: false,
};

export function addressToFormValues(address: Address): AddressFormValues {
  return {
    label: address.label ?? "",
    recipientName: address.recipientName,
    recipientPhone: address.recipientPhone,
    postalCode: address.postalCode,
    prefecture: address.prefecture,
    city: address.city,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2 ?? "",
    isDefault: address.isDefault,
  };
}

export function formValuesToCreateAddress(
  values: AddressFormValues,
): CreateAddressRequest {
  return {
    label: values.label || undefined,
    recipientName: values.recipientName,
    recipientPhone: values.recipientPhone,
    postalCode: values.postalCode,
    prefecture: values.prefecture,
    city: values.city,
    addressLine1: values.addressLine1,
    addressLine2: values.addressLine2 || undefined,
    isDefault: values.isDefault,
  };
}

export function formValuesToUpdateAddress(
  values: AddressFormValues,
): UpdateAddressRequest {
  return {
    label: values.label,
    recipientName: values.recipientName,
    recipientPhone: values.recipientPhone,
    postalCode: values.postalCode,
    prefecture: values.prefecture,
    city: values.city,
    addressLine1: values.addressLine1,
    addressLine2: values.addressLine2,
  };
}
