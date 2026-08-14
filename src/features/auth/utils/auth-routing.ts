import type { RoleCode } from "../types/auth.types";

export const ADMIN_ROLES: readonly RoleCode[] = ["ADMIN", "STAFF"];

export function isAdminRole(roleCode: RoleCode): boolean {
  return ADMIN_ROLES.includes(roleCode);
}

export function getDefaultAuthenticatedRoute(roleCode: RoleCode): string {
  return isAdminRole(roleCode) ? "/admin" : "/account";
}

export function getLoginRoute(returnTo: string, reason?: "session-expired"): string {
  const query = new URLSearchParams();

  if (reason) {
    query.set("reason", reason);
  }

  query.set("returnTo", returnTo);

  return `/login?${query.toString()}`;
}

export function getSafeReturnTo(value: string | null, roleCode: RoleCode): string {
  if (!value || !value.startsWith("/")) {
    return getDefaultAuthenticatedRoute(roleCode);
  }

  const safeOrigin = "https://return-to.invalid";

  let returnTo: URL;

  try {
    returnTo = new URL(value, safeOrigin);
  } catch {
    return getDefaultAuthenticatedRoute(roleCode);
  }

  if (returnTo.origin !== safeOrigin) {
    return getDefaultAuthenticatedRoute(roleCode);
  }

  const safePath = `${returnTo.pathname}${returnTo.search}${returnTo.hash}`;
  const isAdminPath =
    returnTo.pathname === "/admin" || returnTo.pathname.startsWith("/admin/");

  if (isAdminPath && !isAdminRole(roleCode)) {
    return "/account";
  }

  return safePath;
}
