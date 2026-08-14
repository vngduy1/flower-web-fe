import type { ReactNode } from "react";

import { Skeleton } from "@/components/ui";

export function DeliverySection({
  action,
  children,
  description,
  eyebrow,
  id,
  title,
}: {
  action: ReactNode;
  children: ReactNode;
  description: string;
  eyebrow: string;
  id: string;
  title: string;
}) {
  return (
    <section
      className="border-brand/10 rounded-3xl border bg-white p-5 shadow-sm sm:p-7"
      aria-labelledby={id}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-accent text-xs font-bold tracking-[.16em] uppercase">
            {eyebrow}
          </p>
          <h2 id={id} className="text-brand-dark mt-2 font-serif text-2xl font-semibold">
            {title}
          </h2>
          <p className="text-muted-foreground mt-2 max-w-3xl text-sm leading-6">
            {description}
          </p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function DeliveryStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"
      }`}
    >
      {isActive ? "有効" : "無効"}
    </span>
  );
}

export function DeliverySectionSkeleton() {
  return (
    <div className="mt-6 grid gap-3" role="status" aria-label="読み込んでいます">
      {Array.from({ length: 3 }, (_, index) => (
        <Skeleton key={index} className="h-24 rounded-2xl" />
      ))}
    </div>
  );
}

export const selectClassName =
  "focus:border-brand min-h-11 w-full rounded-xl border bg-white px-3.5 text-base shadow-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-55 sm:text-sm";

export const labelClassName = "text-sm font-semibold";
