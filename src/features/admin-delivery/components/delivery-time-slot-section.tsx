"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { Alert, Button, EmptyState, Input } from "@/components/ui";
import { normalizeApiError } from "@/lib/api";
import { formatDateTime } from "@/lib/format/date";

import {
  useAdminDeliveryTimeSlots,
  useCreateAdminDeliveryTimeSlot,
  useUpdateAdminDeliveryTimeSlot,
} from "../hooks/use-admin-delivery";
import {
  deliveryTimeSlotFormSchema,
  type DeliveryTimeSlotFormValues,
} from "../schemas/admin-delivery.schema";
import type { AdminDeliveryTimeSlot } from "../types/admin-delivery";
import {
  buildDeliveryTimeSlotRequest,
  getDeliveryTimeSlotDefaults,
  normalizeTimeInput,
} from "../utils/admin-delivery";
import { DeliveryStatusDialog } from "./delivery-status-dialog";
import {
  DeliverySection,
  DeliverySectionSkeleton,
  DeliveryStatusBadge,
} from "./delivery-section-ui";

function DeliveryTimeSlotFormDialog({
  onClose,
  timeSlot,
}: {
  onClose: () => void;
  timeSlot?: AdminDeliveryTimeSlot;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const createMutation = useCreateAdminDeliveryTimeSlot();
  const updateMutation = useUpdateAdminDeliveryTimeSlot(timeSlot?.id ?? "");
  const mutation = timeSlot ? updateMutation : createMutation;
  const form = useForm<DeliveryTimeSlotFormValues>({
    resolver: zodResolver(deliveryTimeSlotFormSchema),
    defaultValues: getDeliveryTimeSlotDefaults(timeSlot),
  });
  const error = mutation.error ? normalizeApiError(mutation.error) : null;

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const submit: SubmitHandler<DeliveryTimeSlotFormValues> = async (values) => {
    try {
      const request = buildDeliveryTimeSlotRequest(values);
      if (timeSlot) {
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
      className="bg-surface text-foreground m-auto w-[min(94vw,720px)] rounded-3xl border p-0 shadow-2xl backdrop:bg-black/40"
      aria-labelledby="delivery-time-slot-form-title"
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
          Delivery time slot
        </p>
        <h2
          id="delivery-time-slot-form-title"
          className="text-brand-dark mt-3 font-serif text-2xl font-semibold"
        >
          配送時間帯を{timeSlot ? "編集" : "作成"}
        </h2>
        <p className="text-muted-foreground mt-3 text-sm leading-6">
          有効な時間帯同士は重複できません。隣接する時間帯は登録できます。
        </p>
        {error ? (
          <Alert className="mt-5" variant="error" title="保存できませんでした">
            {error.messages.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </Alert>
        ) : null}
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Input
            id="delivery-time-slot-code"
            label="時間帯コード"
            required
            maxLength={50}
            autoCapitalize="characters"
            hint="半角大文字、数字、アンダースコアのみ"
            error={form.formState.errors.slotCode?.message}
            {...form.register("slotCode")}
          />
          <Input
            id="delivery-time-slot-name"
            label="表示名"
            required
            maxLength={100}
            error={form.formState.errors.displayName?.message}
            {...form.register("displayName")}
          />
          <Input
            id="delivery-time-slot-start"
            label="開始時刻"
            required
            type="time"
            error={form.formState.errors.startTime?.message}
            {...form.register("startTime")}
          />
          <Input
            id="delivery-time-slot-end"
            label="終了時刻"
            required
            type="time"
            error={form.formState.errors.endTime?.message}
            {...form.register("endTime")}
          />
          <Input
            id="delivery-time-slot-capacity"
            label="既定容量"
            required
            type="number"
            min="1"
            max="1000"
            step="1"
            error={form.formState.errors.defaultCapacity?.message}
            {...form.register("defaultCapacity")}
          />
          <Input
            id="delivery-time-slot-sort-order"
            label="表示順"
            required
            type="number"
            min="0"
            step="1"
            error={form.formState.errors.sortOrder?.message}
            {...form.register("sortOrder")}
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
            {timeSlot ? "変更を保存" : "時間帯を作成"}
          </Button>
        </div>
      </form>
    </dialog>
  );
}

export function DeliveryTimeSlotSection() {
  const query = useAdminDeliveryTimeSlots();
  const [formTarget, setFormTarget] = useState<{
    timeSlot?: AdminDeliveryTimeSlot;
  } | null>(null);
  const [statusTarget, setStatusTarget] = useState<AdminDeliveryTimeSlot | null>(null);

  return (
    <DeliverySection
      id="delivery-time-slots-heading"
      eyebrow="Time slots"
      title="配送時間帯"
      description="時間帯の表示、並び順、既定容量を管理します。実際に選択できる枠は個別日の容量設定が必要です。"
      action={<Button onClick={() => setFormTarget({})}>時間帯を作成</Button>}
    >
      {query.isPending ? <DeliverySectionSkeleton /> : null}
      {query.error ? (
        <Alert className="mt-6" variant="error" title="配送時間帯を読み込めませんでした">
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
          title="配送時間帯はありません"
          description="配送時間帯が登録されていません。"
          action={<Button onClick={() => setFormTarget({})}>最初の時間帯を作成</Button>}
        />
      ) : null}
      {query.data?.length ? (
        <div className="border-brand/10 mt-6 overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-[1150px] text-left text-sm">
            <caption className="sr-only">配送時間帯一覧</caption>
            <thead className="bg-brand-soft/35 text-muted-foreground text-xs">
              <tr>
                <th scope="col" className="px-4 py-3">
                  コード・表示名
                </th>
                <th scope="col" className="px-4 py-3">
                  時間
                </th>
                <th scope="col" className="px-4 py-3">
                  既定容量
                </th>
                <th scope="col" className="px-4 py-3">
                  表示順
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
              {query.data.map((timeSlot) => (
                <tr key={timeSlot.id} className="align-top">
                  <td className="px-4 py-4">
                    <p className="font-semibold">{timeSlot.displayName}</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {timeSlot.slotCode}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    {normalizeTimeInput(timeSlot.startTime)}–
                    {normalizeTimeInput(timeSlot.endTime)}
                  </td>
                  <td className="px-4 py-4">{timeSlot.defaultCapacity}件</td>
                  <td className="px-4 py-4">{timeSlot.sortOrder}</td>
                  <td className="px-4 py-4">
                    <DeliveryStatusBadge isActive={timeSlot.isActive} />
                  </td>
                  <td className="px-4 py-4 text-xs">
                    <p>作成 {formatDateTime(timeSlot.createdAt)}</p>
                    <p className="text-muted-foreground mt-1">
                      更新 {formatDateTime(timeSlot.updatedAt)}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setFormTarget({ timeSlot })}
                      >
                        編集
                      </Button>
                      <Button
                        size="sm"
                        variant={timeSlot.isActive ? "danger" : "ghost"}
                        onClick={() => setStatusTarget(timeSlot)}
                      >
                        {timeSlot.isActive ? "無効化" : "有効化"}
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
        <DeliveryTimeSlotFormDialog
          timeSlot={formTarget.timeSlot}
          onClose={() => setFormTarget(null)}
        />
      ) : null}
      {statusTarget ? (
        <DeliveryStatusDialog
          id={statusTarget.id}
          kind="timeSlot"
          label={`${statusTarget.slotCode} — ${statusTarget.displayName}`}
          isActive={statusTarget.isActive}
          onClose={() => setStatusTarget(null)}
        />
      ) : null}
    </DeliverySection>
  );
}
