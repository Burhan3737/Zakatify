import { formatMoney } from "../utils/currency";

export function PaymentEntry({ payment, currency, onDelete, formatDate }) {
  return (
    <div className="payment-entry">
      <div className="payment-icon">{payment.categoryIcon}</div>
      <div className="payment-details">
        <div className="payment-header">
          <span className="payment-category">{payment.categoryLabel}</span>
          <span className="payment-date">{formatDate(payment.date)}</span>
        </div>
        <div className="payment-description">{payment.description}</div>
      </div>
      <div className="payment-amount">
        {formatMoney(payment.amount, currency)}
      </div>
      <button
        className="payment-delete-btn"
        onClick={onDelete}
        aria-label={`Delete payment ${payment.description}`}
        title="Delete payment"
      >
        🗑️
      </button>
    </div>
  );
}

export default PaymentEntry;
