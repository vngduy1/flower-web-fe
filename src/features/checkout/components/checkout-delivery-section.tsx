import type {
  AvailableDeliveryDate,
  AvailableDeliveryTimeSlot,
  DeliveryArea,
  DeliveryFeeResponse,
} from "@/features/delivery/types/delivery";
import { formatYen } from "@/lib/format/currency";

interface CheckoutDeliverySectionProps {
  areas: DeliveryArea[];
  dates: AvailableDeliveryDate[];
  datesError?: string;
  fee?: DeliveryFeeResponse;
  feeError?: string;
  isDatesLoading: boolean;
  isFeeLoading: boolean;
  isSlotsLoading: boolean;
  onDateChange: (date: string) => void;
  onTimeSlotChange: (timeSlotId: string) => void;
  selectedDate: string;
  selectedTimeSlotId: string;
  slots: AvailableDeliveryTimeSlot[];
  slotsError?: string;
  validationErrors: {
    deliveryDate?: string;
    timeSlotId?: string;
  };
}

export function CheckoutDeliverySection({
  areas,
  dates,
  datesError,
  fee,
  feeError,
  isDatesLoading,
  isFeeLoading,
  isSlotsLoading,
  onDateChange,
  onTimeSlotChange,
  selectedDate,
  selectedTimeSlotId,
  slots,
  slotsError,
  validationErrors,
}: CheckoutDeliverySectionProps) {
  return (
    <section className="border-brand/15 border-t pt-8">
      <p className="home-eyebrow">Step 02</p>

      <h2 className="text-brand-dark mt-4 font-serif text-2xl font-medium">お届け日時</h2>

      {/* 配送日・配送時間帯 */}
      <div className="mt-7 grid gap-6 sm:grid-cols-2">
        {/* 配送日 */}
        <div className="grid gap-2">
          <label
            htmlFor="checkout-delivery-date"
            className="text-brand-dark text-sm font-semibold"
          >
            配送日
            <span className="text-accent ml-1" aria-hidden="true">
              *
            </span>
          </label>

          <select
            id="checkout-delivery-date"
            value={selectedDate}
            disabled={isDatesLoading || dates.length === 0}
            onChange={(event) => onDateChange(event.target.value)}
            className="border-brand/20 focus:border-brand min-h-11 w-full border-b bg-transparent px-1 text-sm transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-55"
            aria-invalid={Boolean(validationErrors.deliveryDate)}
          >
            <option value="">{isDatesLoading ? "読み込み中…" : "配送日を選択"}</option>

            {dates.map((date) => (
              <option key={date.date} value={date.date} disabled={!date.available}>
                {new Intl.DateTimeFormat("ja-JP", {
                  dateStyle: "long",
                  timeZone: "Asia/Tokyo",
                }).format(new Date(`${date.date}T00:00:00+09:00`))}
              </option>
            ))}
          </select>

          {validationErrors.deliveryDate ? (
            <p className="text-sm text-red-700" role="alert">
              {validationErrors.deliveryDate}
            </p>
          ) : null}

          {datesError ? (
            <p className="text-sm text-red-700" role="alert">
              {datesError}
            </p>
          ) : null}
        </div>

        {/* 配送時間帯 */}
        <div className="grid gap-2">
          <label
            htmlFor="checkout-time-slot"
            className="text-brand-dark text-sm font-semibold"
          >
            配送時間帯
            <span className="text-accent ml-1" aria-hidden="true">
              *
            </span>
          </label>

          <select
            id="checkout-time-slot"
            value={selectedTimeSlotId}
            disabled={!selectedDate || isSlotsLoading || slots.length === 0}
            onChange={(event) => onTimeSlotChange(event.target.value)}
            className="border-brand/20 focus:border-brand min-h-11 w-full border-b bg-transparent px-1 text-sm transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-55"
            aria-invalid={Boolean(validationErrors.timeSlotId)}
          >
            <option value="">{isSlotsLoading ? "読み込み中…" : "時間帯を選択"}</option>

            {slots.map((slot) => (
              <option
                key={slot.timeSlot.id}
                value={slot.timeSlot.id}
                disabled={!slot.isAvailable}
              >
                {slot.timeSlot.displayName}
                {slot.isAvailable ? `（残り${slot.remainingOrders}件）` : "（受付終了）"}
              </option>
            ))}
          </select>

          {validationErrors.timeSlotId ? (
            <p className="text-sm text-red-700" role="alert">
              {validationErrors.timeSlotId}
            </p>
          ) : null}

          {slotsError ? (
            <p className="text-sm text-red-700" role="alert">
              {slotsError}
            </p>
          ) : null}

          {selectedDate && !isSlotsLoading && !slotsError && slots.length === 0 ? (
            <p className="text-sm text-amber-700">
              この日に利用できる時間帯はありません。
            </p>
          ) : null}
        </div>
      </div>

      {/* 配送エリア・料金 */}
      <div className="border-brand/10 mt-8 border-y py-5 text-sm">
        <p className="text-brand-dark font-semibold">配送エリアと料金</p>

        {isFeeLoading ? (
          <p className="text-muted-foreground mt-2">配送先の対応状況を確認しています…</p>
        ) : fee ? (
          <p className="mt-2">
            {fee.areaName}
            <span className="text-brand-dark/20 mx-2" aria-hidden="true">
              /
            </span>
            配送料 {formatYen(fee.deliveryFee)}
          </p>
        ) : feeError ? (
          <p className="mt-2 text-red-700" role="alert">
            {feeError}
          </p>
        ) : (
          <p className="text-muted-foreground mt-2">
            配送先を選択すると料金を確認します。
          </p>
        )}

        <details className="mt-4">
          <summary className="text-brand-dark cursor-pointer text-xs font-semibold">
            登録済み配送エリア（{areas.length}件）
          </summary>

          <ul className="text-muted-foreground mt-3 grid gap-1 pl-5 text-xs">
            {areas.map((area) => (
              <li key={area.id}>
                {area.prefecture} {area.city} — {area.areaName}
              </li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}
