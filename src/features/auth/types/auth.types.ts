import type { UserStatus } from "@/features/users/types/user.types";

export type RoleCode = "ADMIN" | "STAFF" | "CUSTOMER";

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface RegisteredUserRole {
  id: string;
  roleCode: RoleCode;
  roleName: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  status: UserStatus;
  role: RegisteredUserRole;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseUser {
  id: string;
  email: string;
  fullName: string;
  roleCode: RoleCode;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: string;
  user: LoginResponseUser;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  status: UserStatus;
  roleCode: RoleCode;
  roleName: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface VerifyEmailResponse {
  message: string;
  email: string;
  emailVerified: boolean;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  message: string;
  email: string;
  verificationEmailSent: boolean;
}
