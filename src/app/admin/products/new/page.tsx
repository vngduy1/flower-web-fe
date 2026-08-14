import type { Metadata } from "next";
import { NewProductPage } from "@/features/admin-products/components/new-product-page";

export const metadata: Metadata = { title: "商品登録" };
export default function Page() {
  return <NewProductPage />;
}
