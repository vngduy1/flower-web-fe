import axios from "axios";

import type { ApiError } from "@/types/api";

interface NestErrorPayload {
  error?: unknown;
  message?: unknown;
  statusCode?: unknown;
}

const STATUS_MESSAGES: Readonly<Record<number, string>> = {
  400: "入力内容をご確認ください。",
  401: "ログインが必要です。",
  403: "この操作を行う権限がありません。",
  404: "お探しの情報が見つかりませんでした。",
  409: "現在の状態では処理を完了できませんでした。",
  422: "入力内容を処理できませんでした。",
  500: "サーバーで問題が発生しました。時間をおいて再度お試しください。",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNestErrorPayload(value: unknown): value is NestErrorPayload {
  return isRecord(value);
}

function extractMessages(message: unknown): string[] {
  if (typeof message === "string" && message.trim()) {
    return [message.trim()];
  }

  if (Array.isArray(message)) {
    return message.filter(
      (item): item is string => typeof item === "string" && item.trim().length > 0,
    );
  }

  return [];
}

export function isApiError(error: unknown): error is ApiError {
  return (
    isRecord(error) && error.name === "ApiError" && typeof error.message === "string"
  );
}

export function normalizeApiError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }

  if (!axios.isAxiosError(error)) {
    const message =
      error instanceof Error ? error.message : "予期しない問題が発生しました。";

    return {
      name: "ApiError",
      message,
      messages: [message],
      statusCode: null,
      code: null,
      isNetworkError: false,
      isTimeout: false,
    };
  }

  const isTimeout = error.code === "ECONNABORTED" || error.code === "ETIMEDOUT";
  const isNetworkError = !error.response && !isTimeout;
  const payload = isNestErrorPayload(error.response?.data) ? error.response.data : null;
  const responseStatus = error.response?.status;
  const payloadStatus =
    typeof payload?.statusCode === "number" ? payload.statusCode : null;
  const statusCode = responseStatus ?? payloadStatus;
  const backendMessages = extractMessages(payload?.message);

  let fallbackMessage = "リクエストを完了できませんでした。";

  if (isTimeout) {
    fallbackMessage = "通信がタイムアウトしました。もう一度お試しください。";
  } else if (isNetworkError) {
    fallbackMessage = "サーバーに接続できません。通信環境をご確認ください。";
  } else if (statusCode) {
    fallbackMessage = STATUS_MESSAGES[statusCode] ?? fallbackMessage;
  }

  const messages = backendMessages.length > 0 ? backendMessages : [fallbackMessage];

  return {
    name: "ApiError",
    message: messages.join(" "),
    messages,
    statusCode: statusCode ?? null,
    code: typeof payload?.error === "string" ? payload.error : (error.code ?? null),
    isNetworkError,
    isTimeout,
  };
}
