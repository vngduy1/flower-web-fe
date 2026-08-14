"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";

import { adminDashboardKeys } from "@/features/admin-dashboard/api/admin-dashboard.queries";

import {
  createAdminUser,
  deleteAdminUser,
  restoreAdminUser,
  updateAdminUserRole,
  updateAdminUserStatus,
} from "../api/admin-users.api";
import {
  adminUserKeys,
  adminUserQueryOptions,
  adminUsersQueryOptions,
} from "../api/admin-users.queries";
import type {
  AdminUserDetail,
  AdminUserQuery,
  CreateAdminUserRequest,
  UpdateAdminUserRoleRequest,
  UpdateAdminUserStatusRequest,
} from "../types/admin-user";

export const useAdminUsers = (query: AdminUserQuery) =>
  useQuery(adminUsersQueryOptions(query));

export const useAdminUser = (id: string) => useQuery(adminUserQueryOptions(id));

async function invalidateUserLists(queryClient: QueryClient) {
  await queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
}

async function invalidateDashboardUsers(queryClient: QueryClient) {
  await queryClient.invalidateQueries({
    queryKey: adminDashboardKeys.summary(),
  });
}

function mergeAdminUserDetail(
  queryClient: QueryClient,
  id: string,
  user: Awaited<ReturnType<typeof updateAdminUserRole>>,
) {
  queryClient.setQueryData<AdminUserDetail>(adminUserKeys.detail(id), (current) =>
    current ? { ...current, ...user } : current,
  );
}

export function useCreateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateAdminUserRequest) => createAdminUser(request),
    onSuccess: async () => {
      await Promise.all([
        invalidateUserLists(queryClient),
        invalidateDashboardUsers(queryClient),
      ]);
    },
  });
}

export function useUpdateAdminUserRole(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateAdminUserRoleRequest) => updateAdminUserRole(id, request),
    onSuccess: async (user) => {
      mergeAdminUserDetail(queryClient, id, user);
      await Promise.all([
        invalidateUserLists(queryClient),
        queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(id) }),
      ]);
    },
  });
}

export function useUpdateAdminUserStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateAdminUserStatusRequest) =>
      updateAdminUserStatus(id, request),
    onSuccess: async (user) => {
      mergeAdminUserDetail(queryClient, id, user);
      await Promise.all([
        invalidateUserLists(queryClient),
        queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(id) }),
      ]);
    },
  });
}

export function useDeleteAdminUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteAdminUser(id),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: adminUserKeys.detail(id) });
      await Promise.all([
        invalidateUserLists(queryClient),
        invalidateDashboardUsers(queryClient),
      ]);
    },
  });
}

export function useRestoreAdminUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => restoreAdminUser(id),
    onSuccess: async () => {
      await Promise.all([
        invalidateUserLists(queryClient),
        queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(id) }),
        invalidateDashboardUsers(queryClient),
      ]);
    },
  });
}
