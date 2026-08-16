import Link from "next/link";

import { RatingStars } from "@/features/reviews/components/rating-stars";
import { ReviewStatusBadge } from "@/features/reviews/components/review-status-badge";
import { formatDateTime } from "@/lib/format/date";

import type { AdminReview } from "../types/admin-review";

function ReviewProduct({ review }: { review: AdminReview }) {
  if (!review.product) {
    return <span className="text-muted-foreground">商品情報なし</span>;
  }

  return (
    <div>
      <Link
        href={`/admin/products/${encodeURIComponent(review.product.id)}`}
        className="text-brand font-semibold hover:underline"
      >
        {review.product.name}
      </Link>
      <p className="text-muted-foreground mt-1 text-xs">{review.product.productCode}</p>
    </div>
  );
}

function ReviewCustomer({ review }: { review: AdminReview }) {
  if (!review.user) {
    return <span className="text-muted-foreground">顧客情報なし</span>;
  }

  return (
    <div>
      <Link
        href={`/admin/users/${encodeURIComponent(review.user.id)}`}
        className="text-brand font-semibold hover:underline"
      >
        {review.user.fullName}
      </Link>
      <p className="text-muted-foreground mt-1 text-xs">{review.user.email}</p>
    </div>
  );
}

export function AdminReviewTable({ reviews }: { reviews: AdminReview[] }) {
  return (
    <>
      <div className="mt-6 grid gap-3 lg:hidden">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-muted-foreground text-xs">Review ID {review.id}</p>
                <Link
                  href={`/admin/reviews/${encodeURIComponent(review.id)}`}
                  className="text-brand mt-1 block font-semibold hover:underline"
                >
                  {review.title ?? "タイトルなし"}
                </Link>
              </div>
              <ReviewStatusBadge status={review.status} />
            </div>
            <RatingStars className="mt-3" rating={review.rating} showValue />
            <p className="text-muted-foreground mt-3 line-clamp-3 text-sm whitespace-pre-wrap">
              {review.comment}
            </p>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground text-xs">商品</dt>
                <dd className="mt-1">
                  <ReviewProduct review={review} />
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">顧客</dt>
                <dd className="mt-1">
                  <ReviewCustomer review={review} />
                </dd>
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
            <Link
              href={`/admin/reviews/${encodeURIComponent(review.id)}`}
              className="text-brand mt-5 inline-flex text-sm font-semibold"
            >
              詳細と審査 →
            </Link>
          </article>
        ))}
      </div>

      <div className="border-brand/10 mt-6 hidden overflow-x-auto rounded-2xl border bg-white shadow-sm lg:block">
        <table className="w-full min-w-325 text-left text-sm">
          <thead className="bg-brand-soft/35 text-muted-foreground text-xs">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                レビュー
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                評価・状態
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                商品
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                顧客
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                注文
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                作成・更新日時
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                <span className="sr-only">操作</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-brand/10 divide-y">
            {reviews.map((review) => (
              <tr key={review.id} className="align-top">
                <td className="max-w-sm px-4 py-4">
                  <p className="text-muted-foreground text-xs">ID {review.id}</p>
                  <p className="mt-1 font-semibold">{review.title ?? "タイトルなし"}</p>
                  <p className="text-muted-foreground mt-2 line-clamp-2 text-xs whitespace-pre-wrap">
                    {review.comment}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <RatingStars rating={review.rating} showValue />
                  <div className="mt-2">
                    <ReviewStatusBadge status={review.status} />
                  </div>
                </td>
                <td className="px-4 py-4">
                  <ReviewProduct review={review} />
                </td>
                <td className="px-4 py-4">
                  <ReviewCustomer review={review} />
                </td>
                <td className="px-4 py-4">
                  {review.order ? (
                    <Link
                      href={`/admin/orders/${encodeURIComponent(review.order.id)}`}
                      className="text-brand font-semibold hover:underline"
                    >
                      {review.order.orderNumber}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">注文情報なし</span>
                  )}
                </td>
                <td className="px-4 py-4 text-xs">
                  <p>作成 {formatDateTime(review.createdAt)}</p>
                  <p className="text-muted-foreground mt-1">
                    更新 {formatDateTime(review.updatedAt)}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/admin/reviews/${encodeURIComponent(review.id)}`}
                    className="text-brand font-semibold hover:underline"
                  >
                    詳細
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
