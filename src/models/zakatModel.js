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
    // Cash & Bank
    cashSavings: "",
    cashCurrent: "",
    cashFixedDeposits: "",
    
    // Gold by Carat
    gold24k: "",
    gold22k: "",
    gold18k: "",
    goldOther: "",
    
    // Silver
    silverUtensils: "",
    silverArtifacts: "",
    silverJewelry: "",
    
    // Precious Stones
    preciousStones: "",
    
    // Investments & Loans
    loansReceivable: "",
    govtBonds: "",
    providentFund: "",
    insuranceBonus: "",
    sharesValue: "",
    govtSecurities: "",
    privateChitsFunds: "",
    otherWealth: "",
    
    // Property
    landedProperty: "",
    
    // Business Assets
    businessStock: "",
    businessDamagedStock: "",
    businessCreditSales: "",
    businessPayables: "",
    businessBadDebts: "",
    
    // Partnership
    partnershipCapital: "",
    partnershipLoans: "",
    partnershipWithdrawals: "",
    partnershipAccumulatedProfit: "",
  },
  liabilities: {
    shortTermDebts: "",
    loansFriendsRelatives: "",
    loansBanksInstitutions: "",
    taxPayable: "",
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
  // Cash & Bank
  const cashSavings = toAmount(formData.assets.cashSavings);
  const cashCurrent = toAmount(formData.assets.cashCurrent);
  const cashFixedDeposits = toAmount(formData.assets.cashFixedDeposits);
  const cashTotal = cashSavings + cashCurrent + cashFixedDeposits;

  // Gold (weighted by purity: 24K=100%, 22K=91.6%, 18K=75%, Other=100%)
  const gold24k = toAmount(formData.assets.gold24k);
  const gold22k = toAmount(formData.assets.gold22k) * 0.916;
  const gold18k = toAmount(formData.assets.gold18k) * 0.75;
  const goldOther = toAmount(formData.assets.goldOther);
  const goldTotal = gold24k + gold22k + gold18k + goldOther;

  // Silver (direct values)
  const silverUtensils = toAmount(formData.assets.silverUtensils);
  const silverArtifacts = toAmount(formData.assets.silverArtifacts);
  const silverJewelry = toAmount(formData.assets.silverJewelry);
  const silverTotal = silverUtensils + silverArtifacts + silverJewelry;

  // Precious Stones
  const preciousStones = toAmount(formData.assets.preciousStones);

  // Investments & Loans
  const loansReceivable = toAmount(formData.assets.loansReceivable);
  const govtBonds = toAmount(formData.assets.govtBonds);
  const providentFund = toAmount(formData.assets.providentFund);
  const insuranceBonus = toAmount(formData.assets.insuranceBonus);
  const sharesValue = toAmount(formData.assets.sharesValue);
  const govtSecurities = toAmount(formData.assets.govtSecurities);
  const privateChitsFunds = toAmount(formData.assets.privateChitsFunds);
  const otherWealth = toAmount(formData.assets.otherWealth);
  const investmentsTotal = loansReceivable + govtBonds + providentFund +
    insuranceBonus + sharesValue + govtSecurities + privateChitsFunds + otherWealth;

  // Property
  const landedProperty = toAmount(formData.assets.landedProperty);

  // Business Assets (calculated: Stock + Damaged + Credit Sales - Payables - Bad Debts)
  const businessStock = toAmount(formData.assets.businessStock);
  const businessDamagedStock = toAmount(formData.assets.businessDamagedStock);
  const businessCreditSales = toAmount(formData.assets.businessCreditSales);
  const businessPayables = toAmount(formData.assets.businessPayables);
  const businessBadDebts = toAmount(formData.assets.businessBadDebts);
  const businessTotal = Math.max(0, (businessStock + businessDamagedStock + businessCreditSales) -
    (businessPayables + businessBadDebts));

  // Partnership (calculated: Capital + Loans - Withdrawals + Profit)
  const partnershipCapital = toAmount(formData.assets.partnershipCapital);
  const partnershipLoans = toAmount(formData.assets.partnershipLoans);
  const partnershipWithdrawals = toAmount(formData.assets.partnershipWithdrawals);
  const partnershipAccumulatedProfit = toAmount(formData.assets.partnershipAccumulatedProfit);
  const partnershipTotal = Math.max(0, partnershipCapital + partnershipLoans -
    partnershipWithdrawals + partnershipAccumulatedProfit);

  // Total Assets
  const totalAssets = cashTotal + goldTotal + silverTotal + preciousStones +
    investmentsTotal + landedProperty + businessTotal + partnershipTotal;

  // Liabilities
  const shortTermDebts = toAmount(formData.liabilities.shortTermDebts);
  const loansFriendsRelatives = toAmount(formData.liabilities.loansFriendsRelatives);
  const loansBanksInstitutions = toAmount(formData.liabilities.loansBanksInstitutions);
  const taxPayable = toAmount(formData.liabilities.taxPayable);
  const totalLiabilities = shortTermDebts + loansFriendsRelatives + loansBanksInstitutions + taxPayable;

  const netZakatableWealth = Math.max(0, totalAssets - totalLiabilities);

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
  const zakatDue = isEligibleForZakat ? netZakatableWealth * 0.025 : 0;

  return {
    breakdown: {
      cashTotal: roundCurrency(cashTotal),
      cashSavings: roundCurrency(cashSavings),
      cashCurrent: roundCurrency(cashCurrent),
      cashFixedDeposits: roundCurrency(cashFixedDeposits),
      goldTotal: roundCurrency(goldTotal),
      gold24k: roundCurrency(gold24k),
      gold22k: roundCurrency(gold22k),
      gold18k: roundCurrency(gold18k),
      goldOther: roundCurrency(goldOther),
      silverTotal: roundCurrency(silverTotal),
      silverUtensils: roundCurrency(silverUtensils),
      silverArtifacts: roundCurrency(silverArtifacts),
      silverJewelry: roundCurrency(silverJewelry),
      preciousStones: roundCurrency(preciousStones),
      investmentsTotal: roundCurrency(investmentsTotal),
      loansReceivable: roundCurrency(loansReceivable),
      govtBonds: roundCurrency(govtBonds),
      providentFund: roundCurrency(providentFund),
      insuranceBonus: roundCurrency(insuranceBonus),
      sharesValue: roundCurrency(sharesValue),
      govtSecurities: roundCurrency(govtSecurities),
      privateChitsFunds: roundCurrency(privateChitsFunds),
      otherWealth: roundCurrency(otherWealth),
      landedProperty: roundCurrency(landedProperty),
      businessTotal: roundCurrency(businessTotal),
      businessStock: roundCurrency(businessStock),
      businessDamagedStock: roundCurrency(businessDamagedStock),
      businessCreditSales: roundCurrency(businessCreditSales),
      businessPayables: roundCurrency(businessPayables),
      businessBadDebts: roundCurrency(businessBadDebts),
      partnershipTotal: roundCurrency(partnershipTotal),
      partnershipCapital: roundCurrency(partnershipCapital),
      partnershipLoans: roundCurrency(partnershipLoans),
      partnershipWithdrawals: roundCurrency(partnershipWithdrawals),
      partnershipAccumulatedProfit: roundCurrency(partnershipAccumulatedProfit),
      totalAssets: roundCurrency(totalAssets),
      shortTermDebts: roundCurrency(shortTermDebts),
      loansFriendsRelatives: roundCurrency(loansFriendsRelatives),
      loansBanksInstitutions: roundCurrency(loansBanksInstitutions),
      taxPayable: roundCurrency(taxPayable),
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
