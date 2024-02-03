import { PAYMENT_CAP } from "../constants";
import { Payment } from "./getPaymentHistory";

export const deriveMetrics = (payments: Payment[]) => {
  const totalPaid = payments.reduce((total, payment) => {
    if (!payment.amount) return total;
    const num = parseFloat(payment.amount.replace("$", "").replace(",", ""));
    total += num;
    return total;
  }, 0);

  const remaining = parseFloat((PAYMENT_CAP - totalPaid).toFixed(2));
  return { totalPaid, remaining };
};
