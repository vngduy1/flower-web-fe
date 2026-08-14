import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { getAdminUser, getAdminUsers } from "./admin-users.api";
import type { AdminUserQuery } from "../types/admin-user";

export const adminUserKeys = {
  all: ["admin-users"] as const,
  lists: () => [...adminUserKeys.all, "list"] as const,
  list: (query: AdminUserQuery) => [...adminUserKeys.lists(), query] as const,
  details: () => [...adminUserKeys.all, "detail"] as const,
  detail: (id: string) => [...adminUserKeys.details(), id] as const,
};

export const adminUsersQueryOptions = (query: AdminUserQuery) =>
  queryOptions({
    queryKey: adminUserKeys.list(query),
    queryFn: () => getAdminUsers(query),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

export const adminUserQueryOptions = (id: string) =>
  queryOptions({
    queryKey: adminUserKeys.detail(id),
    queryFn: () => getAdminUser(id),
    staleTime: 30_000,
  });
