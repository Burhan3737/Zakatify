import { useEffect, useMemo, useState, useCallback } from "react";
import {
  DEFAULT_CURRENCY,
  calculateZakat,
  defaultFormData,
  FALLBACK_METAL_PRICES_USD_PER_OUNCE,
  STORAGE_KEY,
} from "../models/zakatModel";
import { fetchExchangeRatesFromUSD } from "../services/currencyRateService";
import { fetchMetalPrices } from "../services/metalPriceService";
import { getRateForCurrency } from "../utils/currency";
import { useAuth } from "../contexts/AuthContext";
import { loadCalculatorData, saveCalculatorData } from "../services/dataService";

export function useZakatCalculatorViewModel() {
  const { session } = useAuth();
  const [formData, setFormData] = useState(defaultFormData);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [metalPricesUsd, setMetalPricesUsd] = useState({
    goldPerOunce: FALLBACK_METAL_PRICES_USD_PER_OUNCE.gold,
    silverPerOunce: FALLBACK_METAL_PRICES_USD_PER_OUNCE.silver,
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
    async function loadData() {
      let loadedData = null;
      
      if (session?.user) {
        loadedData = await loadCalculatorData(session.user.id);
      }

      if (loadedData) {
        setFormData({
          ...defaultFormData,
          ...loadedData,
          assets: { ...defaultFormData.assets, ...(loadedData.assets || {}) },
          liabilities: { ...defaultFormData.liabilities, ...(loadedData.liabilities || {}) },
        });
      } else {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            setFormData({
              ...defaultFormData,
              ...parsed,
              assets: { ...defaultFormData.assets, ...parsed.assets },
              liabilities: { ...defaultFormData.liabilities, ...parsed.liabilities },
            });
          } catch (_error) {
            // Use defaultFormData
          }
        }
      }
      setIsDataLoaded(true);
    }

    if (!session?.user) {
      setIsDataLoaded(true);
      return;
    }

    loadData();
  }, [session]);

  const saveFormData = useCallback(
    async (data) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      if (session?.user) {
        await saveCalculatorData(session.user.id, data);
      }
    },
    [session]
  );

  useEffect(() => {
    if (!isDataLoaded) return;
    saveFormData(formData);
  }, [formData, isDataLoaded, saveFormData]);

  useEffect(() => {
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

  const GRAMS_PER_TROY_OUNCE = 31.1034768;
  const GRAMS_PER_TOLA = 11.66;

  const pricesPerGram = useMemo(
    () => ({
      goldPerGram: (metalPricesUsd.goldPerOunce / GRAMS_PER_TROY_OUNCE) * conversionRate,
      silverPerGram: (metalPricesUsd.silverPerOunce / GRAMS_PER_TROY_OUNCE) * conversionRate,
    }),
    [metalPricesUsd, conversionRate]
  );

  function convertToGrams(mode, grams, ounce, tola, value, pricePerGram) {
    if (mode === "value") return Number(value || 0) / pricePerGram;
    if (mode === "ounce") return Number(ounce || 0) * GRAMS_PER_TROY_OUNCE;
    if (mode === "tola") return Number(tola || 0) * GRAMS_PER_TOLA;
    return Number(grams || 0);
  }

  const formDataWithGrams = useMemo(
    () => ({
      ...formData,
      assets: {
        ...formData.assets,
        goldGrams: convertToGrams(
          formData.assets.goldMode,
          formData.assets.goldGrams,
          formData.assets.goldOunce,
          formData.assets.goldTola,
          formData.assets.goldValue,
          pricesPerGram.goldPerGram
        ),
        silverGrams: convertToGrams(
          formData.assets.silverMode,
          formData.assets.silverGrams,
          formData.assets.silverOunce,
          formData.assets.silverTola,
          formData.assets.silverValue,
          pricesPerGram.silverPerGram
        ),
      },
    }),
    [formData, pricesPerGram]
  );

  const prices = useMemo(
    () => ({
      ...metalPricesUsd,
      goldPerGram: pricesPerGram.goldPerGram,
      silverPerGram: pricesPerGram.silverPerGram,
      goldPerOunce: metalPricesUsd.goldPerOunce * conversionRate,
      silverPerOunce: metalPricesUsd.silverPerOunce * conversionRate,
      goldPerTola: pricesPerGram.goldPerGram * GRAMS_PER_TOLA,
      silverPerTola: pricesPerGram.silverPerGram * GRAMS_PER_TOLA,
      currency,
      conversionRateSource: exchangeRates.source,
      conversionRateFallback: exchangeRates.fallback,
    }),
    [metalPricesUsd, pricesPerGram, conversionRate, currency, exchangeRates]
  );

  const result = useMemo(() => calculateZakat(formDataWithGrams, pricesPerGram), [formDataWithGrams, pricesPerGram]);

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
