"use client";

import { DeliveryAreaSection } from "./delivery-area-section";
import { DeliveryBlackoutSection } from "./delivery-blackout-section";
import { DeliveryCapacitySection } from "./delivery-capacity-section";
import { DeliveryTimeSlotSection } from "./delivery-time-slot-section";

export function AdminDeliveryPage() {
  return (
    <div className="mx-auto max-w-375">
      <div>
        <p className="text-accent text-xs font-bold tracking-[.18em] uppercase">
          Delivery management
        </p>
        <h1 className="text-brand-dark mt-2 font-serif text-3xl font-semibold">
          配送管理
        </h1>
        <p className="text-muted-foreground mt-3 max-w-3xl text-sm leading-7">
          配送エリア、時間帯、配送不可日、1日の配送可能件数を管理します。
        </p>
      </div>
      <div className="mt-8 grid gap-8">
        <DeliveryAreaSection />
        <DeliveryTimeSlotSection />
        <DeliveryBlackoutSection />
        <DeliveryCapacitySection />
      </div>
    </div>
  );
}
