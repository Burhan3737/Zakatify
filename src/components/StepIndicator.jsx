const STEPS = [
  { id: 1, label: "Assets" },
  { id: 2, label: "Liabilities" },
  { id: 3, label: "Results" },
];

export function StepIndicator({ currentStep, onStepSelect }) {
  return (
    <div className="steps" aria-label="Progress">
      {STEPS.map((step) => (
        <button
          key={step.id}
          type="button"
          className={`step-chip ${currentStep === step.id ? "active" : ""} ${currentStep > step.id ? "completed" : ""}`}
          onClick={() => onStepSelect(step.id)}
          data-step={step.id}
          aria-current={currentStep === step.id ? "step" : undefined}
        >
          {step.label}
        </button>
      ))}
    </div>
  );
}
