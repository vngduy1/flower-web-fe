import { apiClient } from "@/lib/api";

import type {
  AuthenticatedUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResendVerificationRequest,
  ResendVerificationResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "../types/auth.types";

export async function register(request: RegisterRequest): Promise<RegisterResponse> {
  const response = await apiClient.post<RegisterResponse>("/auth/register", request, {
    skipAuthRedirect: true,
  });

  return response.data;
}

export async function verifyEmail(
  request: VerifyEmailRequest,
): Promise<VerifyEmailResponse> {
  const response = await apiClient.post<VerifyEmailResponse>(
    "/auth/verify-email",
    request,
    {
      skipAuthRedirect: true,
    },
  );

  return response.data;
}

export async function resendVerification(
  request: ResendVerificationRequest,
): Promise<ResendVerificationResponse> {
  const response = await apiClient.post<ResendVerificationResponse>(
    "/auth/resend-verification",
    request,
    {
      skipAuthRedirect: true,
    },
  );

  return response.data;
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/auth/login", request, {
    skipAuthRedirect: true,
  });

  return response.data;
}

export async function getAuthProfile(): Promise<AuthenticatedUser> {
  const response = await apiClient.get<AuthenticatedUser>("/auth/profile");

  return response.data;
}
