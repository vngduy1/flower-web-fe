import Link from "next/link";

import { formatDateTime } from "@/lib/format/date";

import type { AdminUser } from "../types/admin-user";
import { UserRoleBadge } from "./user-role-badge";
import { UserStatusBadge } from "./user-status-badge";

export function AdminUserTable({
  currentUserId,
  users,
}: {
  currentUserId: string;
  users: AdminUser[];
}) {
  return (
    <>
      <div className="mt-6 grid gap-3 lg:hidden">
        {users.map((user) => (
          <article
            key={user.id}
            className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Link
                  href={`/admin/users/${encodeURIComponent(user.id)}`}
                  className="text-brand font-semibold hover:underline"
                >
                  {user.fullName}
                </Link>
                {user.id === currentUserId ? (
                  <span className="text-accent ml-2 text-xs font-semibold">自分</span>
                ) : null}
                <p className="text-muted-foreground mt-1 text-xs">{user.email}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <UserRoleBadge roleCode={user.role?.roleCode ?? null} />
                <UserStatusBadge status={user.status} />
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div className="col-span-2">
                <dt className="text-muted-foreground text-xs">ユーザーID</dt>
                <dd className="break-all">{user.id}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">電話番号</dt>
                <dd>{user.phone ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">登録日時</dt>
                <dd>{formatDateTime(user.createdAt)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted-foreground text-xs">更新日時</dt>
                <dd>{formatDateTime(user.updatedAt)}</dd>
              </div>
            </dl>
            <Link
              href={`/admin/users/${encodeURIComponent(user.id)}`}
              className="text-brand mt-5 inline-flex text-sm font-semibold"
            >
              詳細と権限を確認 →
            </Link>
          </article>
        ))}
      </div>

      <div className="border-brand/10 mt-6 hidden overflow-x-auto rounded-2xl border bg-white shadow-sm lg:block">
        <table className="w-full min-w-[1150px] text-left text-sm">
          <thead className="bg-brand-soft/35 text-muted-foreground text-xs">
            <tr>
              <th className="px-4 py-3 font-semibold">ID</th>
              <th className="px-4 py-3 font-semibold">ユーザー</th>
              <th className="px-4 py-3 font-semibold">電話番号</th>
              <th className="px-4 py-3 font-semibold">ロール</th>
              <th className="px-4 py-3 font-semibold">状態</th>
              <th className="px-4 py-3 font-semibold">登録日時</th>
              <th className="px-4 py-3 font-semibold">更新日時</th>
              <th className="px-4 py-3 font-semibold">
                <span className="sr-only">操作</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-brand/10 divide-y">
            {users.map((user) => (
              <tr key={user.id} className="align-top">
                <td className="max-w-32 px-4 py-4 text-xs break-all">{user.id}</td>
                <td className="px-4 py-4">
                  <p className="font-semibold">
                    {user.fullName}
                    {user.id === currentUserId ? (
                      <span className="text-accent ml-2 text-xs">自分</span>
                    ) : null}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">{user.email}</p>
                </td>
                <td className="px-4 py-4">{user.phone ?? "—"}</td>
                <td className="px-4 py-4">
                  <UserRoleBadge roleCode={user.role?.roleCode ?? null} />
                </td>
                <td className="px-4 py-4">
                  <UserStatusBadge status={user.status} />
                </td>
                <td className="px-4 py-4 text-xs">{formatDateTime(user.createdAt)}</td>
                <td className="px-4 py-4 text-xs">{formatDateTime(user.updatedAt)}</td>
                <td className="px-4 py-4">
                  <Link
                    href={`/admin/users/${encodeURIComponent(user.id)}`}
                    className="text-brand font-semibold hover:underline"
                  >
                    詳細
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
