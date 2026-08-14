"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";

import { Alert, Button, Input } from "@/components/ui";
import { normalizeApiError } from "@/lib/api";

import { useAdjustInventory } from "../hooks/use-inventory";
import {
  inventoryAdjustmentSchema,
  type InventoryAdjustmentValues,
} from "../schemas/inventory.schema";
import type { Inventory } from "../types/inventory";

const selectClass =
  "min-h-11 w-full rounded-xl border bg-white px-3 text-sm focus:border-brand focus:outline-none";

function calculateAfter(
  stock: number,
  changeType: InventoryAdjustmentValues["changeType"],
  quantity: number,
) {
  if (changeType === "ADJUSTMENT") return quantity;
  if (changeType === "MANUAL_DECREASE") return stock - quantity;
  return stock + quantity;
}

export function InventoryAdjustmentDialog({ inventory }: { inventory: Inventory }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const mutation = useAdjustInventory(inventory.product.id);
  const form = useForm<InventoryAdjustmentValues>({
    resolver: zodResolver(inventoryAdjustmentSchema),
    defaultValues: { changeType: "MANUAL_INCREASE", quantity: 1, reason: "" },
  });
  const error = mutation.error ? normalizeApiError(mutation.error) : null;
  const changeType = useWatch({ control: form.control, name: "changeType" });
  const quantity = useWatch({ control: form.control, name: "quantity" });
  const quantityAfter = calculateAfter(inventory.stockQuantity, changeType, quantity);

  const close = () => {
    dialogRef.current?.close();
    mutation.reset();
    form.reset();
  };

  const submit: SubmitHandler<InventoryAdjustmentValues> = async (data) => {
    const reason = data.reason.trim();
    try {
      await mutation.mutateAsync({
        changeType: data.changeType,
        quantity: data.quantity,
        ...(reason ? { reason } : {}),
      });
      close();
    } catch {
      // The normalized backend conflict remains visible in the dialog.
    }
  };

  return (
    <>
      <Button
        disabled={!inventory.isStockManaged}
        onClick={() => dialogRef.current?.showModal()}
      >
        在庫を調整
      </Button>
      <dialog
        ref={dialogRef}
        className="bg-surface text-foreground m-auto w-[min(92vw,600px)] rounded-3xl border p-0 shadow-2xl backdrop:bg-black/40"
        aria-labelledby="inventory-adjustment-title"
        onCancel={(event) => {
          if (mutation.isPending) event.preventDefault();
        }}
        onClose={() => {
          mutation.reset();
          form.reset();
        }}
      >
        <form
          className="p-6 sm:p-8"
          onSubmit={(event) => void form.handleSubmit(submit)(event)}
        >
          <p className="text-accent text-xs font-bold tracking-[.16em] uppercase">
            Stock adjustment
          </p>
          <h2
            id="inventory-adjustment-title"
            className="text-brand-dark mt-3 font-serif text-2xl font-semibold"
          >
            在庫数を調整しますか？
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">
            実行結果は操作者と理由を含む在庫履歴に記録されます。
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold">
              変更種別
              <select
                className={selectClass}
                disabled={mutation.isPending}
                {...form.register("changeType")}
              >
                <option value="IMPORT">入荷</option>
                <option value="MANUAL_INCREASE">手動増加</option>
                <option value="MANUAL_DECREASE">手動減少</option>
                <option value="ADJUSTMENT">最終在庫数を指定</option>
              </select>
            </label>
            <Input
              id="adjustment-quantity"
              label={changeType === "ADJUSTMENT" ? "変更後の在庫数" : "変更数量"}
              type="number"
              min="0"
              step="1"
              disabled={mutation.isPending}
              error={form.formState.errors.quantity?.message}
              {...form.register("quantity", { valueAsNumber: true })}
            />
            <label className="grid gap-2 text-sm font-semibold sm:col-span-2">
              理由（任意）
              <textarea
                rows={4}
                maxLength={500}
                disabled={mutation.isPending}
                className="focus:border-brand rounded-xl border bg-white px-3.5 py-3 text-sm focus:outline-none"
                {...form.register("reason")}
              />
              {form.formState.errors.reason ? (
                <span className="text-sm text-red-700">
                  {form.formState.errors.reason.message}
                </span>
              ) : (
                <span className="text-muted-foreground text-xs">
                  最大500文字。空白のみは送信しません。
                </span>
              )}
            </label>
          </div>
          <div className="bg-brand-soft/30 mt-5 grid grid-cols-3 gap-3 rounded-2xl p-4 text-center text-sm">
            <div>
              <p className="text-muted-foreground text-xs">変更前</p>
              <p className="mt-1 font-semibold">{inventory.stockQuantity}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">差分</p>
              <p className="mt-1 font-semibold">
                {quantityAfter - inventory.stockQuantity > 0 ? "+" : ""}
                {quantityAfter - inventory.stockQuantity}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">変更後</p>
              <p className="mt-1 font-semibold">{quantityAfter}</p>
            </div>
          </div>
          {quantityAfter < inventory.reservedQuantity ? (
            <Alert className="mt-5" variant="warning">
              変更後の在庫数が引当数 {inventory.reservedQuantity}{" "}
              を下回るため、この数量には変更できません。
            </Alert>
          ) : null}
          {error ? (
            <Alert className="mt-5" variant="error" title="在庫を調整できませんでした">
              {error.message}
            </Alert>
          ) : null}
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" disabled={mutation.isPending} onClick={close}>
              キャンセル
            </Button>
            <Button
              type="submit"
              variant={
                changeType === "MANUAL_DECREASE" ||
                quantityAfter < inventory.stockQuantity
                  ? "danger"
                  : "primary"
              }
              isLoading={mutation.isPending}
            >
              確認して実行
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
}
