import { AUTH_SESSION_CHANGED_EVENT } from "./events";

const ACCESS_TOKEN_KEY = "flower-web.access-token";
const REFRESH_TOKEN_KEY = "flower-web.refresh-token";
const AUTH_STATE_KEY = "flower-web.auth-state";

let authRequestController: AbortController | null = null;

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function notifySessionChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));
  }
}

export function getAccessToken(): string | null {
  if (!canUseStorage()) {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getAuthRequestSignal(): AbortSignal | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  authRequestController ??= new AbortController();

  return authRequestController.signal;
}

export function subscribeAuthSession(listener: () => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleSessionChange = () => listener();
  const handleStorageChange = (event: StorageEvent) => {
    if (
      event.storageArea === window.localStorage &&
      (event.key === null ||
        [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, AUTH_STATE_KEY].includes(event.key))
    ) {
      listener();
    }
  };

  window.addEventListener(AUTH_SESSION_CHANGED_EVENT, handleSessionChange);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, handleSessionChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}

export function setAccessToken(token: string): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  notifySessionChanged();
}

export function clearAuthSession(): void {
  authRequestController?.abort();
  authRequestController = null;

  if (!canUseStorage()) {
    return;
  }

  const hadStoredSession = [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, AUTH_STATE_KEY].some(
    (key) => window.localStorage.getItem(key) !== null,
  );

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_STATE_KEY);

  if (hadStoredSession) {
    notifySessionChanged();
  }
}
