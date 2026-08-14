import Link from "next/link";
import { ProductForm } from "./product-form";

export function NewProductPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/admin/products" className="text-brand text-sm font-semibold">
        ← 商品一覧
      </Link>
      <h1 className="text-brand-dark mt-4 font-serif text-3xl font-semibold">
        商品を登録
      </h1>
      <p className="text-muted-foreground mt-3 text-sm">
        商品情報を入力して、新しい商品を登録します。
      </p>
      <div className="mt-7">
        <ProductForm />
      </div>
    </div>
  );
}
