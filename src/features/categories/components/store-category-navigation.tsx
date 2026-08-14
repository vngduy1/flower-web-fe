import { connection } from "next/server";

import { getActiveCategoriesCached } from "../api/categories.server";
import { CategoryNavigation } from "./category-navigation";
import type { Category } from "../types/category";

export async function StoreCategoryNavigation() {
  await connection();
  let categories: Category[] = [];

  try {
    categories = await getActiveCategoriesCached();
  } catch {
    categories = [];
  }

  return <CategoryNavigation categories={categories} />;
}
