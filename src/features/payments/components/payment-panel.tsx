"use client";

import { Alert, Button, Skeleton } from "@/components/ui";
import type { Order } from "@/features/orders/types/order";
import { normalizeApiError } from "@/lib/api/errors";
import { formatYen } from "@/lib/format/currency";

import { useConfirmPayment } from "../hooks/use-confirm-payment";
import { useCreatePayment } from "../hooks/use-create-payment";
import { useFailPayment } from "../hooks/use-fail-payment";
import { usePayment } from "../hooks/use-payment";
import type { Payment } from "../types/payment";

interface PaymentPanelProps {
  onPaymentIdChange: (paymentId: string | null) => void;
  order: Order;
  paymentId: string | null;
}

interface ExistingPaymentProps {
  onReset: () => void;
  order: Order;
  paymentId: string;
}

function PaymentDetails({ payment }: { payment: Payment }) {
  return (
    <dl className="mt-5 grid gap-3 rounded-2xl bg-white/70 p-4 text-sm">
      <div className="flex justify-between gap-4">
        <dt className="text-muted-foreground">支払い番号</dt>
        <dd className="font-semibold">{payment.paymentNumber}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-muted-foreground">ステータス</dt>
        <dd className="font-semibold">{payment.status}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-muted-foreground">金額</dt>
        <dd className="font-semibold">{formatYen(payment.amount)}</dd>
      </div>
    </dl>
  );
}

function ExistingPayment({ onReset, order, paymentId }: ExistingPaymentProps) {
  const paymentQuery = usePayment(paymentId);
  const confirmMutation = useConfirmPayment();
  const failMutation = useFailPayment();
  const mutationError = confirmMutation.error ?? failMutation.error;
  const error = mutationError ? normalizeApiError(mutationError) : null;

  if (paymentQuery.isPending) {
    return <Skeleton className="mt-5 h-40 rounded-2xl" />;
  }

  if (paymentQuery.error) {
    return (
      <div className="mt-5">
        <Alert variant="error" title="支払い情報を読み込めませんでした">
          {normalizeApiError(paymentQuery.error).message}
        </Alert>
        <Button className="mt-4" onClick={() => void paymentQuery.refetch()}>
          再試行
        </Button>
      </div>
    );
  }

  const payment = paymentQuery.data;
  const isPending = confirmMutation.isPending || failMutation.isPending;

  return (
    <div>
      <PaymentDetails payment={payment} />
      {error ? (
        <Alert className="mt-4" variant="error" title="支払い操作に失敗しました">
          {error.message}
        </Alert>
      ) : null}

      {payment.status === "PENDING" ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Button
            isLoading={confirmMutation.isPending}
            disabled={failMutation.isPending}
            onClick={() => confirmMutation.mutate(payment.id)}
          >
            モック支払いを成功にする
          </Button>
          <Button
            variant="danger"
            isLoading={failMutation.isPending}
            disabled={confirmMutation.isPending}
            onClick={() => failMutation.mutate(payment.id)}
          >
            モック支払いを失敗にする
          </Button>
        </div>
      ) : payment.status === "PAID" ? (
        <Alert className="mt-5" variant="success">
          開発用モック支払いが確認され、注文は支払い済みになりました。
        </Alert>
      ) : payment.status === "FAILED" ? (
        <div className="mt-5">
          <Alert variant="error">
            {payment.failureReason ?? "モック支払いに失敗しました。"}
          </Alert>
          {order.status !== "CANCELLED" && order.paymentStatus !== "PAID" ? (
            <Button
              className="mt-4"
              variant="secondary"
              onClick={onReset}
              disabled={isPending}
            >
              新しいモック支払いを作成
            </Button>
          ) : null}
        </div>
      ) : (
        <Alert className="mt-5">支払いステータス: {payment.status}</Alert>
      )}
    </div>
  );
}

export function PaymentPanel({ onPaymentIdChange, order, paymentId }: PaymentPanelProps) {
  const createMutation = useCreatePayment();
  const createError = createMutation.error
    ? normalizeApiError(createMutation.error)
    : null;

  return (
    <section className="rounded-3xl border border-amber-200 bg-amber-50/70 p-5 shadow-sm sm:p-7">
      <p className="text-xs font-bold tracking-[0.15em] text-amber-800 uppercase">
        Development / test only
      </p>
      <h2 className="text-brand-dark mt-2 font-serif text-2xl font-semibold">
        モック支払い
      </h2>
      <p className="mt-3 text-sm leading-7 text-amber-950/75">
        これはバックエンドの開発用支払いフローです。実際のカード決済や送金は行われません。
      </p>

      {order.paymentStatus === "PAID" && !paymentId ? (
        <Alert className="mt-5" variant="success">
          この注文は支払い済みです。
        </Alert>
      ) : order.status === "CANCELLED" ? (
        <Alert className="mt-5" variant="warning">
          キャンセル済み注文には支払いを作成できません。
        </Alert>
      ) : paymentId ? (
        <ExistingPayment
          order={order}
          paymentId={paymentId}
          onReset={() => onPaymentIdChange(null)}
        />
      ) : (
        <div className="mt-5">
          {createError ? (
            <Alert variant="error" title="支払いを作成できませんでした">
              {createError.message}
              {createError.statusCode === 409 ? (
                <span className="mt-2 block text-xs">
                  バックエンドには注文から保留中支払いを検索するAPIがないため、別画面で作成済みの支払いIDはここから復元できません。
                </span>
              ) : null}
            </Alert>
          ) : null}
          <Button
            className="mt-4"
            isLoading={createMutation.isPending}
            onClick={() => {
              createMutation.mutate(
                { orderId: order.id, paymentMethod: "MOCK" },
                {
                  onSuccess: (payment) => onPaymentIdChange(payment.id),
                },
              );
            }}
          >
            モック支払いを作成
          </Button>
        </div>
      )}
    </section>
  );
}
