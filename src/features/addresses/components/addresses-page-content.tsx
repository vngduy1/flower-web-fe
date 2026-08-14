"use client";

import { useState } from "react";

import { Alert, Button, EmptyState } from "@/components/ui";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { normalizeApiError } from "@/lib/api/errors";

import { AddressForm } from "./address-form";
import { AddressList } from "./address-list";
import { AddressesSkeleton } from "./addresses-skeleton";
import { useAddresses } from "../hooks/use-addresses";
import type { Address } from "../types/address";

export function AddressesPageContent() {
  const { user } = useAuth();
  const addressesQuery = useAddresses(Boolean(user));
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  if (addressesQuery.isPending) {
    return <AddressesSkeleton />;
  }

  if (addressesQuery.error) {
    const error = normalizeApiError(addressesQuery.error);

    return (
      <div>
        <Alert variant="error" title="配送先を読み込めませんでした">
          {error.message}
        </Alert>
        <Button className="mt-5" onClick={() => void addressesQuery.refetch()}>
          再試行
        </Button>
      </div>
    );
  }

  const addresses = addressesQuery.data ?? [];
  const closeForm = () => {
    setEditingAddress(null);
    setIsCreating(false);
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-muted-foreground text-sm">{addresses.length}件の配送先</p>
        <Button
          onClick={() => {
            setEditingAddress(null);
            setIsCreating(true);
            setSavedMessage(null);
          }}
        >
          配送先を追加
        </Button>
      </div>

      {savedMessage ? <Alert variant="success">{savedMessage}</Alert> : null}

      {isCreating || editingAddress ? (
        <AddressForm
          address={editingAddress ?? undefined}
          onCancel={closeForm}
          onSaved={() => {
            setSavedMessage(
              editingAddress ? "配送先を更新しました。" : "配送先を追加しました。",
            );
            closeForm();
          }}
        />
      ) : null}

      {addresses.length ? (
        <AddressList
          addresses={addresses}
          onEdit={(address) => {
            setIsCreating(false);
            setEditingAddress(address);
            setSavedMessage(null);
          }}
        />
      ) : !isCreating ? (
        <EmptyState
          title="配送先が登録されていません"
          description="注文に使用する受取人名、電話番号、住所を登録してください。"
          action={<Button onClick={() => setIsCreating(true)}>最初の配送先を追加</Button>}
        />
      ) : null}
    </div>
  );
}
