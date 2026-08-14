"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { Alert, Button, EmptyState, Input } from "@/components/ui";
import { normalizeApiError } from "@/lib/api";
import { formatDate, formatDateTime } from "@/lib/format/date";

import {
  useAdminDeliveryCapacities,
  useAdminDeliveryTimeSlots,
  useCreateAdminDeliveryCapacity,
  useUpdateAdminDeliveryCapacity,
} from "../hooks/use-admin-delivery";
import {
  deliveryCapacityFormSchema,
  type DeliveryCapacityFormValues,
} from "../schemas/admin-delivery.schema";
import type {
  AdminDeliveryCapacity,
  AdminDeliveryTimeSlot,
  UpdateAdminDeliveryCapacityRequest,
} from "../types/admin-delivery";
import {
  buildDeliveryCapacityRequest,
  getDeliveryCapacityDefaults,
  normalizeTimeInput,
} from "../utils/admin-delivery";
import { DeliveryStatusDialog } from "./delivery-status-dialog";
import {
  DeliverySection,
  DeliverySectionSkeleton,
  DeliveryStatusBadge,
  labelClassName,
  selectClassName,
} from "./delivery-section-ui";

function CapacityStateBadge({ capacity }: { capacity: AdminDeliveryCapacity }) {
  const className = capacity.isFull
    ? "bg-red-100 text-red-800"
    : capacity.remainingOrders <= 3
      ? "bg-amber-100 text-amber-800"
      : "bg-blue-100 text-blue-800";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      {capacity.isFull ? "満枠" : `残り${capacity.remainingOrders}件`}
    </span>
  );
}

function DeliveryCapacityFormDialog({
  capacity,
  onClose,
  timeSlots,
}: {
  capacity?: AdminDeliveryCapacity;
  onClose: () => void;
  timeSlots: AdminDeliveryTimeSlot[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const createMutation = useCreateAdminDeliveryCapacity();
  const updateMutation = useUpdateAdminDeliveryCapacity(capacity?.id ?? "");
  const mutation = capacity ? updateMutation : createMutation;
  const form = useForm<DeliveryCapacityFormValues>({
    resolver: zodResolver(deliveryCapacityFormSchema),
    defaultValues: getDeliveryCapacityDefaults(capacity),
  });
  const error = mutation.error ? normalizeApiError(mutation.error) : null;
  const selectableTimeSlots = timeSlots.filter(
    (timeSlot) => timeSlot.isActive || timeSlot.id === capacity?.timeSlot?.id,
  );

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const submit: SubmitHandler<DeliveryCapacityFormValues> = async (values) => {
    if (capacity && Number(values.maxOrders) < capacity.reservedOrders) {
      form.setError("maxOrders", {
        message: `最大注文数は予約済み注文数（${capacity.reservedOrders}件）以上にしてください。`,
      });
      return;
    }

    try {
      const request = buildDeliveryCapacityRequest(values);
      if (capacity) {
        const updateRequest: UpdateAdminDeliveryCapacityRequest = {
          deliveryDate: request.deliveryDate,
          maxOrders: request.maxOrders,
          isActive: request.isActive,
          ...(request.timeSlotId !== capacity.timeSlot?.id
            ? { timeSlotId: request.timeSlotId }
            : {}),
        };
        await updateMutation.mutateAsync(updateRequest);
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
      aria-labelledby="delivery-capacity-form-title"
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
          Delivery capacity
        </p>
        <h2
          id="delivery-capacity-form-title"
          className="text-brand-dark mt-3 font-serif text-2xl font-semibold"
        >
          日別容量を{capacity ? "編集" : "作成"}
        </h2>
        {capacity ? (
          <Alert className="mt-5">
            予約済み {capacity.reservedOrders}
            件。最大注文数をこれより小さくすることはできません。
          </Alert>
        ) : null}
        {error ? (
          <Alert className="mt-5" variant="error" title="保存できませんでした">
            {error.messages.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </Alert>
        ) : null}
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Input
            id="delivery-capacity-date"
            label="配送日"
            required
            type="date"
            error={form.formState.errors.deliveryDate?.message}
            {...form.register("deliveryDate")}
          />
          <div className="grid gap-2">
            <label htmlFor="delivery-capacity-time-slot" className={labelClassName}>
              時間帯{" "}
              <span className="text-accent" aria-hidden="true">
                *
              </span>
            </label>
            <select
              id="delivery-capacity-time-slot"
              className={selectClassName}
              required
              aria-invalid={Boolean(form.formState.errors.timeSlotId)}
              aria-describedby={
                form.formState.errors.timeSlotId
                  ? "delivery-capacity-time-slot-error"
                  : undefined
              }
              {...form.register("timeSlotId")}
            >
              <option value="">時間帯を選択</option>
              {selectableTimeSlots.map((timeSlot) => (
                <option key={timeSlot.id} value={timeSlot.id}>
                  {timeSlot.displayName}（{normalizeTimeInput(timeSlot.startTime)}–
                  {normalizeTimeInput(timeSlot.endTime)}）
                  {timeSlot.isActive ? "" : "・無効"}
                </option>
              ))}
            </select>
            {form.formState.errors.timeSlotId ? (
              <p
                id="delivery-capacity-time-slot-error"
                className="text-sm text-red-700"
                role="alert"
              >
                {form.formState.errors.timeSlotId.message}
              </p>
            ) : null}
          </div>
          <Input
            id="delivery-capacity-maximum"
            label="最大注文数"
            required
            type="number"
            min="1"
            max="10000"
            step="1"
            error={form.formState.errors.maxOrders?.message}
            {...form.register("maxOrders")}
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
            {capacity ? "変更を保存" : "日別容量を作成"}
          </Button>
        </div>
      </form>
    </dialog>
  );
}

export function DeliveryCapacitySection() {
  const query = useAdminDeliveryCapacities();
  const timeSlotsQuery = useAdminDeliveryTimeSlots();
  const [formTarget, setFormTarget] = useState<{
    capacity?: AdminDeliveryCapacity;
  } | null>(null);
  const [statusTarget, setStatusTarget] = useState<AdminDeliveryCapacity | null>(null);
  const timeSlots = timeSlotsQuery.data ?? [];
  const hasActiveTimeSlot = timeSlots.some((timeSlot) => timeSlot.isActive);

  return (
    <DeliverySection
      id="delivery-capacities-heading"
      eyebrow="Date capacities"
      title="日別配送容量"
      description="配送日と時間帯ごとに最大注文件数を設定します。予約状況や残りの受付可能件数も確認できます。"
      action={
        <Button
          disabled={timeSlotsQuery.isPending || !hasActiveTimeSlot}
          onClick={() => setFormTarget({})}
        >
          日別容量を作成
        </Button>
      }
    >
      {!timeSlotsQuery.isPending && !hasActiveTimeSlot ? (
        <Alert className="mt-6" variant="warning">
          日別容量を作成するには、有効な配送時間帯が必要です。
        </Alert>
      ) : null}
      {timeSlotsQuery.error ? (
        <Alert className="mt-6" variant="error" title="時間帯を読み込めませんでした">
          <p>{normalizeApiError(timeSlotsQuery.error).message}</p>
          <Button
            className="mt-3"
            size="sm"
            onClick={() => void timeSlotsQuery.refetch()}
          >
            再試行
          </Button>
        </Alert>
      ) : null}
      {query.isPending ? <DeliverySectionSkeleton /> : null}
      {query.error ? (
        <Alert
          className="mt-6"
          variant="error"
          title="日別配送容量を読み込めませんでした"
        >
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
          title="日別配送容量はありません"
          description="日付と時間帯を組み合わせた容量設定が登録されていません。"
          action={
            hasActiveTimeSlot ? (
              <Button onClick={() => setFormTarget({})}>最初の日別容量を作成</Button>
            ) : undefined
          }
        />
      ) : null}
      {query.data?.length ? (
        <div className="border-brand/10 mt-6 overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-[1250px] text-left text-sm">
            <caption className="sr-only">日別配送容量一覧</caption>
            <thead className="bg-brand-soft/35 text-muted-foreground text-xs">
              <tr>
                <th scope="col" className="px-4 py-3">
                  配送日
                </th>
                <th scope="col" className="px-4 py-3">
                  時間帯
                </th>
                <th scope="col" className="px-4 py-3">
                  最大
                </th>
                <th scope="col" className="px-4 py-3">
                  予約済み
                </th>
                <th scope="col" className="px-4 py-3">
                  残数
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
              {query.data.map((capacity) => (
                <tr key={capacity.id} className="align-top">
                  <td className="px-4 py-4 font-semibold">
                    {formatDate(capacity.deliveryDate)}
                  </td>
                  <td className="px-4 py-4">
                    {capacity.timeSlot ? (
                      <>
                        <p className="font-semibold">{capacity.timeSlot.displayName}</p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          {capacity.timeSlot.slotCode} /{" "}
                          {normalizeTimeInput(capacity.timeSlot.startTime)}–
                          {normalizeTimeInput(capacity.timeSlot.endTime)}
                        </p>
                      </>
                    ) : (
                      <span className="text-red-700">時間帯情報なし</span>
                    )}
                  </td>
                  <td className="px-4 py-4">{capacity.maxOrders}件</td>
                  <td className="px-4 py-4">{capacity.reservedOrders}件</td>
                  <td className="px-4 py-4">
                    <CapacityStateBadge capacity={capacity} />
                  </td>
                  <td className="px-4 py-4">
                    <DeliveryStatusBadge isActive={capacity.isActive} />
                  </td>
                  <td className="px-4 py-4 text-xs">
                    <p>作成 {formatDateTime(capacity.createdAt)}</p>
                    <p className="text-muted-foreground mt-1">
                      更新 {formatDateTime(capacity.updatedAt)}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={!capacity.timeSlot}
                        title={
                          !capacity.timeSlot
                            ? "レスポンスに時間帯IDがないため編集できません"
                            : undefined
                        }
                        onClick={() => setFormTarget({ capacity })}
                      >
                        編集
                      </Button>
                      <Button
                        size="sm"
                        variant={capacity.isActive ? "danger" : "ghost"}
                        onClick={() => setStatusTarget(capacity)}
                      >
                        {capacity.isActive ? "無効化" : "有効化"}
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
        <DeliveryCapacityFormDialog
          capacity={formTarget.capacity}
          timeSlots={timeSlots}
          onClose={() => setFormTarget(null)}
        />
      ) : null}
      {statusTarget ? (
        <DeliveryStatusDialog
          id={statusTarget.id}
          kind="capacity"
          label={`${formatDate(statusTarget.deliveryDate)} — ${statusTarget.timeSlot?.displayName ?? "時間帯情報なし"}`}
          isActive={statusTarget.isActive}
          onClose={() => setStatusTarget(null)}
        />
      ) : null}
    </DeliverySection>
  );
}
