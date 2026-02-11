import {
  CURRENCY_OPTIONS,
  DEFAULT_CURRENCY,
  FALLBACK_EXCHANGE_RATES_FROM_USD,
} from "../models/zakatModel";

const CURRENCY_TO_LOCALE = {
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  AED: "en-AE",
  SAR: "ar-SA",
  PKR: "en-PK",
  INR: "en-IN",
  BDT: "bn-BD",
  MYR: "ms-MY",
  TRY: "tr-TR",
  CAD: "en-CA",
  AUD: "en-AU",
};

export function getCurrencyByCode(code) {
  return (
    CURRENCY_OPTIONS.find((currency) => currency.code === code) ||
    CURRENCY_OPTIONS.find((currency) => currency.code === DEFAULT_CURRENCY)
  );
}

export function getCurrencySymbol(code) {
  return getCurrencyByCode(code)?.symbol || "$";
}

export function formatMoney(amount, currencyCode, options = {}) {
  const safeCurrency = getCurrencyByCode(currencyCode)?.code || DEFAULT_CURRENCY;
  const safeAmount = Number.isFinite(amount) ? amount : 0;

  return new Intl.NumberFormat(CURRENCY_TO_LOCALE[safeCurrency] || "en-US", {
    style: "currency",
    currency: safeCurrency,
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
    minimumFractionDigits: options.minimumFractionDigits,
  }).format(safeAmount);
}

export function getRateForCurrency(rates, currencyCode) {
  const safeCurrency = getCurrencyByCode(currencyCode)?.code || DEFAULT_CURRENCY;
  const parsed = Number(rates?.[safeCurrency]);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  return FALLBACK_EXCHANGE_RATES_FROM_USD[safeCurrency] || 1;
}
