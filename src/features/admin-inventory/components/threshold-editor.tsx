"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Alert, Button, Input } from "@/components/ui";
import { normalizeApiError } from "@/lib/api";

import { useUpdateThreshold } from "../hooks/use-inventory";
import { thresholdSchema, type ThresholdValues } from "../schemas/inventory.schema";

export function ThresholdEditor({
  productId,
  value,
}: {
  productId: string;
  value: number;
}) {
  const mutation = useUpdateThreshold(productId);
  const form = useForm<ThresholdValues>({
    resolver: zodResolver(thresholdSchema),
    defaultValues: { lowStockThreshold: value },
  });

  async function submit(data: ThresholdValues) {
    if (!window.confirm(`低在庫の警告閾値を ${data.lowStockThreshold} に変更しますか？`))
      return;
    try {
      await mutation.mutateAsync(data.lowStockThreshold);
      form.reset(data);
    } catch {
      // The normalized mutation error remains visible below the editor.
    }
  }

  return (
    <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="font-serif text-xl font-semibold">低在庫の閾値</h2>
      <p className="text-muted-foreground mt-2 text-xs leading-5">
        利用可能数がこの値以下になると「残りわずか」です。
      </p>
      <form
        className="mt-4 flex items-start gap-3"
        onSubmit={(event) => void form.handleSubmit(submit)(event)}
      >
        <div className="flex-1">
          <Input
            id="low-stock-threshold"
            label="閾値"
            type="number"
            min="0"
            step="1"
            error={form.formState.errors.lowStockThreshold?.message}
            {...form.register("lowStockThreshold", { valueAsNumber: true })}
          />
        </div>
        <Button
          className="mt-7"
          size="sm"
          type="submit"
          isLoading={mutation.isPending}
          disabled={!form.formState.isDirty}
        >
          保存
        </Button>
      </form>
      {mutation.error ? (
        <Alert className="mt-4" variant="error">
          {normalizeApiError(mutation.error).message}
        </Alert>
      ) : null}
    </section>
  );
}
