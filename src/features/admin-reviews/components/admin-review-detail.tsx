"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Alert, Button, EmptyState, Skeleton } from "@/components/ui";
import { getOrderStatusLabel } from "@/features/orders/utils/order-labels";
import { RatingStars } from "@/features/reviews/components/rating-stars";
import { ReviewStatusBadge } from "@/features/reviews/components/review-status-badge";
import { normalizeApiError } from "@/lib/api";
import { formatDateTime } from "@/lib/format/date";

import { useAdminReview } from "../hooks/use-admin-reviews";
import { ApproveReviewDialog } from "./approve-review-dialog";
import { DeleteReviewDialog } from "./delete-review-dialog";
import { RejectReviewDialog } from "./reject-review-dialog";

function formatOptionalDateTime(value: string | null): string {
  return value ? formatDateTime(value) : "—";
}

export function AdminReviewDetail({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const detail = useAdminReview(id);

  if (detail.isPending) {
    return (
      <div
        className="grid gap-5"
        role="status"
        aria-label="レビュー詳細を読み込んでいます"
      >
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (detail.error || !detail.data) {
    return (
      <EmptyState
        title="レビューを読み込めませんでした"
        description={normalizeApiError(detail.error).message}
        action={<Button onClick={() => void detail.refetch()}>再試行</Button>}
      />
    );
  }

  const review = detail.data;

  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/admin/reviews" className="text-brand text-sm font-semibold">
        ← レビュー一覧
      </Link>

      {searchParams.get("restored") === "true" ? (
        <Alert className="mt-5" variant="success">
          レビューを復元しました。
        </Alert>
      ) : null}

      <div className="mt-5 flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-muted-foreground text-xs break-all">Review ID {review.id}</p>
          <h1 className="text-brand-dark mt-2 font-serif text-3xl font-semibold">
            {review.title ?? "タイトルなしのレビュー"}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <RatingStars rating={review.rating} showValue />
            <ReviewStatusBadge status={review.status} />
          </div>
        </div>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid content-start gap-6">
          <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-serif text-2xl font-semibold">レビュー内容</h2>
            <dl className="mt-5 grid gap-5 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs">タイトル</dt>
                <dd className="mt-1 font-semibold">{review.title ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">本文</dt>
                <dd className="mt-2 whitespace-pre-wrap">{review.comment}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">管理者コメント</dt>
                <dd className="mt-2 whitespace-pre-wrap">{review.adminComment ?? "—"}</dd>
              </div>
            </dl>
          </section>

          <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-serif text-2xl font-semibold">関連情報</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <div className="bg-brand-soft/25 rounded-2xl p-4">
                <h3 className="text-sm font-semibold">商品</h3>
                {review.product ? (
                  <dl className="mt-3 grid gap-2 text-sm">
                    <div>
                      <dt className="text-muted-foreground text-xs">商品名</dt>
                      <dd>
                        <Link
                          href={`/admin/products/${encodeURIComponent(review.product.id)}`}
                          className="text-brand font-semibold hover:underline"
                        >
                          {review.product.name}
                        </Link>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground text-xs">商品コード</dt>
                      <dd>{review.product.productCode}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground text-xs">商品ID / slug</dt>
                      <dd className="break-all">
                        {review.product.id} / {review.product.slug}
                      </dd>
                    </div>
                  </dl>
                ) : (
                  <p className="text-muted-foreground mt-3 text-sm">商品情報なし</p>
                )}
              </div>

              <div className="bg-brand-soft/25 rounded-2xl p-4">
                <h3 className="text-sm font-semibold">顧客</h3>
                {review.user ? (
                  <dl className="mt-3 grid gap-2 text-sm">
                    <div>
                      <dt className="text-muted-foreground text-xs">氏名</dt>
                      <dd>
                        <Link
                          href={`/admin/users/${encodeURIComponent(review.user.id)}`}
                          className="text-brand font-semibold hover:underline"
                        >
                          {review.user.fullName}
                        </Link>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground text-xs">メール</dt>
                      <dd className="break-all">{review.user.email}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground text-xs">電話 / 顧客ID</dt>
                      <dd>
                        {review.user.phone ?? "—"} / {review.user.id}
                      </dd>
                    </div>
                  </dl>
                ) : (
                  <p className="text-muted-foreground mt-3 text-sm">顧客情報なし</p>
                )}
              </div>

              <div className="bg-brand-soft/25 rounded-2xl p-4">
                <h3 className="text-sm font-semibold">注文</h3>
                {review.order ? (
                  <dl className="mt-3 grid gap-2 text-sm">
                    <div>
                      <dt className="text-muted-foreground text-xs">注文番号</dt>
                      <dd>
                        <Link
                          href={`/admin/orders/${encodeURIComponent(review.order.id)}`}
                          className="text-brand font-semibold hover:underline"
                        >
                          {review.order.orderNumber}
                        </Link>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground text-xs">注文状態</dt>
                      <dd>{getOrderStatusLabel(review.order.status)}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground text-xs">配送完了日時</dt>
                      <dd>{formatOptionalDateTime(review.order.deliveredAt)}</dd>
                    </div>
                  </dl>
                ) : (
                  <p className="text-muted-foreground mt-3 text-sm">注文情報なし</p>
                )}
              </div>
            </div>
            <p className="text-muted-foreground mt-4 text-xs break-all">
              注文明細ID: {review.orderItemId}
            </p>
          </section>

          <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-serif text-2xl font-semibold">審査・更新日時</h2>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground text-xs">承認日時</dt>
                <dd className="mt-1">{formatOptionalDateTime(review.approvedAt)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">非承認日時</dt>
                <dd className="mt-1">{formatOptionalDateTime(review.rejectedAt)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">作成日時</dt>
                <dd className="mt-1">{formatDateTime(review.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">更新日時</dt>
                <dd className="mt-1">{formatDateTime(review.updatedAt)}</dd>
              </div>
            </dl>
          </section>
        </div>

        <aside className="grid content-start gap-6">
          <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-serif text-xl font-semibold">公開審査</h2>
            <p className="text-muted-foreground mt-2 text-xs leading-5">
              承認後は公開商品レビューに表示され、顧客へ通知が作成されます。
            </p>
            <div className="mt-4">
              <ApproveReviewDialog review={review} />
            </div>
          </section>

          <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-serif text-xl font-semibold">非承認審査</h2>
            <p className="text-muted-foreground mt-2 text-xs leading-5">
              非承認の理由を500文字以内で入力してください。
            </p>
            <div className="mt-4">
              <RejectReviewDialog review={review} />
            </div>
          </section>

          <section className="rounded-2xl border border-red-200 bg-white p-5">
            <h2 className="font-semibold text-red-800">レビュー削除</h2>
            <p className="text-muted-foreground mt-2 text-xs leading-5">
              削除すると、このレビューはサイト上に表示されなくなります。
            </p>
            <div className="mt-4">
              <DeleteReviewDialog reviewId={review.id} />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
