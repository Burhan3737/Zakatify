import { CURRENCY_OPTIONS } from "../models/zakatModel";
import { getCurrencySymbol } from "../utils/currency";
import { StepIndicator } from "../components/StepIndicator";
import { ThemeSelector } from "../components/ThemeSelector";
import { useZakatCalculatorViewModel } from "../viewmodels/useZakatCalculatorViewModel";
import { AssetsStepView } from "./steps/AssetsStepView";
import { LiabilitiesStepView } from "./steps/LiabilitiesStepView";
import { ResultsStepView } from "./steps/ResultsStepView";

export function ZakatCalculatorView() {
  const vm = useZakatCalculatorViewModel();
  const currencySymbol = getCurrencySymbol(vm.currency);

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="hero-eyebrow">Fast • Guided • Stress-Free</p>
        <h1>Zakatify</h1>
        <p>
          Take the guesswork out of your zakat. Follow a simple guided flow to
          calculate what you owe in minutes — clear, organized, and easy to use.
        </p>

        <span className="hero-disclaimer">
          Disclaimer: Please confirm your zakat obligations with a qualified
          scholar or trusted authority before making payment.
        </span>
        <div className="hero-toolbar">
          <ThemeSelector />
          <label className="currency-select" htmlFor="app-currency">
            <span>App Currency</span>
            <select
              id="app-currency"
              value={vm.currency}
              onChange={(event) => vm.setCurrency(event.target.value)}
            >
              {CURRENCY_OPTIONS.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.code} - {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <StepIndicator currentStep={vm.step} onStepSelect={vm.jumpToStep} />

      {vm.step === 1 ? (
        <AssetsStepView
          assets={vm.formData.assets}
          updateAsset={vm.updateAsset}
          currencySymbol={currencySymbol}
        />
      ) : null}
      {vm.step === 2 ? (
        <LiabilitiesStepView
          liabilities={vm.formData.liabilities}
          updateLiability={vm.updateLiability}
          currencySymbol={currencySymbol}
        />
      ) : null}
      {vm.step === 3 ? (
        <ResultsStepView
          result={vm.result}
          prices={vm.prices}
          isLoadingPrices={vm.isLoadingPrices}
          currency={vm.currency}
          nisabBasis={vm.formData.nisabBasis}
          setNisabBasis={vm.setNisabBasis}
        />
      ) : null}

      <footer className="footer-actions">
        <button
          type="button"
          className="btn ghost"
          onClick={vm.previousStep}
          disabled={vm.step === 1}
        >
          Back
        </button>
        <button
          type="button"
          className="btn primary"
          onClick={vm.nextStep}
          disabled={vm.step === 3}
        >
          Next
        </button>
      </footer>
    </main>
  );
}
