import {
  CURRENCY_OPTIONS,
  FALLBACK_EXCHANGE_RATES_FROM_USD,
} from "../models/zakatModel";

const EXCHANGE_RATE_API_URL = "https://open.er-api.com/v6/latest/USD";
const SUPPORTED_CURRENCY_CODES = new Set(CURRENCY_OPTIONS.map((item) => item.code));

function pickSupportedRates(rawRates) {
  if (!rawRates || typeof rawRates !== "object") {
    return null;
  }

  const supportedRates = {};
  for (const code of SUPPORTED_CURRENCY_CODES) {
    const parsed = Number(rawRates[code]);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      continue;
    }
    supportedRates[code] = parsed;
  }

  if (Object.keys(supportedRates).length === 0) {
    return null;
  }

  if (!supportedRates.USD) {
    supportedRates.USD = 1;
  }

  return supportedRates;
}

export async function fetchExchangeRatesFromUSD() {
  try {
    const response = await fetch(EXCHANGE_RATE_API_URL);
    if (!response.ok) {
      throw new Error(`Exchange rate API failed with ${response.status}`);
    }

    const payload = await response.json();
    const supportedRates = pickSupportedRates(payload.rates);
    if (!supportedRates) {
      throw new Error("Unable to parse exchange rate response.");
    }

    return {
      rates: supportedRates,
      source: "open.er-api.com",
      fallback: false,
      updatedAt: payload.time_last_update_utc || new Date().toISOString(),
    };
  } catch (_error) {
    return {
      rates: FALLBACK_EXCHANGE_RATES_FROM_USD,
      source: "fallback-static",
      fallback: true,
      updatedAt: new Date().toISOString(),
    };
  }
}
