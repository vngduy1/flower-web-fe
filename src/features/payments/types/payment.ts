export type PaymentMethod = "MOCK" | "CREDIT_CARD" | "BANK_TRANSFER" | "COD";

export type PaymentRecordStatus =
  "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";

export interface CreatePaymentRequest {
  orderId: string;
  paymentMethod: PaymentMethod;
}

export interface Payment {
  id: string;
  paymentNumber: string;
  orderId: string;
  paymentMethod: PaymentMethod;
  status: PaymentRecordStatus;
  amount: number;
  currency: string;
  providerPaymentId: string | null;
  failureReason: string | null;
  paidAt: string | null;
  failedAt: string | null;
  refundedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
