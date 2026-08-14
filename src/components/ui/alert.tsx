import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: ReactNode;
  variant?: AlertVariant;
}

const variantClasses: Record<AlertVariant, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-950",
  success: "border-emerald-200 bg-emerald-50 text-emerald-950",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
  error: "border-red-200 bg-red-50 text-red-950",
};

export function Alert({
  children,
  className,
  title,
  variant = "info",
  ...props
}: AlertProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3.5 text-sm",
        variantClasses[variant],
        className,
      )}
      role={variant === "error" ? "alert" : "status"}
      {...props}
    >
      {title ? <p className="mb-1 font-semibold">{title}</p> : null}
      <div className="leading-6">{children}</div>
    </div>
  );
}
