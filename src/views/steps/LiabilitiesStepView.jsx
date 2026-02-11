import { InputField } from "../../components/InputField";

export function LiabilitiesStepView({ liabilities, updateLiability }) {
  return (
    <section className="panel">
      <h2>Step 2: Enter Liabilities</h2>
      <p className="panel-subtitle">
        Include only short-term debts and bills currently due.
      </p>
      <div className="field-grid">
        <InputField
          id="short-term-debts"
          label="Short-Term Debts / Bills Due"
          tooltip="Payables due now, such as bills, credit cards, and short-term loans."
          value={liabilities.shortTermDebts}
          onChange={(value) => updateLiability("shortTermDebts", value)}
        />
      </div>
    </section>
  );
}
