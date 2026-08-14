import axios, { type AxiosError } from "axios";

import { env } from "@/config/env";
import { AUTH_UNAUTHORIZED_EVENT } from "@/lib/auth/events";
import {
  clearAuthSession,
  getAccessToken,
  getAuthRequestSignal,
} from "@/lib/auth/token-storage";

import { normalizeApiError } from "./errors";

declare module "axios" {
  interface AxiosRequestConfig {
    skipAuthRedirect?: boolean;
  }

  interface InternalAxiosRequestConfig {
    skipAuthRedirect?: boolean;
  }
}

const REQUEST_TIMEOUT_MS = 15_000;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function getApiBaseUrl(): string {
  if (isBrowser()) {
    return env.NEXT_PUBLIC_API_BASE_URL;
  }

  const serverApiBaseUrl = process.env.BACKEND_API_BASE_URL;

  if (!serverApiBaseUrl) {
    throw new Error("BACKEND_API_BASE_URL is required for server-side API requests");
  }

  return serverApiBaseUrl;
}

function shouldRedirectAfterUnauthorized(error: AxiosError): boolean {
  if (!isBrowser() || error.config?.skipAuthRedirect) {
    return false;
  }

  const isAlreadyOnAuthPage = ["/login", "/register"].includes(window.location.pathname);

  return !isAlreadyOnAuthPage;
}

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
      config.signal ??= getAuthRequestSignal();
    }

    return config;
  },
  (error: unknown) => Promise.reject(normalizeApiError(error)),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const hadAccessToken = Boolean(getAccessToken());
      clearAuthSession();

      if (hadAccessToken && shouldRedirectAfterUnauthorized(error)) {
        window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
      }
    }

    return Promise.reject(normalizeApiError(error));
  },
);
