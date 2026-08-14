import { apiClient, toApiPathSegment } from "@/lib/api";

import type {
  AdminUser,
  AdminUserDetail,
  AdminUserListResponse,
  AdminUserQuery,
  CreateAdminUserRequest,
  DeleteAdminUserResponse,
  RestoreAdminUserResponse,
  UpdateAdminUserRoleRequest,
  UpdateAdminUserStatusRequest,
} from "../types/admin-user";

function getAdminUserPath(id: string): string {
  return `/admin/users/${toApiPathSegment(id)}`;
}

export async function getAdminUsers(query: AdminUserQuery) {
  const response = await apiClient.get<AdminUserListResponse>("/admin/users", {
    params: query,
  });
  return response.data;
}

export async function getAdminUser(id: string) {
  const response = await apiClient.get<AdminUserDetail>(getAdminUserPath(id));
  return response.data;
}

export async function createAdminUser(request: CreateAdminUserRequest) {
  const response = await apiClient.post<AdminUser>("/admin/users", request);
  return response.data;
}

export async function updateAdminUserRole(
  id: string,
  request: UpdateAdminUserRoleRequest,
) {
  const response = await apiClient.patch<AdminUser>(
    `${getAdminUserPath(id)}/role`,
    request,
  );
  return response.data;
}

export async function updateAdminUserStatus(
  id: string,
  request: UpdateAdminUserStatusRequest,
) {
  const response = await apiClient.patch<AdminUser>(
    `${getAdminUserPath(id)}/status`,
    request,
  );
  return response.data;
}

export async function deleteAdminUser(id: string) {
  const response = await apiClient.delete<DeleteAdminUserResponse>(getAdminUserPath(id));
  return response.data;
}

export async function restoreAdminUser(id: string) {
  const response = await apiClient.patch<RestoreAdminUserResponse>(
    `${getAdminUserPath(id)}/restore`,
  );
  return response.data;
}
