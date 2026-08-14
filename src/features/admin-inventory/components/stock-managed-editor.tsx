"use client";

import { Alert, Button } from "@/components/ui";
import { normalizeApiError } from "@/lib/api";

import { useUpdateStockManaged } from "../hooks/use-inventory";

export function StockManagedEditor({
  productId,
  value,
}: {
  productId: string;
  value: boolean;
}) {
  const mutation = useUpdateStockManaged(productId);
  const next = !value;
  async function update() {
    const message = next
      ? "在庫管理を有効にしますか？"
      : "在庫管理を無効にしますか？無効中は在庫調整できず、利用可能数は返されません。";
    if (!window.confirm(message)) return;
    try {
      await mutation.mutateAsync(next);
    } catch {
      return;
    }
  }
  return (
    <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="font-serif text-xl font-semibold">在庫管理</h2>
      <p className="text-muted-foreground mt-2 text-sm">
        現在:{" "}
        <span className="text-foreground font-semibold">{value ? "有効" : "無効"}</span>
      </p>
      <Button
        className="mt-4"
        variant={value ? "danger" : "primary"}
        size="sm"
        isLoading={mutation.isPending}
        onClick={() => void update()}
      >
        {value ? "無効にする" : "有効にする"}
      </Button>
      {mutation.error ? (
        <Alert className="mt-4" variant="error">
          {normalizeApiError(mutation.error).message}
        </Alert>
      ) : null}
    </section>
  );
}
