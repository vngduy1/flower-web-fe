import type { RoleCode } from "@/features/auth/types/auth.types";

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface UserRole {
  id: string;
  roleCode: RoleCode;
  roleName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  roleId: string;
  email: string;
  fullName: string;
  phone: string | null;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  role: UserRole;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
}
