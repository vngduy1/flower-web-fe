"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Alert, Button, Card, Input } from "@/components/ui";
import { normalizeApiError } from "@/lib/api/errors";

import { useCreateAddress } from "../hooks/use-create-address";
import { useUpdateAddress } from "../hooks/use-update-address";
import { addressSchema, type AddressFormValues } from "../schemas/address.schema";
import type { Address } from "../types/address";
import {
  addressToFormValues,
  emptyAddressFormValues,
  formValuesToCreateAddress,
  formValuesToUpdateAddress,
} from "../utils/address-mappers";

interface AddressFormProps {
  address?: Address;
  onCancel: () => void;
  onSaved: () => void;
}

export function AddressForm({ address, onCancel, onSaved }: AddressFormProps) {
  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();
  const isEditing = Boolean(address);
  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error ?? updateMutation.error;
  const error = mutationError ? normalizeApiError(mutationError) : null;
  const formId = address ? `edit-address-${address.id}` : "create-address";
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: address ? addressToFormValues(address) : emptyAddressFormValues,
  });

  useEffect(() => {
    reset(address ? addressToFormValues(address) : emptyAddressFormValues);
  }, [address, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (address) {
        await updateMutation.mutateAsync({
          addressId: address.id,
          request: formValuesToUpdateAddress(values),
        });
      } else {
        await createMutation.mutateAsync(formValuesToCreateAddress(values));
      }

      reset(emptyAddressFormValues);
      onSaved();
    } catch {
      // The normalized mutation error is rendered above the form.
    }
  });

  return (
    <Card className="border-brand/20">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-accent text-xs font-bold tracking-[0.15em] uppercase">
            {isEditing ? "Edit address" : "New address"}
          </p>
          <h2 className="text-brand-dark mt-2 font-serif text-2xl font-semibold">
            {isEditing ? "配送先を編集" : "配送先を追加"}
          </h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel} disabled={isPending}>
          閉じる
        </Button>
      </div>

      {error ? (
        <Alert className="mt-5" variant="error" title="保存できませんでした">
          {error.message}
        </Alert>
      ) : null}

      <form className="mt-7 grid gap-5" onSubmit={onSubmit} noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            id={`${formId}-label`}
            label="ラベル"
            placeholder="自宅、職場など"
            maxLength={50}
            error={errors.label?.message}
            disabled={isPending}
            {...register("label")}
          />
          <Input
            id={`${formId}-recipient-name`}
            label="受取人名"
            autoComplete="name"
            maxLength={100}
            required
            error={errors.recipientName?.message}
            disabled={isPending}
            {...register("recipientName")}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            id={`${formId}-recipient-phone`}
            label="受取人電話番号"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={20}
            required
            error={errors.recipientPhone?.message}
            disabled={isPending}
            {...register("recipientPhone")}
          />
          <Input
            id={`${formId}-postal-code`}
            label="郵便番号"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="123-4567"
            required
            error={errors.postalCode?.message}
            disabled={isPending}
            {...register("postalCode")}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            id={`${formId}-prefecture`}
            label="都道府県"
            autoComplete="address-level1"
            maxLength={20}
            required
            error={errors.prefecture?.message}
            disabled={isPending}
            {...register("prefecture")}
          />
          <Input
            id={`${formId}-city`}
            label="市区町村"
            autoComplete="address-level2"
            maxLength={100}
            required
            error={errors.city?.message}
            disabled={isPending}
            {...register("city")}
          />
        </div>
        <Input
          id={`${formId}-line1`}
          label="番地"
          autoComplete="address-line1"
          maxLength={255}
          required
          error={errors.addressLine1?.message}
          disabled={isPending}
          {...register("addressLine1")}
        />
        <Input
          id={`${formId}-line2`}
          label="建物名・部屋番号"
          autoComplete="address-line2"
          maxLength={255}
          error={errors.addressLine2?.message}
          disabled={isPending}
          {...register("addressLine2")}
        />

        {!isEditing ? (
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="accent-brand mt-0.5 size-4"
              disabled={isPending}
              {...register("isDefault")}
            />
            <span>
              <span className="font-semibold">標準の配送先に設定</span>
              <span className="text-muted-foreground mt-1 block text-xs">
                最初に登録した住所は自動的に標準の配送先として設定されます。
              </span>
            </span>
          </label>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" isLoading={isPending}>
            {isEditing ? "変更を保存" : "住所を登録"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isPending}
          >
            キャンセル
          </Button>
        </div>
      </form>
    </Card>
  );
}
