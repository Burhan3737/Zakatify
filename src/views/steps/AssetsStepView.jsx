import { useState, useEffect, useMemo } from "react";
import { InputField } from "../../components/InputField";

const ACCORDION_STORAGE_KEY = "zakatify_accordion_state_v1";

// Custom hook for accordion state with localStorage persistence
function useAccordionState() {
  const [openSections, setOpenSections] = useState(() => {
    try {
      const saved = localStorage.getItem(ACCORDION_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load accordion state:", e);
    }
    // Default: all sections closed
    return {
      cashBank: false,
      gold: false,
      silver: false,
      preciousStones: false,
      investments: false,
      property: false,
      business: false,
      partnership: false,
    };
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(ACCORDION_STORAGE_KEY, JSON.stringify(openSections));
    } catch (e) {
      console.error("Failed to save accordion state:", e);
    }
  }, [openSections]);

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const isOpen = (sectionKey) => openSections[sectionKey] ?? false;

  const expandAll = () => {
    setOpenSections({
      cashBank: true,
      gold: true,
      silver: true,
      preciousStones: true,
      investments: true,
      property: true,
      business: true,
      partnership: true,
    });
  };

  const collapseAll = () => {
    setOpenSections({
      cashBank: false,
      gold: false,
      silver: false,
      preciousStones: false,
      investments: false,
      property: false,
      business: false,
      partnership: false,
    });
  };

  return { isOpen, toggleSection, expandAll, collapseAll };
}

function AccordionSection({ title, children, sectionKey, isOpen, onToggle }) {
  return (
    <details className="accordion" open={isOpen}>
      <summary
        onClick={(e) => {
          e.preventDefault();
          onToggle(sectionKey);
        }}
      >
        <span>{title}</span>
        <span className="accordion-icon">{isOpen ? "−" : "+"}</span>
      </summary>
      {isOpen && <div className="accordion-content">{children}</div>}
    </details>
  );
}

function toAmount(value) {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return parsed;
}

function formatCurrency(value, symbol) {
  return `${symbol}${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function BusinessAssetsSection({ assets, updateAsset, currencySymbol }) {
  const total = useMemo(() => {
    const stock = toAmount(assets.businessStock);
    const damaged = toAmount(assets.businessDamagedStock);
    const creditSales = toAmount(assets.businessCreditSales);
    const payables = toAmount(assets.businessPayables);
    const badDebts = toAmount(assets.businessBadDebts);
    return Math.max(0, stock + damaged + creditSales - (payables + badDebts));
  }, [assets]);

  return (
    <div className="subsection">
      <InputField
        id="business-stock"
        label="Saleable Stock"
        value={assets.businessStock}
        onChange={(v) => updateAsset("businessStock", v)}
        prefix={currencySymbol}
      />
      <InputField
        id="business-damaged"
        label="Damaged / Dead Stock"
        value={assets.businessDamagedStock}
        onChange={(v) => updateAsset("businessDamagedStock", v)}
        prefix={currencySymbol}
      />
      <InputField
        id="business-credit-sales"
        label="Receivable from Credit Sales"
        value={assets.businessCreditSales}
        onChange={(v) => updateAsset("businessCreditSales", v)}
        prefix={currencySymbol}
      />
      <InputField
        id="business-payables"
        label="LESS: Payable to Suppliers"
        value={assets.businessPayables}
        onChange={(v) => updateAsset("businessPayables", v)}
        prefix={currencySymbol}
      />
      <InputField
        id="business-bad-debts"
        label="LESS: Bad Debts"
        value={assets.businessBadDebts}
        onChange={(v) => updateAsset("businessBadDebts", v)}
        prefix={currencySymbol}
      />
      <div className="calculated-total">
        <span>Total Business Value:</span>
        <strong>{formatCurrency(total, currencySymbol)}</strong>
      </div>
    </div>
  );
}

function PartnershipSection({ assets, updateAsset, currencySymbol }) {
  const total = useMemo(() => {
    const capital = toAmount(assets.partnershipCapital);
    const loans = toAmount(assets.partnershipLoans);
    const withdrawals = toAmount(assets.partnershipWithdrawals);
    const profit = toAmount(assets.partnershipAccumulatedProfit);
    return Math.max(0, capital + loans - withdrawals + profit);
  }, [assets]);

  return (
    <div className="subsection">
      <InputField
        id="partnership-capital"
        label="Capital Balance (Last Balance Sheet)"
        value={assets.partnershipCapital}
        onChange={(v) => updateAsset("partnershipCapital", v)}
        prefix={currencySymbol}
      />
      <InputField
        id="partnership-loans"
        label="Loans Advanced to Firm"
        value={assets.partnershipLoans}
        onChange={(v) => updateAsset("partnershipLoans", v)}
        prefix={currencySymbol}
      />
      <InputField
        id="partnership-withdrawals"
        label="LESS: Withdrawals this Year"
        value={assets.partnershipWithdrawals}
        onChange={(v) => updateAsset("partnershipWithdrawals", v)}
        prefix={currencySymbol}
      />
      <InputField
        id="partnership-profit"
        label="Accumulated Profit (Estimate)"
        value={assets.partnershipAccumulatedProfit}
        onChange={(v) => updateAsset("partnershipAccumulatedProfit", v)}
        prefix={currencySymbol}
      />
      <div className="calculated-total">
        <span>Nett Partnership Worth:</span>
        <strong>{formatCurrency(total, currencySymbol)}</strong>
      </div>
    </div>
  );
}

export function AssetsStepView({ assets, updateAsset, currencySymbol }) {
  const { isOpen, toggleSection, expandAll, collapseAll } = useAccordionState();

  return (
    <section className="panel">
      <h2>Step 1: Enter Zakatable Assets</h2>
      <p className="panel-subtitle">
        Add values you currently own and can access for this zakat period.
      </p>

      <div className="accordion-controls">
        <button type="button" className="btn btn-small" onClick={expandAll}>
          Expand All
        </button>
        <button type="button" className="btn btn-small" onClick={collapseAll}>
          Collapse All
        </button>
      </div>

      <AccordionSection
        title="Cash & Bank"
        sectionKey="cashBank"
        isOpen={isOpen("cashBank")}
        onToggle={toggleSection}
      >
        <InputField
          id="cash-savings"
          label="Savings Account"
          value={assets.cashSavings}
          onChange={(v) => updateAsset("cashSavings", v)}
          prefix={currencySymbol}
        />
        <InputField
          id="cash-current"
          label="Current Account"
          value={assets.cashCurrent}
          onChange={(v) => updateAsset("cashCurrent", v)}
          prefix={currencySymbol}
        />
        <InputField
          id="cash-fixed"
          label="Fixed Deposits"
          value={assets.cashFixedDeposits}
          onChange={(v) => updateAsset("cashFixedDeposits", v)}
          prefix={currencySymbol}
        />
      </AccordionSection>

      <AccordionSection
        title="Gold"
        sectionKey="gold"
        isOpen={isOpen("gold")}
        onToggle={toggleSection}
      >
        <InputField
          id="gold-24k"
          label="24 Carat Gold / Jewelry"
          value={assets.gold24k}
          onChange={(v) => updateAsset("gold24k", v)}
          prefix={currencySymbol}
        />
        <InputField
          id="gold-22k"
          label="22 Carat Gold / Jewelry"
          value={assets.gold22k}
          onChange={(v) => updateAsset("gold22k", v)}
          prefix={currencySymbol}
        />
        <InputField
          id="gold-18k"
          label="18 Carat Gold / Jewelry"
          value={assets.gold18k}
          onChange={(v) => updateAsset("gold18k", v)}
          prefix={currencySymbol}
        />
        <InputField
          id="gold-other"
          label="Other Gold Valuables"
          value={assets.goldOther}
          onChange={(v) => updateAsset("goldOther", v)}
          prefix={currencySymbol}
        />
      </AccordionSection>

      <AccordionSection
        title="Silver"
        sectionKey="silver"
        isOpen={isOpen("silver")}
        onToggle={toggleSection}
      >
        <InputField
          id="silver-utensils"
          label="Household Silver Utensils"
          value={assets.silverUtensils}
          onChange={(v) => updateAsset("silverUtensils", v)}
          prefix={currencySymbol}
        />
        <InputField
          id="silver-artifacts"
          label="Silver Artifacts"
          value={assets.silverArtifacts}
          onChange={(v) => updateAsset("silverArtifacts", v)}
          prefix={currencySymbol}
        />
        <InputField
          id="silver-jewelry"
          label="Silver Jewelry"
          value={assets.silverJewelry}
          onChange={(v) => updateAsset("silverJewelry", v)}
          prefix={currencySymbol}
        />
      </AccordionSection>

      <AccordionSection
        title="Precious Stones"
        sectionKey="preciousStones"
        isOpen={isOpen("preciousStones")}
        onToggle={toggleSection}
      >
        <InputField
          id="precious-stones"
          label="Diamonds, Rubies, etc. (Market Value)"
          value={assets.preciousStones}
          onChange={(v) => updateAsset("preciousStones", v)}
          prefix={currencySymbol}
        />
      </AccordionSection>

      <AccordionSection
        title="Investments, Loans & Funds"
        sectionKey="investments"
        isOpen={isOpen("investments")}
        onToggle={toggleSection}
      >
        <InputField
          id="loans-receivable"
          label="Loans Receivable from Friends/Relatives"
          value={assets.loansReceivable}
          onChange={(v) => updateAsset("loansReceivable", v)}
          prefix={currencySymbol}
        />
        <InputField
          id="govt-bonds"
          label="Government Bonds"
          value={assets.govtBonds}
          onChange={(v) => updateAsset("govtBonds", v)}
          prefix={currencySymbol}
        />
        <InputField
          id="provident-fund"
          label="Provident Fund (to date)"
          value={assets.providentFund}
          onChange={(v) => updateAsset("providentFund", v)}
          prefix={currencySymbol}
        />
        <InputField
          id="insurance-bonus"
          label="Insurance Premiums (including bonus)"
          value={assets.insuranceBonus}
          onChange={(v) => updateAsset("insuranceBonus", v)}
          prefix={currencySymbol}
        />
        <InputField
          id="shares-value"
          label="Shares / Stocks (with dividends)"
          value={assets.sharesValue}
          onChange={(v) => updateAsset("sharesValue", v)}
          prefix={currencySymbol}
        />
        <InputField
          id="govt-securities"
          label="Government Securities / ADRs"
          value={assets.govtSecurities}
          onChange={(v) => updateAsset("govtSecurities", v)}
          prefix={currencySymbol}
        />
        <InputField
          id="private-chits"
          label="Private Chits / Funds"
          value={assets.privateChitsFunds}
          onChange={(v) => updateAsset("privateChitsFunds", v)}
          prefix={currencySymbol}
        />
        <InputField
          id="other-wealth"
          label="Other Sources of Wealth"
          value={assets.otherWealth}
          onChange={(v) => updateAsset("otherWealth", v)}
          prefix={currencySymbol}
        />
      </AccordionSection>

      <AccordionSection
        title="Landed Property"
        sectionKey="property"
        isOpen={isOpen("property")}
        onToggle={toggleSection}
      >
        <InputField
          id="landed-property"
          label="Property held as Investment / Business"
          value={assets.landedProperty}
          onChange={(v) => updateAsset("landedProperty", v)}
          prefix={currencySymbol}
        />
      </AccordionSection>

      <AccordionSection
        title="Business Assets"
        sectionKey="business"
        isOpen={isOpen("business")}
        onToggle={toggleSection}
      >
        <BusinessAssetsSection
          assets={assets}
          updateAsset={updateAsset}
          currencySymbol={currencySymbol}
        />
      </AccordionSection>

      <AccordionSection
        title="Partnership Firm"
        sectionKey="partnership"
        isOpen={isOpen("partnership")}
        onToggle={toggleSection}
      >
        <PartnershipSection
          assets={assets}
          updateAsset={updateAsset}
          currencySymbol={currencySymbol}
        />
      </AccordionSection>
    </section>
  );
}
