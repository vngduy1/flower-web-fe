import { cn } from "@/lib/utils/cn";

import type { InventoryStockStatus } from "../types/inventory";
import { INVENTORY_STATUS_LABELS } from "../utils/inventory";

const classes: Record<InventoryStockStatus, string> = {
  NOT_MANAGED: "bg-slate-100 text-slate-700",
  OUT_OF_STOCK: "bg-red-100 text-red-800",
  LOW_STOCK: "bg-amber-100 text-amber-800",
  IN_STOCK: "bg-emerald-100 text-emerald-800",
};

export function InventoryStatusBadge({ status }: { status: InventoryStockStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        classes[status],
      )}
    >
      {INVENTORY_STATUS_LABELS[status]}
    </span>
  );
}
