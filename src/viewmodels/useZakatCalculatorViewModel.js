import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_CURRENCY,
  calculateZakat,
  defaultFormData,
  FALLBACK_METAL_PRICES_USD_PER_GRAM,
  STORAGE_KEY,
} from "../models/zakatModel";
import { fetchExchangeRatesFromUSD } from "../services/currencyRateService";
import { fetchMetalPrices } from "../services/metalPriceService";
import { getRateForCurrency } from "../utils/currency";

function loadStoredForm() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultFormData;
    const parsed = JSON.parse(raw);
    return {
      ...defaultFormData,
      ...parsed,
      assets: { ...defaultFormData.assets, ...parsed.assets },
      liabilities: { ...defaultFormData.liabilities, ...parsed.liabilities },
    };
  } catch (_error) {
    return defaultFormData;
  }
}

export function useZakatCalculatorViewModel() {
  const [formData, setFormData] = useState(loadStoredForm);
  const [step, setStep] = useState(1);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [metalPricesUsd, setMetalPricesUsd] = useState({
    goldPerGram: FALLBACK_METAL_PRICES_USD_PER_GRAM.gold,
    silverPerGram: FALLBACK_METAL_PRICES_USD_PER_GRAM.silver,
    source: "fallback-static",
    fallback: true,
    updatedAt: null,
  });
  const [exchangeRates, setExchangeRates] = useState({
    rates: { [DEFAULT_CURRENCY]: 1 },
    source: "fallback-static",
    fallback: true,
    updatedAt: null,
  });

  useEffect(() => {
    // Persist user progress so they can leave and continue later.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    // Fetch metal prices once per session; calculator works offline using fallback values.
    let mounted = true;
    fetchMetalPrices()
      .then((result) => {
        if (!mounted) return;
        setMetalPricesUsd(result);
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoadingPrices(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchExchangeRatesFromUSD().then((result) => {
      if (!mounted) return;
      setExchangeRates(result);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const currency = formData.currency || DEFAULT_CURRENCY;
  const conversionRate = getRateForCurrency(exchangeRates.rates, currency);

  const prices = useMemo(
    () => ({
      ...metalPricesUsd,
      goldPerGram: metalPricesUsd.goldPerGram * conversionRate,
      silverPerGram: metalPricesUsd.silverPerGram * conversionRate,
      currency,
      conversionRateSource: exchangeRates.source,
      conversionRateFallback: exchangeRates.fallback,
    }),
    [currency, conversionRate, exchangeRates.fallback, exchangeRates.source, metalPricesUsd]
  );

  const result = useMemo(() => calculateZakat(formData, prices), [formData, prices]);

  function updateAsset(field, value) {
    setFormData((current) => ({
      ...current,
      assets: {
        ...current.assets,
        [field]: value,
      },
    }));
  }

  function updateLiability(field, value) {
    setFormData((current) => ({
      ...current,
      liabilities: {
        ...current.liabilities,
        [field]: value,
      },
    }));
  }

  function setNisabBasis(value) {
    setFormData((current) => ({
      ...current,
      nisabBasis: value,
    }));
  }

  function setCurrency(value) {
    setFormData((current) => ({
      ...current,
      currency: value,
    }));
  }

  function nextStep() {
    setStep((current) => Math.min(current + 1, 3));
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 1));
  }

  function jumpToStep(value) {
    setStep(Math.min(Math.max(value, 1), 3));
  }

  return {
    step,
    formData,
    currency,
    prices,
    isLoadingPrices,
    result,
    updateAsset,
    updateLiability,
    setNisabBasis,
    setCurrency,
    nextStep,
    previousStep,
    jumpToStep,
  };
}
