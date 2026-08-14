import type { Metadata } from "next";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui";
import { AdminUserList } from "@/features/admin-users/components/admin-user-list";

export const metadata: Metadata = {
  title: "ユーザー管理",
  description: "ユーザーのロールとアカウント状態を管理します。",
};

export default function AdminUsersPage() {
  return (
    <Suspense
      fallback={
        <div role="status" aria-label="ユーザー一覧を読み込んでいます">
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      }
    >
      <AdminUserList />
    </Suspense>
  );
}
