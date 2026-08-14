import type { RoleCode } from "../types/admin-user";
import { ROLE_LABELS } from "../utils/admin-user";

const roleClasses: Record<RoleCode, string> = {
  ADMIN: "border-purple-200 bg-purple-50 text-purple-800",
  STAFF: "border-blue-200 bg-blue-50 text-blue-800",
  CUSTOMER: "border-slate-200 bg-slate-100 text-slate-700",
};

export function UserRoleBadge({ roleCode }: { roleCode: RoleCode | null }) {
  if (!roleCode) {
    return (
      <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-800">
        ロール情報なし
      </span>
    );
  }

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${roleClasses[roleCode]}`}
    >
      {ROLE_LABELS[roleCode]}
    </span>
  );
}
