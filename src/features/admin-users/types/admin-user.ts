import type { RoleCode } from "@/features/auth/types/auth.types";
import type { UserStatus } from "@/features/users/types/user.types";

export interface AdminUserQuery {
  keyword?: string;
  roleCode?: RoleCode;
  status?: UserStatus;
  page?: number;
  limit?: number;
}

export interface AdminUserRole {
  id: string;
  roleCode: RoleCode;
  roleName: string;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  status: UserStatus;
  role: AdminUserRole | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserDetail extends AdminUser {
  orderSummary: {
    totalOrders: number;
    totalSpent: number;
  };
}

export interface AdminUserListResponse {
  items: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateAdminUserRequest {
  roleCode: RoleCode;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  status?: UserStatus;
}

export interface UpdateAdminUserRoleRequest {
  roleCode: RoleCode;
}

export interface UpdateAdminUserStatusRequest {
  status: UserStatus;
}

export interface DeleteAdminUserResponse {
  message: string;
}

export interface RestoreAdminUserResponse {
  message: string;
  user: AdminUser;
}

export type { RoleCode, UserStatus };
