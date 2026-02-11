# Zakat Calculator - Phase 1 MVP

React + Vite (JavaScript) MVP for individual zakat calculation with a clean MVVM structure.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Architecture (MVVM)

- `src/models/zakatModel.js`
Model layer for domain data and pure zakat calculation.
- `src/viewmodels/useZakatCalculatorViewModel.js`
ViewModel layer for state, validation/sanitization, localStorage persistence, step flow, and API orchestration.
- `src/views/`
View layer for screens and step UI.
- `src/services/metalPriceService.js`
External integration for gold/silver prices with safe fallback behavior.
- `src/components/`
Reusable presentational components (`InputField`, `StepIndicator`).

## Phase 1 Feature Coverage

- Assets input:
  - Cash (bank + on-hand)
  - Gold (grams or value)
  - Silver (grams or value)
  - Investments / crypto
  - Receivables
- Liabilities input:
  - Short-term debts / bills due
- Calculation:
  - Net zakatable wealth = assets - liabilities
  - 2.5% zakat rate
  - Nisab status with selectable basis (gold/silver)
- Output:
  - Total zakatable wealth
  - Total zakat due
  - Detailed breakdown by asset type
  - Nisab status: Above / Below / Close

## Notes for Future Developers/Agents

- Extend the domain logic in `src/models/zakatModel.js` for business-rule changes.
- Keep API and persistence concerns inside ViewModel/Service layers.
- Add future Phase 2+ features as independent modules:
  - reminders scheduler
  - profile/user preferences
  - multi-year history tracking
  - payment links/integrations

