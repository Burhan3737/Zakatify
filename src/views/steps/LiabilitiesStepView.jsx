import { InputField } from "../../components/InputField";

export function LiabilitiesStepView({
  liabilities,
  updateLiability,
  currencySymbol,
}) {
  return (
    <section className="panel">
      <h2>Step 2: Enter Liabilities</h2>
      <p className="panel-subtitle">
        Include all debts and payables that can be deducted from your zakat calculation.
      </p>
      <div className="field-grid">
        <InputField
          id="short-term-debts"
          label="Short-Term Debts / Bills Due"
          tooltip="Credit cards, bills, and short-term loans due now."
          value={liabilities.shortTermDebts}
          onChange={(value) => updateLiability("shortTermDebts", value)}
          prefix={currencySymbol}
        />
        <InputField
          id="loans-friends"
          label="Loans from Friends / Relatives"
          value={liabilities.loansFriendsRelatives}
          onChange={(value) => updateLiability("loansFriendsRelatives", value)}
          prefix={currencySymbol}
        />
        <InputField
          id="loans-banks"
          label="Loans from Banks / Institutions"
          value={liabilities.loansBanksInstitutions}
          onChange={(value) => updateLiability("loansBanksInstitutions", value)}
          prefix={currencySymbol}
        />
        <InputField
          id="tax-payable"
          label="Income Tax / Wealth Tax Payable"
          value={liabilities.taxPayable}
          onChange={(value) => updateLiability("taxPayable", value)}
          prefix={currencySymbol}
        />
      </div>
    </section>
  );
}
