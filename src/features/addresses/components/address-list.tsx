import { AddressCard } from "./address-card";
import type { Address } from "../types/address";

interface AddressListProps {
  addresses: Address[];
  onEdit: (address: Address) => void;
}

export function AddressList({ addresses, onEdit }: AddressListProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {addresses.map((address) => (
        <AddressCard key={address.id} address={address} onEdit={onEdit} />
      ))}
    </div>
  );
}
