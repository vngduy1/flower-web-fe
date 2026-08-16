import { ProductCard } from "./product-card";
import type { Product, ProductImage } from "../types/product";

interface ProductGridProps {
  headingLevel?: 2 | 3;
  images?: Record<string, ProductImage | null>;
  products: Product[];
}

export function ProductGrid({
  headingLevel = 3,
  images = {},
  products,
}: ProductGridProps) {
  return (
    <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-7">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          image={images[product.id]}
          headingLevel={headingLevel}
        />
      ))}
    </div>
  );
}