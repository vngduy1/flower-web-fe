"use client";

import { useQuery } from "@tanstack/react-query";

import { wishlistQueryOptions } from "../api/wishlist.queries";

export function useWishlist(enabled = true) {
  return useQuery({ ...wishlistQueryOptions(), enabled });
}
