"use client";

import { useQuery } from "@tanstack/react-query";

import { currentUserQueryOptions } from "../api/users.queries";

export function useCurrentUser() {
  return useQuery(currentUserQueryOptions());
}
