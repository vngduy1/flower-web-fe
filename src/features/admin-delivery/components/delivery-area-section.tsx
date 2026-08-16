"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { Alert, Button, EmptyState, Input } from "@/components/ui";
import { normalizeApiError } from "@/lib/api";
import { formatYen } from "@/lib/format/currency";
import { formatDateTime } from "@/lib/format/date";

import {
  useAdminDeliveryAreas,
  useCreateAdminDeliveryArea,
  useUpdateAdminDeliveryArea,
} from "../hooks/use-admin-delivery";
import {
  deliveryAreaFormSchema,
  type DeliveryAreaFormValues,
} from "../schemas/admin-delivery.schema";
import type { AdminDeliveryArea } from "../types/admin-delivery";
import {
  buildDeliveryAreaRequest,
  getDeliveryAreaDefaults,
} from "../utils/admin-delivery";
import { DeliveryStatusDialog } from "./delivery-status-dialog";
import {
  DeliverySection,
  DeliverySectionSkeleton,
  DeliveryStatusBadge,
} from "./delivery-section-ui";

function DeliveryAreaFormDialog({
  area,
  onClose,
}: {
  area?: AdminDeliveryArea;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const createMutation = useCreateAdminDeliveryArea();
  const updateMutation = useUpdateAdminDeliveryArea(area?.id ?? "");
  const mutation = area ? updateMutation : createMutation;
  const form = useForm<DeliveryAreaFormValues>({
    resolver: zodResolver(deliveryAreaFormSchema),
    defaultValues: getDeliveryAreaDefaults(area),
  });
  const error = mutation.error ? normalizeApiError(mutation.error) : null;

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const submit: SubmitHandler<DeliveryAreaFormValues> = async (values) => {
    try {
      const request = buildDeliveryAreaRequest(values);
      if (area) {
        await updateMutation.mutateAsync(request);
      } else {
        await createMutation.mutateAsync(request);
      }
      dialogRef.current?.close();
    } catch {
      // Keep the normalized backend error visible for retry.
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="bg-surface text-foreground m-auto w-[min(94vw,680px)] rounded-3xl border p-0 shadow-2xl backdrop:bg-black/40"
      aria-labelledby="delivery-area-form-title"
      onCancel={(event) => {
        if (mutation.isPending) event.preventDefault();
      }}
      onClose={onClose}
    >
      <form
        className="p-6 sm:p-8"
        onSubmit={(event) => void form.handleSubmit(submit)(event)}
        noValidate
      >
        <p className="text-accent text-xs font-bold tracking-[.16em] uppercase">
          Delivery area
        </p>
        <h2
          id="delivery-area-form-title"
          className="text-brand-dark mt-3 font-serif text-2xl font-semibold"
        >
          配送エリアを{area ? "編集" : "作成"}
        </h2>
        {error ? (
          <Alert className="mt-5" variant="error" title="保存できませんでした">
            {error.messages.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </Alert>
        ) : null}
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Input
            id="delivery-area-prefecture"
            label="都道府県"
            required
            maxLength={100}
            error={form.formState.errors.prefecture?.message}
            {...form.register("prefecture")}
          />
          <Input
            id="delivery-area-city"
            label="市区町村"
            required
            maxLength={100}
            error={form.formState.errors.city?.message}
            {...form.register("city")}
          />
          <Input
            id="delivery-area-name"
            label="エリア名"
            required
            maxLength={150}
            error={form.formState.errors.areaName?.message}
            {...form.register("areaName")}
          />
          <Input
            id="delivery-area-fee"
            label="配送料（円）"
            required
            type="number"
            min="0"
            max="1000000"
            step="any"
            error={form.formState.errors.deliveryFee?.message}
            {...form.register("deliveryFee")}
          />
        </div>
        <label className="mt-5 flex min-h-11 items-center gap-3 text-sm font-semibold">
          <input type="checkbox" className="size-4" {...form.register("isActive")} />
          有効にする
        </label>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            disabled={mutation.isPending}
            onClick={() => dialogRef.current?.close()}
          >
            キャンセル
          </Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {area ? "変更を保存" : "エリアを作成"}
          </Button>
        </div>
      </form>
    </dialog>
  );
}

export function DeliveryAreaSection() {
  const query = useAdminDeliveryAreas();
  const [formTarget, setFormTarget] = useState<{ area?: AdminDeliveryArea } | null>(null);
  const [statusTarget, setStatusTarget] = useState<AdminDeliveryArea | null>(null);

  return (
    <DeliverySection
      id="delivery-areas-heading"
      eyebrow="Delivery areas"
      title="配送エリア"
      description="対応する都道府県・市区町村と、そのエリアの配送料を管理します。"
      action={<Button onClick={() => setFormTarget({})}>エリアを作成</Button>}
    >
      {query.isPending ? <DeliverySectionSkeleton /> : null}
      {query.error ? (
        <Alert className="mt-6" variant="error" title="配送エリアを読み込めませんでした">
          <p>{normalizeApiError(query.error).message}</p>
          <Button className="mt-3" size="sm" onClick={() => void query.refetch()}>
            再試行
          </Button>
        </Alert>
      ) : null}
      {query.data?.length === 0 ? (
        <EmptyState
          className="mt-6"
          headingLevel="h2"
          title="配送エリアはありません"
          description="配送エリアが登録されていません。"
          action={<Button onClick={() => setFormTarget({})}>最初のエリアを作成</Button>}
        />
      ) : null}
      {query.data?.length ? (
        <div className="border-brand/10 mt-6 overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-262.5 text-left text-sm">
            <caption className="sr-only">配送エリア一覧</caption>
            <thead className="bg-brand-soft/35 text-muted-foreground text-xs">
              <tr>
                <th scope="col" className="px-4 py-3">
                  都道府県・市区町村
                </th>
                <th scope="col" className="px-4 py-3">
                  エリア名
                </th>
                <th scope="col" className="px-4 py-3">
                  配送料
                </th>
                <th scope="col" className="px-4 py-3">
                  状態
                </th>
                <th scope="col" className="px-4 py-3">
                  作成・更新日時
                </th>
                <th scope="col" className="px-4 py-3">
                  <span className="sr-only">操作</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-brand/10 divide-y">
              {query.data.map((area) => (
                <tr key={area.id} className="align-top">
                  <td className="px-4 py-4 font-semibold">
                    {area.prefecture} {area.city}
                  </td>
                  <td className="px-4 py-4">{area.areaName}</td>
                  <td className="px-4 py-4">{formatYen(area.deliveryFee)}</td>
                  <td className="px-4 py-4">
                    <DeliveryStatusBadge isActive={area.isActive} />
                  </td>
                  <td className="px-4 py-4 text-xs">
                    <p>作成 {formatDateTime(area.createdAt)}</p>
                    <p className="text-muted-foreground mt-1">
                      更新 {formatDateTime(area.updatedAt)}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setFormTarget({ area })}
                      >
                        編集
                      </Button>
                      <Button
                        size="sm"
                        variant={area.isActive ? "danger" : "ghost"}
                        onClick={() => setStatusTarget(area)}
                      >
                        {area.isActive ? "無効化" : "有効化"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {formTarget ? (
        <DeliveryAreaFormDialog
          area={formTarget.area}
          onClose={() => setFormTarget(null)}
        />
      ) : null}
      {statusTarget ? (
        <DeliveryStatusDialog
          id={statusTarget.id}
          kind="area"
          label={`${statusTarget.prefecture} ${statusTarget.city} — ${statusTarget.areaName}`}
          isActive={statusTarget.isActive}
          onClose={() => setStatusTarget(null)}
        />
      ) : null}
    </DeliverySection>
  );
}
