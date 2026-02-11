import { StepIndicator } from "../components/StepIndicator";
import { useZakatCalculatorViewModel } from "../viewmodels/useZakatCalculatorViewModel";
import { AssetsStepView } from "./steps/AssetsStepView";
import { LiabilitiesStepView } from "./steps/LiabilitiesStepView";
import { ResultsStepView } from "./steps/ResultsStepView";

export function ZakatCalculatorView() {
  const vm = useZakatCalculatorViewModel();

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="hero-eyebrow">Phase 1 MVP</p>
        <h1>Zakat Calculator for Individuals</h1>
        <p>
          A guided zakat workflow with modular MVVM architecture for future
          upgrades.
        </p>
      </header>

      <StepIndicator currentStep={vm.step} onStepSelect={vm.jumpToStep} />

      {vm.step === 1 ? (
        <AssetsStepView assets={vm.formData.assets} updateAsset={vm.updateAsset} />
      ) : null}
      {vm.step === 2 ? (
        <LiabilitiesStepView
          liabilities={vm.formData.liabilities}
          updateLiability={vm.updateLiability}
        />
      ) : null}
      {vm.step === 3 ? (
        <ResultsStepView
          result={vm.result}
          prices={vm.prices}
          isLoadingPrices={vm.isLoadingPrices}
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
