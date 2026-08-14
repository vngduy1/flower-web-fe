import type { AdminUserFormValues } from "../schemas/admin-user.schema";
import type {
  AdminUserQuery,
  CreateAdminUserRequest,
  RoleCode,
  UserStatus,
} from "../types/admin-user";

export const ROLE_CODES: RoleCode[] = ["ADMIN", "STAFF", "CUSTOMER"];
export const USER_STATUSES: UserStatus[] = ["ACTIVE", "INACTIVE", "SUSPENDED"];

export const ROLE_LABELS: Record<RoleCode, string> = {
  ADMIN: "管理者",
  STAFF: "スタッフ",
  CUSTOMER: "顧客",
};

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: "有効",
  INACTIVE: "無効",
  SUSPENDED: "停止中",
};

export function parseAdminUserId(value: string | null): string | null {
  return value && /^\d+$/.test(value) ? value : null;
}

export function parseAdminUserQuery(params: URLSearchParams): AdminUserQuery {
  const page = Number(params.get("page"));
  const roleCode = params.get("roleCode");
  const status = params.get("status");

  return {
    keyword: params.get("keyword")?.trim() || undefined,
    roleCode: ROLE_CODES.find((value) => value === roleCode),
    status: USER_STATUSES.find((value) => value === status),
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
    limit: 20,
  };
}

export function toCreateAdminUserRequest(
  values: AdminUserFormValues,
): CreateAdminUserRequest {
  const phone = values.phone.trim();

  return {
    roleCode: values.roleCode,
    email: values.email.trim().toLowerCase(),
    password: values.password,
    fullName: values.fullName.trim(),
    ...(phone ? { phone } : {}),
    status: values.status,
  };
}
