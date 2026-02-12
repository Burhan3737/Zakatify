export const STORAGE_KEY = "zakat_calculator_phase1_v1";

export const NISAB_GRAMS = {
  gold: 85,
  silver: 595,
};

export const FALLBACK_METAL_PRICES_USD_PER_OUNCE = {
  gold: 2332.76,
  silver: 26.44,
};

export const DEFAULT_CURRENCY = "USD";

export const CURRENCY_OPTIONS = [
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "EUR", label: "Euro", symbol: "EUR" },
  { code: "GBP", label: "British Pound", symbol: "GBP" },
  { code: "AED", label: "UAE Dirham", symbol: "AED" },
  { code: "SAR", label: "Saudi Riyal", symbol: "SAR" },
  { code: "PKR", label: "Pakistani Rupee", symbol: "PKR" },
  { code: "INR", label: "Indian Rupee", symbol: "INR" },
  { code: "BDT", label: "Bangladeshi Taka", symbol: "BDT" },
  { code: "MYR", label: "Malaysian Ringgit", symbol: "MYR" },
  { code: "TRY", label: "Turkish Lira", symbol: "TRY" },
  { code: "CAD", label: "Canadian Dollar", symbol: "CAD" },
  { code: "AUD", label: "Australian Dollar", symbol: "AUD" },
];

export const FALLBACK_EXCHANGE_RATES_FROM_USD = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  AED: 3.67,
  SAR: 3.75,
  PKR: 278,
  INR: 83,
  BDT: 117,
  MYR: 4.45,
  TRY: 32,
  CAD: 1.35,
  AUD: 1.52,
};

export const defaultFormData = {
  currency: DEFAULT_CURRENCY,
  assets: {
    cashBank: "",
    cashOnHand: "",
    goldMode: "grams",
    goldGrams: "",
    goldOunce: "",
    goldTola: "",
    goldValue: "",
    silverMode: "grams",
    silverGrams: "",
    silverOunce: "",
    silverTola: "",
    silverValue: "",
    investmentsCrypto: "",
    receivables: "",
  },
  liabilities: {
    shortTermDebts: "",
  },
  nisabBasis: "silver",
};

export function toAmount(value) {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return parsed;
}

function roundCurrency(value) {
  return Math.round(value * 100) / 100;
}

function computeMetalValue(gramsInput, pricePerGram) {
  return toAmount(gramsInput) * pricePerGram;
}

export function calculateZakat(formData, prices) {
  const cashBank = toAmount(formData.assets.cashBank);
  const cashOnHand = toAmount(formData.assets.cashOnHand);
  const cashTotal = cashBank + cashOnHand;

  const goldTotal = computeMetalValue(
    formData.assets.goldGrams,
    prices.goldPerGram
  );

  const silverTotal = computeMetalValue(
    formData.assets.silverGrams,
    prices.silverPerGram
  );

  const investmentsCrypto = toAmount(formData.assets.investmentsCrypto);
  const receivables = toAmount(formData.assets.receivables);
  const totalAssets =
    cashTotal + goldTotal + silverTotal + investmentsCrypto + receivables;

  const shortTermDebts = toAmount(formData.liabilities.shortTermDebts);
  const totalLiabilities = shortTermDebts;

  const netZakatableWealth = totalAssets - totalLiabilities;

  const nisabGold = NISAB_GRAMS.gold * prices.goldPerGram;
  const nisabSilver = NISAB_GRAMS.silver * prices.silverPerGram;
  const selectedNisab =
    formData.nisabBasis === "gold" ? nisabGold : nisabSilver;

  const closeThreshold = selectedNisab * 0.9;
  const nisabStatus =
    netZakatableWealth >= selectedNisab
      ? "Above"
      : netZakatableWealth >= closeThreshold
        ? "Close"
        : "Below";

  const isEligibleForZakat = netZakatableWealth >= selectedNisab;
  // Phase 1 behavior: zakat due appears only when above selected nisab.
  const zakatDue = isEligibleForZakat ? netZakatableWealth * 0.025 : 0;

  return {
    breakdown: {
      cashTotal: roundCurrency(cashTotal),
      goldTotal: roundCurrency(goldTotal),
      silverTotal: roundCurrency(silverTotal),
      investmentsCrypto: roundCurrency(investmentsCrypto),
      receivables: roundCurrency(receivables),
      totalAssets: roundCurrency(totalAssets),
      shortTermDebts: roundCurrency(shortTermDebts),
      totalLiabilities: roundCurrency(totalLiabilities),
    },
    totals: {
      netZakatableWealth: roundCurrency(netZakatableWealth),
      zakatDue: roundCurrency(zakatDue),
    },
    nisab: {
      basis: formData.nisabBasis,
      goldThreshold: roundCurrency(nisabGold),
      silverThreshold: roundCurrency(nisabSilver),
      selectedThreshold: roundCurrency(selectedNisab),
      status: nisabStatus,
      isEligibleForZakat,
    },
  };
}
