import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { productQueryOptions } from "@/features/products/api/products.queries";
import { getProductBySlugCached } from "@/features/products/api/products.server";
import { ProductDetail } from "@/features/products/components/product-detail";
import { productReviewsQueryOptions } from "@/features/reviews/api/reviews.queries";
import { createQueryClient } from "@/lib/query/query-client";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

function createDescription(description: string | null, productName: string): string {
  const normalized = description?.replace(/\s+/g, " ").trim();

  return normalized
    ? normalized.slice(0, 160)
    : `${productName}の商品情報、価格、在庫、画像をご覧いただけます。`;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const detail = await getProductBySlugCached(slug);

    if (!detail) {
      return { title: "商品が見つかりません" };
    }

    return {
      title: detail.product.name,
      description: createDescription(detail.product.description, detail.product.name),
    };
  } catch {
    return { title: "商品情報" };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const detail = await getProductBySlugCached(slug);

  if (!detail) {
    notFound();
  }

  const queryClient = createQueryClient();

  queryClient.setQueryData(productQueryOptions(slug).queryKey, detail);
  await queryClient.prefetchQuery(productReviewsQueryOptions(detail.product.id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductDetail detail={detail} />
    </HydrationBoundary>
  );
}
