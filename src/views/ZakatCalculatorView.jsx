import { useEffect } from "react";
import { getCurrencySymbol } from "../utils/currency";
import { useApp } from "../contexts/AppContext";
import { StepIndicator } from "../components/StepIndicator";
import { useZakatCalculatorViewModel } from "../viewmodels/useZakatCalculatorViewModel";
import { AssetsStepView } from "./steps/AssetsStepView";
import { LiabilitiesStepView } from "./steps/LiabilitiesStepView";
import { ResultsStepView } from "./steps/ResultsStepView";

export function ZakatCalculatorView() {
  const { currency: appCurrency, setCurrency: setAppCurrency, updateZakatDueFromCalculator } = useApp();
  const vm = useZakatCalculatorViewModel();
  const currencySymbol = getCurrencySymbol(vm.currency);

  // Sync local currency with global app currency
  useEffect(() => {
    if (vm.currency !== appCurrency) {
      vm.setCurrency(appCurrency);
    }
  }, [appCurrency, vm]);

  // Sync local currency changes back to global
  useEffect(() => {
    if (vm.currency !== appCurrency) {
      setAppCurrency(vm.currency);
    }
  }, [vm.currency, appCurrency, setAppCurrency]);

  // Auto-sync zakat due to payments module when results are available
  useEffect(() => {
    if (vm.step === 3 && vm.result?.totals?.zakatDue > 0) {
      updateZakatDueFromCalculator(vm.result.totals.zakatDue);
    }
  }, [vm.step, vm.result, updateZakatDueFromCalculator]);

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="hero-eyebrow">Fast • Guided • Stress-Free</p>
        <h1>Zakat Calculator</h1>
        <p>
          Take the guesswork out of your zakat. Follow a simple guided flow to
          calculate what you owe in minutes — clear, organized, and easy to use.
        </p>

        <span className="hero-disclaimer">
          Disclaimer: Please confirm your zakat obligations with a qualified
          scholar or trusted authority before making payment.
        </span>
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
    </div>
  );
}
