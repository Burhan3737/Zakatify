import { createContext, useContext, useEffect, useState } from "react";
import { STORAGE_KEY, DEFAULT_CURRENCY } from "../models/zakatModel";

const AppContext = createContext();

const MODULE_STORAGE_KEY = "zakatify_active_module";
const ZAKAT_DUE_STORAGE_KEY = "zakatify_shared_zakat_due";

const DEFAULT_MODULE = "calculator";

function loadInitialCurrency() {
  if (typeof window === "undefined") return DEFAULT_CURRENCY;
  
  // First try to get currency from calculator storage
  try {
    const calculatorData = localStorage.getItem(STORAGE_KEY);
    if (calculatorData) {
      const parsed = JSON.parse(calculatorData);
      if (parsed.currency) return parsed.currency;
    }
  } catch (e) {
    console.error("Error reading calculator currency:", e);
  }
  
  return DEFAULT_CURRENCY;
}

export function AppProvider({ children }) {
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

  // Currency is persisted through the calculator's storage
  // The calculator viewmodel handles saving to STORAGE_KEY
  // We just keep it in sync here

  useEffect(() => {
    localStorage.setItem(MODULE_STORAGE_KEY, activeModule);
  }, [activeModule]);

  useEffect(() => {
    if (sharedZakatDue !== null) {
      localStorage.setItem(ZAKAT_DUE_STORAGE_KEY, sharedZakatDue.toString());
    }
  }, [sharedZakatDue]);

  const updateZakatDueFromCalculator = (amount) => {
    if (amount > 0) {
      setSharedZakatDue(amount);
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
