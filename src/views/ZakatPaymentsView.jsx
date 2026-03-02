import { useState } from "react";
import { useZakatPaymentsViewModel } from "../viewmodels/useZakatPaymentsViewModel";
import { PaymentEntry } from "../components/PaymentEntry";
import { formatMoney } from "../utils/currency";
import { formatRelativeDate } from "../models/paymentsModel";

export function ZakatPaymentsView({ zakatDue, currency }) {
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualAmount, setManualAmount] = useState("");
  const [formErrors, setFormErrors] = useState([]);

  const {
    payments,
    effectiveZakatDue,
    totalPaid,
    remainingBalance,
    isComplete,
    isOverpaid,
    isManualMode,
    showConfirmDialog,
    confirmMessage,
    categories,
    addNewPayment,
    confirmDeletePayment,
    confirmClearAll,
    executeConfirm,
    cancelConfirm,
    enableManualMode,
    disableManualMode,
    updateManualAmount,
    resetForNewYear,
  } = useZakatPaymentsViewModel(zakatDue, currency);

  const handleAddPayment = (e) => {
    e.preventDefault();
    setFormErrors([]);

    const result = addNewPayment(newCategory, newDescription, newAmount);

    if (result.success) {
      setNewCategory("");
      setNewDescription("");
      setNewAmount("");
    } else {
      setFormErrors(result.errors);
    }
  };

  const handleEnableManual = () => {
    if (enableManualMode(manualAmount)) {
      setShowManualInput(false);
      setManualAmount("");
    }
  };

  const handleUpdateManual = () => {
    updateManualAmount(manualAmount);
    setShowManualInput(false);
    setManualAmount("");
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <h1>💰 Zakat Payments</h1>
        <p className="panel-subtitle">
          Track your zakat payments and monitor your remaining balance.
        </p>
      </header>

      {/* Balance Summary Card */}
      <div className="balance-summary">
        {/* Zakat Due Section */}
        <div className="balance-row zakat-due-row">
          <span className="balance-label">Zakat Due:</span>
          <div className="balance-value-group">
            <span className="balance-amount">
              {formatMoney(effectiveZakatDue, currency)}
            </span>
            {!isManualMode && zakatDue > 0 && (
              <span className="balance-source">(from calculator)</span>
            )}
            {isManualMode && <span className="balance-source">(manual)</span>}
            {!isManualMode ? (
              <button
                className="btn-link"
                onClick={() => setShowManualInput(true)}
              >
                Enter manually
              </button>
            ) : (
              <>
                <button
                  className="btn-link"
                  onClick={() => {
                    setManualAmount(effectiveZakatDue.toString());
                    setShowManualInput(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn-link btn-link-danger"
                  onClick={disableManualMode}
                >
                  Use calculator value
                </button>
              </>
            )}
          </div>
        </div>

        {/* Manual Input Modal */}
        {showManualInput && (
          <div className="manual-input-overlay">
            <div className="manual-input-modal">
              <h4>Enter Zakat Due Amount</h4>
              <div className="field-input-wrap">
                <span className="field-prefix">{currency}</span>
                <input
                  type="number"
                  className="field-input"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  autoFocus
                />
              </div>
              <div className="manual-input-actions">
                <button
                  className="btn ghost"
                  onClick={() => {
                    setShowManualInput(false);
                    setManualAmount("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn primary"
                  onClick={
                    isManualMode ? handleUpdateManual : handleEnableManual
                  }
                  disabled={!manualAmount || parseFloat(manualAmount) <= 0}
                >
                  {isManualMode ? "Update" : "Set Amount"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Total Paid */}
        <div className="balance-row">
          <span className="balance-label">Total Paid:</span>
          <span className="balance-amount paid">
            {formatMoney(totalPaid, currency)}
          </span>
        </div>

        {/* Remaining Balance - Primary Focus */}
        <div
          className={`balance-row balance-highlight ${isComplete ? "complete" : ""} ${isOverpaid ? "overpaid" : ""}`}
        >
          <span className="balance-label">
            {isComplete ? "✅ Remaining:" : "Remaining:"}
          </span>
          <span className="balance-amount remaining">
            {formatMoney(Math.abs(remainingBalance), currency)}
          </span>
        </div>

        {isComplete && !isOverpaid && (
          <div className="completion-message">
            <span className="completion-icon">🎉</span>
            <span>Zakat Complete! May Allah accept your charity.</span>
          </div>
        )}

        {isOverpaid && (
          <div className="overpaid-message">
            <span className="overpaid-icon">⚠️</span>
            <span>
              You have overpaid by{" "}
              {formatMoney(Math.abs(remainingBalance), currency)}
            </span>
          </div>
        )}
      </div>

      {/* Add Payment Form */}
      {!isComplete && (
        <form className="payment-form" onSubmit={handleAddPayment}>
          <h3>Add New Payment</h3>

          {formErrors.length > 0 && (
            <div className="form-errors">
              {formErrors.map((error, idx) => (
                <span key={idx} className="error-item">
                  {error}
                </span>
              ))}
            </div>
          )}

          <div className="payment-form-grid">
            <div className="field">
              <label className="field-title">Category</label>
              <select
                className="field-input"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
              >
                <option value="">Select category...</option>
                {Object.values(categories).map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="field-title">Description</label>
              <input
                type="text"
                className="field-input"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder={
                  newCategory === "other"
                    ? "Enter description..."
                    : "Optional description..."
                }
              />
            </div>

            <div className="field">
              <label className="field-title">Amount</label>
              <div className="field-input-wrap">
                <span className="field-prefix">{currency}</span>
                <input
                  type="number"
                  className="field-input"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="field field-submit">
              <label className="field-title">&nbsp;</label>
              <button type="submit" className="btn primary payment-add-btn">
                + Add Payment
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Payment History */}
      <div className="payment-history">
        <div className="payment-history-header">
          <h3>📋 Payment History ({payments.length})</h3>
          {payments.length > 0 && (
            <button className="btn-small btn-danger" onClick={confirmClearAll}>
              Clear All
            </button>
          )}
        </div>

        {payments.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p>No payments recorded yet</p>
            <p className="empty-subtitle">
              {effectiveZakatDue > 0
                ? "Start by adding your first zakat payment above!"
                : "Set your zakat due amount to start tracking payments."}
            </p>
          </div>
        ) : (
          <div className="payment-list">
            {payments.map((payment) => (
              <PaymentEntry
                key={payment.id}
                payment={payment}
                currency={currency}
                onDelete={() =>
                  confirmDeletePayment(payment.id, payment.description)
                }
                formatDate={formatRelativeDate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reset for New Year */}
      {isComplete && (
        <div className="new-year-section">
          <button className="btn ghost" onClick={resetForNewYear}>
            🔄 Start New Zakat Year
          </button>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <h4>Confirm Action</h4>
            <p>{confirmMessage}</p>
            <div className="confirm-dialog-actions">
              <button className="btn ghost" onClick={cancelConfirm}>
                Cancel
              </button>
              <button className="btn primary" onClick={executeConfirm}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ZakatPaymentsView;
