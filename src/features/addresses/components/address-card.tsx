"use client";

import { Alert, Button } from "@/components/ui";
import { normalizeApiError } from "@/lib/api/errors";

import { DeleteAddressDialog } from "./delete-address-dialog";
import { useSetDefaultAddress } from "../hooks/use-set-default-address";
import type { Address } from "../types/address";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
}

export function AddressCard({ address, onEdit }: AddressCardProps) {
  const defaultMutation = useSetDefaultAddress();
  const error = defaultMutation.error ? normalizeApiError(defaultMutation.error) : null;

  return (
    <article className="bg-surface rounded-3xl border p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-brand-dark font-serif text-xl font-semibold">
              {address.label ?? "配送先"}
            </h2>
            {address.isDefault ? (
              <span className="bg-brand-soft text-brand-dark rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.12em] uppercase">
                標準
              </span>
            ) : null}
          </div>
          <p className="mt-3 text-sm font-semibold">{address.recipientName}</p>
          <address className="text-muted-foreground mt-2 text-sm leading-7 not-italic">
            〒{address.postalCode}
            <br />
            {address.prefecture}
            {address.city}
            {address.addressLine1}
            {address.addressLine2 ? ` ${address.addressLine2}` : ""}
            <br />
            {address.recipientPhone}
          </address>
        </div>
      </div>

      {error ? (
        <Alert className="mt-4" variant="error">
          {error.message}
        </Alert>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">
        <Button size="sm" variant="secondary" onClick={() => onEdit(address)}>
          編集
        </Button>
        {!address.isDefault ? (
          <Button
            size="sm"
            variant="ghost"
            isLoading={defaultMutation.isPending}
            onClick={() => defaultMutation.mutate(address.id)}
          >
            標準に設定
          </Button>
        ) : null}
        <DeleteAddressDialog address={address} />
      </div>
    </article>
  );
}
