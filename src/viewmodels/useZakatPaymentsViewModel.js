import { useState, useMemo, useCallback } from "react";
import {
  loadPayments,
  savePayments,
  createPayment,
  addPayment,
  deletePayment,
  clearAllPayments,
  calculateTotalPaid,
  calculateRemainingBalance,
  validatePayment,
  PAYMENT_CATEGORIES,
} from "../models/paymentsModel";

export function useZakatPaymentsViewModel(zakatDue, currency) {
  const [payments, setPayments] = useState(() => loadPayments());
  const [manualZakatDue, setManualZakatDue] = useState(() => {
    const stored = localStorage.getItem("zakatify_manual_zakat_due");
    return stored ? parseFloat(stored) : null;
  });
  const [isManualMode, setIsManualMode] = useState(() => {
    return localStorage.getItem("zakatify_manual_mode") === "true";
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");

  const effectiveZakatDue = useMemo(() => {
    if (isManualMode && manualZakatDue !== null) {
      return manualZakatDue;
    }
    return zakatDue || 0;
  }, [isManualMode, manualZakatDue, zakatDue]);

  const totalPaid = useMemo(() => calculateTotalPaid(payments), [payments]);

  const remainingBalance = useMemo(
    () => calculateRemainingBalance(effectiveZakatDue, totalPaid),
    [effectiveZakatDue, totalPaid]
  );

  const isComplete = remainingBalance <= 0 && effectiveZakatDue > 0;
  const isOverpaid = remainingBalance < 0;

  const addNewPayment = useCallback(
    (category, description, amount) => {
      const errors = validatePayment(category, amount);
      if (errors.length > 0) {
        return { success: false, errors };
      }

      const newPayment = createPayment(category, description, amount, currency);
      const updated = addPayment(payments, newPayment);
      setPayments(updated);
      return { success: true, payment: newPayment };
    },
    [payments, currency]
  );

  const removePayment = useCallback(
    (paymentId) => {
      const updated = deletePayment(payments, paymentId);
      setPayments(updated);
    },
    [payments]
  );

  const confirmDeletePayment = useCallback((paymentId, paymentDescription) => {
    setConfirmAction(() => () => removePayment(paymentId));
    setConfirmMessage(`Are you sure you want to delete the payment "${paymentDescription}"?`);
    setShowConfirmDialog(true);
  }, [removePayment]);

  const confirmClearAll = useCallback(() => {
    setConfirmAction(() => () => {
      const cleared = clearAllPayments();
      setPayments(cleared);
    });
    setConfirmMessage("Are you sure you want to clear all payments? This action cannot be undone.");
    setShowConfirmDialog(true);
  }, []);

  const executeConfirm = useCallback(() => {
    if (confirmAction) {
      confirmAction();
    }
    setShowConfirmDialog(false);
    setConfirmAction(null);
    setConfirmMessage("");
  }, [confirmAction]);

  const cancelConfirm = useCallback(() => {
    setShowConfirmDialog(false);
    setConfirmAction(null);
    setConfirmMessage("");
  }, []);

  const enableManualMode = useCallback((amount) => {
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount > 0) {
      setManualZakatDue(numAmount);
      setIsManualMode(true);
      localStorage.setItem("zakatify_manual_zakat_due", numAmount.toString());
      localStorage.setItem("zakatify_manual_mode", "true");
      return true;
    }
    return false;
  }, []);

  const disableManualMode = useCallback(() => {
    setIsManualMode(false);
    setManualZakatDue(null);
    localStorage.removeItem("zakatify_manual_zakat_due");
    localStorage.setItem("zakatify_manual_mode", "false");
  }, []);

  const updateManualAmount = useCallback((amount) => {
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount > 0) {
      setManualZakatDue(numAmount);
      localStorage.setItem("zakatify_manual_zakat_due", numAmount.toString());
      return true;
    }
    return false;
  }, []);

  const resetForNewYear = useCallback(() => {
    setConfirmAction(() => () => {
      const cleared = clearAllPayments();
      setPayments(cleared);
      setManualZakatDue(null);
      setIsManualMode(false);
      localStorage.removeItem("zakatify_manual_zakat_due");
      localStorage.removeItem("zakatify_manual_mode");
      localStorage.removeItem("zakatify_shared_zakat_due");
    });
    setConfirmMessage("Start a new zakat year? This will clear all payments and reset the zakat due amount.");
    setShowConfirmDialog(true);
  }, []);

  return {
    payments,
    effectiveZakatDue,
    totalPaid,
    remainingBalance,
    isComplete,
    isOverpaid,
    isManualMode,
    showConfirmDialog,
    confirmMessage,
    categories: PAYMENT_CATEGORIES,
    addNewPayment,
    removePayment,
    confirmDeletePayment,
    confirmClearAll,
    executeConfirm,
    cancelConfirm,
    enableManualMode,
    disableManualMode,
    updateManualAmount,
    resetForNewYear,
  };
}

export default useZakatPaymentsViewModel;
