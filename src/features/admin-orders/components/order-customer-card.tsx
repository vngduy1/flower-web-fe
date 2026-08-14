import type { AdminOrderCustomer } from "../types/admin-order";

export function OrderCustomerCard({ customer }: { customer: AdminOrderCustomer }) {
  return (
    <section className="border-brand/10 rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="font-serif text-xl font-semibold">顧客情報</h2>
      <dl className="mt-4 grid gap-3 text-sm">
        <div>
          <dt className="text-muted-foreground">氏名</dt>
          <dd className="font-semibold">{customer.fullName}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">メール</dt>
          <dd className="break-all">{customer.email}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">電話番号</dt>
          <dd>{customer.phone ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">ユーザーID</dt>
          <dd className="break-all">{customer.id}</dd>
        </div>
      </dl>
    </section>
  );
}
