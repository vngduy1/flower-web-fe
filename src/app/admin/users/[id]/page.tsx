import type { Metadata } from "next";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui";
import { AdminUserDetail } from "@/features/admin-users/components/admin-user-detail";

export const metadata: Metadata = {
  title: "ユーザー詳細",
};

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div role="status" aria-label="ユーザー詳細を読み込んでいます">
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      }
    >
      <AdminUserDetail id={id} />
    </Suspense>
  );
}
