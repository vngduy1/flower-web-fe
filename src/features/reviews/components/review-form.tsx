"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Alert, Button, Input } from "@/components/ui";
import { normalizeApiError } from "@/lib/api/errors";

import { RatingInput } from "./rating-input";
import { useCreateReview } from "../hooks/use-create-review";
import {
  createReviewSchema,
  type CreateReviewFormValues,
} from "../schemas/create-review.schema";
import type { MyReview } from "../types/review";

export interface ReviewableOrderItem {
  deliveryDate: string;
  orderItemId: string;
  orderNumber: string;
}

interface ReviewFormProps {
  items: ReviewableOrderItem[];
  onSuccess: (review: MyReview) => void;
}

export function ReviewForm({ items, onSuccess }: ReviewFormProps) {
  const createMutation = useCreateReview();
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<CreateReviewFormValues>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      orderItemId: items[0]?.orderItemId ?? "",
      rating: 5,
      title: "",
      comment: "",
    },
  });
  const error = createMutation.error ? normalizeApiError(createMutation.error) : null;

  const onSubmit = handleSubmit(async (values) => {
    const title = values.title.trim();

    try {
      const review = await createMutation.mutateAsync({
        orderItemId: values.orderItemId,
        rating: values.rating,
        ...(title ? { title } : {}),
        comment: values.comment.trim(),
      });
      onSuccess(review);
      reset({
        orderItemId: items[0]?.orderItemId ?? "",
        rating: 5,
        title: "",
        comment: "",
      });
    } catch {
      // The normalized backend error remains visible below the form.
    }
  });

  return (
    <form className="grid gap-5" onSubmit={(event) => void onSubmit(event)}>
      {items.length > 1 ? (
        <div className="grid gap-2">
          <label htmlFor="review-order-item" className="text-sm font-semibold">
            購入した商品
          </label>
          <select
            id="review-order-item"
            className="focus:border-brand min-h-11 rounded-xl border bg-white px-3.5 text-sm shadow-sm focus:outline-none"
            {...register("orderItemId")}
          >
            {items.map((item) => (
              <option key={item.orderItemId} value={item.orderItemId}>
                {item.orderNumber} / 配達日 {item.deliveryDate}
              </option>
            ))}
          </select>
          {errors.orderItemId ? (
            <p className="text-sm text-red-700" role="alert">
              {errors.orderItemId.message}
            </p>
          ) : null}
        </div>
      ) : (
        <input type="hidden" {...register("orderItemId")} />
      )}

      <Controller
        control={control}
        name="rating"
        render={({ field }) => (
          <RatingInput
            id="review-rating"
            value={field.value}
            onChange={field.onChange}
            disabled={createMutation.isPending}
            error={errors.rating?.message}
          />
        )}
      />

      <Input
        id="review-title"
        label="タイトル（任意）"
        maxLength={150}
        error={errors.title?.message}
        disabled={createMutation.isPending}
        {...register("title")}
      />

      <div className="grid gap-2">
        <label htmlFor="review-comment" className="text-sm font-semibold">
          レビュー本文<span className="text-accent ml-1">*</span>
        </label>
        <textarea
          id="review-comment"
          rows={6}
          maxLength={3000}
          disabled={createMutation.isPending}
          aria-invalid={Boolean(errors.comment)}
          aria-describedby={errors.comment ? "review-comment-error" : undefined}
          className="focus:border-brand disabled:bg-surface-muted min-h-36 w-full resize-y rounded-xl border bg-white px-3.5 py-3 text-base shadow-sm focus:outline-none disabled:cursor-not-allowed sm:text-sm"
          {...register("comment")}
        />
        {errors.comment ? (
          <p id="review-comment-error" className="text-sm text-red-700" role="alert">
            {errors.comment.message}
          </p>
        ) : (
          <p className="text-muted-foreground text-xs">最大3000文字</p>
        )}
      </div>

      {error ? (
        <Alert variant="error" title="レビューを送信できませんでした">
          {error.message}
        </Alert>
      ) : null}

      <div>
        <Button type="submit" isLoading={createMutation.isPending}>
          レビューを送信
        </Button>
      </div>
    </form>
  );
}
