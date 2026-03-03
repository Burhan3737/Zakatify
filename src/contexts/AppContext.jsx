import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { DEFAULT_CURRENCY } from "../models/zakatModel";
import {
  loadCalculatorResults,
  saveCalculatorResults,
  loadUserPreferences,
  saveUserPreferences,
} from "../services/dataService";

const AppContext = createContext();

const MODULE_STORAGE_KEY = "zakatify_active_module";
const ZAKAT_DUE_STORAGE_KEY = "zakatify_shared_zakat_due";

const DEFAULT_MODULE = "calculator";

function loadInitialCurrency() {
  if (typeof window === "undefined") return DEFAULT_CURRENCY;
  return DEFAULT_CURRENCY;
}

export function AppProvider({ children }) {
  const { session, loading: authLoading } = useAuth();
  const [currency, setCurrency] = useState(loadInitialCurrency);

  const [activeModule, setActiveModule] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_MODULE;
    return localStorage.getItem(MODULE_STORAGE_KEY) || DEFAULT_MODULE;
  });

  const [sharedZakatDue, setSharedZakatDue] = useState(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(ZAKAT_DUE_STORAGE_KEY);
    return stored ? parseFloat(stored) : null;
  });

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    async function loadResults() {
      if (session?.user) {
        const [results, prefs] = await Promise.all([
          loadCalculatorResults(session.user.id),
          loadUserPreferences(session.user.id),
        ]);

        if (results) {
          if (results.zatak_due != null) {
            setSharedZakatDue(parseFloat(results.zatak_due));
          }
        }

        if (prefs?.currency) {
          setCurrency(prefs.currency);
        }
      }
      setIsDataLoaded(true);
    }

    loadResults();
  }, [session, authLoading]);

  useEffect(() => {
    if (!isDataLoaded || !session?.user) return;

    if (sharedZakatDue !== null) {
      localStorage.setItem(ZAKAT_DUE_STORAGE_KEY, sharedZakatDue.toString());
      saveCalculatorResults(session.user.id, {
        zakatDue: sharedZakatDue,
        manualMode: false,
        manualZakatDue: null,
      });
    }
  }, [sharedZakatDue, session, isDataLoaded]);

  useEffect(() => {
    if (!isDataLoaded || !session?.user) return;

    saveUserPreferences(session.user.id, {
      currency: currency,
    }).catch((e) => {
      console.warn("Failed to save currency preference:", e);
    });
  }, [currency, session, isDataLoaded]);

  useEffect(() => {
    localStorage.setItem(MODULE_STORAGE_KEY, activeModule);
  }, [activeModule]);

  const updateZakatDueFromCalculator = (amount) => {
    if (amount > 0) {
      setSharedZakatDue(amount);
    } else {
      setSharedZakatDue(0);
    }
  };

  const clearZakatDue = () => {
    setSharedZakatDue(null);
    localStorage.removeItem(ZAKAT_DUE_STORAGE_KEY);
  };

  return (
    <AppContext.Provider
      value={{
        currency,
        setCurrency,
        activeModule,
        setActiveModule,
        sharedZakatDue,
        setSharedZakatDue,
        updateZakatDueFromCalculator,
        clearZakatDue,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}

export default AppContext;
