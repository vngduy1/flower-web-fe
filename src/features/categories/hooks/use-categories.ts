"use client";

import { useQuery } from "@tanstack/react-query";

import { categoriesQueryOptions } from "../api/categories.queries";

export function useCategories() {
  return useQuery(categoriesQueryOptions());
}
