# Zakatify (Zakat Calculator)

A simple web app to help individuals estimate zakat based on their assets and short-term liabilities.

## What this app does

- Calculates your **net zakatable wealth** (assets minus liabilities)
- Applies the **2.5% zakat rate**
- Shows whether you are **Above**, **Close**, or **Below** nisab
- Lets you choose nisab basis: **Silver** or **Gold**
- Uses latest metal prices when available, with safe fallback values if unavailable
- Saves your entries in your browser so you can continue later

## What you can enter

### Assets
- Cash in bank
- Cash on hand
- Gold (by grams or total value)
- Silver (by grams or total value)
- Investments / crypto
- Money owed to you (receivables)

### Liabilities
- Short-term debts and bills due now

## How to run the app

### Requirements
- Node.js 18+ (recommended)
- npm

### Steps
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the app:
   ```bash
   npm run dev
   ```
3. Open the local URL shown in your terminal (usually `http://localhost:5173`).

## How to use

1. **Step 1 - Assets:** Enter your zakatable assets.
2. **Step 2 - Liabilities:** Enter short-term debts/bills due.
3. **Step 3 - Results:** Review:
   - Total zakatable wealth
   - Total zakat due
   - Nisab status
   - Full breakdown by category

Use **Back/Next** buttons or the step indicator to navigate.

## Important notes

- Values are shown in **USD**.
- This is an estimate tool and not a religious ruling.
- For personal or scholarly guidance, consult a qualified local scholar.

## Build for production

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```