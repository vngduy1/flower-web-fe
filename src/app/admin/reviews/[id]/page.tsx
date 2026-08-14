import type { Metadata } from "next";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui";
import { AdminReviewDetail } from "@/features/admin-reviews/components/admin-review-detail";

export const metadata: Metadata = {
  title: "レビュー詳細",
  description: "商品レビューの詳細と審査状態を確認します。",
};

export default async function AdminReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div role="status" aria-label="レビュー詳細を読み込んでいます">
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      }
    >
      <AdminReviewDetail id={id} />
    </Suspense>
  );
}
