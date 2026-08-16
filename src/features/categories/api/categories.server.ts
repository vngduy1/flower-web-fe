import "server-only";

import { cache } from "react";

import { getCategories, getCategory } from "./categories.api";
import type { Category } from "../types/category";

export const getCategoriesCached = cache(getCategories);

export const getActiveCategoriesCached = cache(async () => {
  const response = await getCategories({
    page: 1,
    limit: 100,
  });

  return response.items.filter((category) => category.isActive);
});

export const getCategoryBySlugCached = cache(
  async (slug: string): Promise<Category | null> => {
    const categories = await getActiveCategoriesCached();
    const matchingCategory = categories.find((category) => category.slug === slug);

    if (!matchingCategory) {
      return null;
    }

    const category = await getCategory(matchingCategory.id);

    return category.isActive ? category : null;
  },
);

export const getStorefrontCategoriesCached = cache(async () => {
  const response = await getCategories({
    page: 1,
    limit: 100,
    hasActiveProducts: true,
  });

  return response.items.filter((category) => category.isActive);
});