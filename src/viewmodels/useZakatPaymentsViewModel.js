import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  createPayment,
  calculateTotalPaid,
  calculateRemainingBalance,
  validatePayment,
  PAYMENT_CATEGORIES,
} from "../models/paymentsModel";
import { useAuth } from "../contexts/AuthContext";
import {
  loadPayments,
  savePayments,
  loadCalculatorResults,
  saveCalculatorResults,
} from "../services/dataService";

export function useZakatPaymentsViewModel(zakatDue, currency) {
  const { session } = useAuth();
  const [payments, setPayments] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
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
  const zakatDueRef = useRef(zakatDue);

  useEffect(() => {
    zakatDueRef.current = zakatDue;
  }, [zakatDue]);

  useEffect(() => {
    if (!session?.user) {
      setIsDataLoaded(true);
      return;
    }

    async function loadData() {
      try {
        const [paymentsData, resultsData] = await Promise.all([
          loadPayments(session.user.id),
          loadCalculatorResults(session.user.id),
        ]);

        setPayments(paymentsData);

        if (resultsData) {
          if (resultsData.manual_mode) {
            setIsManualMode(true);
            if (resultsData.manual_zakat_due != null) {
              setManualZakatDue(parseFloat(resultsData.manual_zakat_due));
            }
          }
        }
      } catch (e) {
        console.warn("Failed to load from Supabase:", e);
      }
      setIsDataLoaded(true);
    }

    loadData();
  }, [session]);

  useEffect(() => {
    if (!isDataLoaded || !session?.user) return;

    saveCalculatorResults(session.user.id, {
      manualMode: isManualMode,
      manualZakatDue: isManualMode ? manualZakatDue : null,
      zakatDue: zakatDueRef.current || null,
    }).catch((e) => console.warn("Failed to save manual mode:", e));
  }, [session, isManualMode, manualZakatDue, isDataLoaded]);

  const savePaymentsToDb = useCallback(
    async (newPayments) => {
      localStorage.setItem("zakatify_payments", JSON.stringify(newPayments));
      if (session?.user) {
        await savePayments(session.user.id, newPayments);
      }
    },
    [session],
  );

  const effectiveZakatDue = useMemo(() => {
    if (isManualMode && manualZakatDue !== null) {
      return manualZakatDue;
    }
    return zakatDue || 0;
  }, [isManualMode, manualZakatDue, zakatDue]);

  const totalPaid = useMemo(() => calculateTotalPaid(payments), [payments]);

  const remainingBalance = useMemo(
    () => calculateRemainingBalance(effectiveZakatDue, totalPaid),
    [effectiveZakatDue, totalPaid],
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
      const updated = [newPayment, ...payments];
      setPayments(updated);
      savePaymentsToDb(updated);
      return { success: true, payment: newPayment };
    },
    [payments, currency, savePaymentsToDb],
  );

  const removePayment = useCallback(
    (paymentId) => {
      const updated = payments.filter((p) => p.id !== paymentId);
      setPayments(updated);
      savePaymentsToDb(updated);
    },
    [payments, savePaymentsToDb],
  );

  const confirmDeletePayment = useCallback(
    (paymentId, paymentDescription) => {
      setConfirmAction(() => () => removePayment(paymentId));
      setConfirmMessage(
        `Are you sure you want to delete the payment "${paymentDescription}"?`,
      );
      setShowConfirmDialog(true);
    },
    [removePayment],
  );

  const confirmClearAll = useCallback(() => {
    setConfirmAction(() => () => {
      const cleared = [];
      setPayments(cleared);
      savePaymentsToDb(cleared);
    });
    setConfirmMessage(
      "Are you sure you want to clear all payments? This action cannot be undone.",
    );
    setShowConfirmDialog(true);
  }, [savePaymentsToDb]);

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
      const cleared = [];
      setPayments(cleared);
      savePaymentsToDb(cleared);
      setManualZakatDue(null);
      setIsManualMode(false);
      localStorage.removeItem("zakatify_manual_zakat_due");
      localStorage.removeItem("zakatify_manual_mode");
      localStorage.removeItem("zakatify_shared_zakat_due");
    });
    setConfirmMessage(
      "Start a new zakat year? This will clear all payments and reset the zakat due amount.",
    );
    setShowConfirmDialog(true);
  }, [savePaymentsToDb]);

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
