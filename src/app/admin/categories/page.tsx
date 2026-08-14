import type { Metadata } from "next";

import { AdminCategoryPage } from "@/features/admin-categories/components/admin-category-page";

export const metadata: Metadata = {
  title: "カテゴリ管理",
  description: "商品カテゴリの階層、公開状態、スラッグを管理します。",
};

export default function AdminCategoriesRoute() {
  return <AdminCategoryPage />;
}
