export const STORAGE_KEY = "zakat_calculator_phase1_v1";

export const NISAB_GRAMS = {
  gold: 85,
  silver: 595,
};

export const FALLBACK_METAL_PRICES_USD_PER_GRAM = {
  gold: 75,
  silver: 0.85,
};

export const defaultFormData = {
  assets: {
    cashBank: "",
    cashOnHand: "",
    goldMode: "grams",
    goldGrams: "",
    goldValue: "",
    silverMode: "grams",
    silverGrams: "",
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

function computeMetalValue(mode, gramsInput, valueInput, pricePerGram) {
  // User can provide metal wealth by grams or direct current market value.
  if (mode === "value") return toAmount(valueInput);
  return toAmount(gramsInput) * pricePerGram;
}

export function calculateZakat(formData, prices) {
  const cashBank = toAmount(formData.assets.cashBank);
  const cashOnHand = toAmount(formData.assets.cashOnHand);
  const cashTotal = cashBank + cashOnHand;

  const goldTotal = computeMetalValue(
    formData.assets.goldMode,
    formData.assets.goldGrams,
    formData.assets.goldValue,
    prices.goldPerGram
  );

  const silverTotal = computeMetalValue(
    formData.assets.silverMode,
    formData.assets.silverGrams,
    formData.assets.silverValue,
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
