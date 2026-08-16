"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { Alert, Button, EmptyState, Input } from "@/components/ui";
import { normalizeApiError } from "@/lib/api";
import { formatDate, formatDateTime } from "@/lib/format/date";

import {
  useAdminDeliveryBlackoutDates,
  useCreateAdminDeliveryBlackoutDate,
  useUpdateAdminDeliveryBlackoutDate,
} from "../hooks/use-admin-delivery";
import {
  deliveryBlackoutDateFormSchema,
  type DeliveryBlackoutDateFormValues,
} from "../schemas/admin-delivery.schema";
import type { AdminDeliveryBlackoutDate } from "../types/admin-delivery";
import {
  buildDeliveryBlackoutDateRequest,
  getDeliveryBlackoutDateDefaults,
} from "../utils/admin-delivery";
import { DeliveryStatusDialog } from "./delivery-status-dialog";
import {
  DeliverySection,
  DeliverySectionSkeleton,
  DeliveryStatusBadge,
} from "./delivery-section-ui";

function DeliveryBlackoutFormDialog({
  blackoutDate,
  onClose,
}: {
  blackoutDate?: AdminDeliveryBlackoutDate;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const createMutation = useCreateAdminDeliveryBlackoutDate();
  const updateMutation = useUpdateAdminDeliveryBlackoutDate(blackoutDate?.id ?? "");
  const mutation = blackoutDate ? updateMutation : createMutation;
  const form = useForm<DeliveryBlackoutDateFormValues>({
    resolver: zodResolver(deliveryBlackoutDateFormSchema),
    defaultValues: getDeliveryBlackoutDateDefaults(blackoutDate),
  });
  const error = mutation.error ? normalizeApiError(mutation.error) : null;

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const submit: SubmitHandler<DeliveryBlackoutDateFormValues> = async (values) => {
    try {
      const request = buildDeliveryBlackoutDateRequest(values);
      if (blackoutDate) {
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
      className="bg-surface text-foreground m-auto w-[min(94vw,640px)] rounded-3xl border p-0 shadow-2xl backdrop:bg-black/40"
      aria-labelledby="delivery-blackout-form-title"
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
          Blackout date
        </p>
        <h2
          id="delivery-blackout-form-title"
          className="text-brand-dark mt-3 font-serif text-2xl font-semibold"
        >
          配送不可日を{blackoutDate ? "編集" : "作成"}
        </h2>
        <p className="text-muted-foreground mt-3 text-sm">
          配送不可日は日付ごとに設定します。
        </p>
        {error ? (
          <Alert className="mt-5" variant="error" title="保存できませんでした">
            {error.messages.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </Alert>
        ) : null}
        <div className="mt-6 grid gap-5">
          <Input
            id="delivery-blackout-date"
            label="配送不可日"
            required
            type="date"
            error={form.formState.errors.blackoutDate?.message}
            {...form.register("blackoutDate")}
          />
          <div className="grid gap-2">
            <label htmlFor="delivery-blackout-reason" className="text-sm font-semibold">
              理由{" "}
              <span className="text-accent" aria-hidden="true">
                *
              </span>
            </label>
            <textarea
              id="delivery-blackout-reason"
              rows={4}
              maxLength={255}
              required
              aria-invalid={Boolean(form.formState.errors.reason)}
              aria-describedby={
                form.formState.errors.reason
                  ? "delivery-blackout-reason-error"
                  : undefined
              }
              className="focus:border-brand min-h-28 rounded-xl border bg-white px-3.5 py-3 text-base shadow-sm focus:outline-none sm:text-sm"
              {...form.register("reason")}
            />
            {form.formState.errors.reason ? (
              <p
                id="delivery-blackout-reason-error"
                className="text-sm text-red-700"
                role="alert"
              >
                {form.formState.errors.reason.message}
              </p>
            ) : null}
          </div>
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
            {blackoutDate ? "変更を保存" : "配送不可日を作成"}
          </Button>
        </div>
      </form>
    </dialog>
  );
}

export function DeliveryBlackoutSection() {
  const query = useAdminDeliveryBlackoutDates();
  const [formTarget, setFormTarget] = useState<{
    blackoutDate?: AdminDeliveryBlackoutDate;
  } | null>(null);
  const [statusTarget, setStatusTarget] = useState<AdminDeliveryBlackoutDate | null>(
    null,
  );

  return (
    <DeliverySection
      id="delivery-blackout-heading"
      eyebrow="Blackout dates"
      title="配送不可日"
      description="指定日のすべての有効な配送枠を、購入者向けの選択肢から除外します。"
      action={<Button onClick={() => setFormTarget({})}>配送不可日を作成</Button>}
    >
      {query.isPending ? <DeliverySectionSkeleton /> : null}
      {query.error ? (
        <Alert className="mt-6" variant="error" title="配送不可日を読み込めませんでした">
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
          title="配送不可日はありません"
          description="配送不可日が登録されていません。"
          action={
            <Button onClick={() => setFormTarget({})}>最初の配送不可日を作成</Button>
          }
        />
      ) : null}
      {query.data?.length ? (
        <div className="border-brand/10 mt-6 overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-245 text-left text-sm">
            <caption className="sr-only">配送不可日一覧</caption>
            <thead className="bg-brand-soft/35 text-muted-foreground text-xs">
              <tr>
                <th scope="col" className="px-4 py-3">
                  日付
                </th>
                <th scope="col" className="px-4 py-3">
                  理由
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
              {query.data.map((blackoutDate) => (
                <tr key={blackoutDate.id} className="align-top">
                  <td className="px-4 py-4 font-semibold">
                    {formatDate(blackoutDate.blackoutDate)}
                  </td>
                  <td className="max-w-lg px-4 py-4 whitespace-pre-wrap">
                    {blackoutDate.reason}
                  </td>
                  <td className="px-4 py-4">
                    <DeliveryStatusBadge isActive={blackoutDate.isActive} />
                  </td>
                  <td className="px-4 py-4 text-xs">
                    <p>作成 {formatDateTime(blackoutDate.createdAt)}</p>
                    <p className="text-muted-foreground mt-1">
                      更新 {formatDateTime(blackoutDate.updatedAt)}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setFormTarget({ blackoutDate })}
                      >
                        編集
                      </Button>
                      <Button
                        size="sm"
                        variant={blackoutDate.isActive ? "danger" : "ghost"}
                        onClick={() => setStatusTarget(blackoutDate)}
                      >
                        {blackoutDate.isActive ? "無効化" : "有効化"}
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
        <DeliveryBlackoutFormDialog
          blackoutDate={formTarget.blackoutDate}
          onClose={() => setFormTarget(null)}
        />
      ) : null}
      {statusTarget ? (
        <DeliveryStatusDialog
          id={statusTarget.id}
          kind="blackoutDate"
          label={`${formatDate(statusTarget.blackoutDate)} — ${statusTarget.reason}`}
          isActive={statusTarget.isActive}
          onClose={() => setStatusTarget(null)}
        />
      ) : null}
    </DeliverySection>
  );
}
