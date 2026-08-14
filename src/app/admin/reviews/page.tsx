import type { Metadata } from "next";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui";
import { AdminReviewList } from "@/features/admin-reviews/components/admin-review-list";

export const metadata: Metadata = {
  title: "レビュー管理",
  description: "商品レビューの審査と管理を行います。",
};

export default function AdminReviewsPage() {
  return (
    <Suspense
      fallback={
        <div role="status" aria-label="レビュー一覧を読み込んでいます">
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      }
    >
      <AdminReviewList />
    </Suspense>
  );
}
