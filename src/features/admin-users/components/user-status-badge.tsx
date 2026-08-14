import type { UserStatus } from "../types/admin-user";
import { USER_STATUS_LABELS } from "../utils/admin-user";

const statusClasses: Record<UserStatus, string> = {
  ACTIVE: "border-emerald-200 bg-emerald-50 text-emerald-800",
  INACTIVE: "border-slate-200 bg-slate-100 text-slate-700",
  SUSPENDED: "border-amber-200 bg-amber-50 text-amber-800",
};

export function UserStatusBadge({ status }: { status: UserStatus }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses[status]}`}
    >
      {USER_STATUS_LABELS[status]}
    </span>
  );
}
