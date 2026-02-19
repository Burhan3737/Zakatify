import { formatMoney } from "../../utils/currency";

function statusClass(status) {
  if (status === "Above") return "status-above";
  if (status === "Close") return "status-close";
  return "status-below";
}

export function ResultsStepView({
  result,
  prices,
  isLoadingPrices,
  currency,
  nisabBasis,
  setNisabBasis,
}) {
  return (
    <section className="panel">
      <h2>Step 3: Zakat Result</h2>
      <p className="panel-subtitle">
        Review net zakatable wealth, nisab status, and final zakat due.
      </p>

      <div className="nisab-basis">
        <span>Use nisab basis:</span>
        <label>
          <input
            type="radio"
            name="nisab-basis"
            checked={nisabBasis === "silver"}
            onChange={() => setNisabBasis("silver")}
          />
          Silver
        </label>
        <label>
          <input
            type="radio"
            name="nisab-basis"
            checked={nisabBasis === "gold"}
            onChange={() => setNisabBasis("gold")}
          />
          Gold
        </label>
      </div>

      <div className="summary-grid">
        <article className="summary-card">
          <p>Total Zakatable Wealth</p>
          <h3>{formatMoney(result.totals.netZakatableWealth, currency)}</h3>
        </article>
        <article className="summary-card highlight">
          <p>Total Zakat Due (2.5%)</p>
          <h3>{formatMoney(result.totals.zakatDue, currency)}</h3>
        </article>
      </div>

      <article className="status-card">
        <p>Nisab Status</p>
        <h3 className={statusClass(result.nisab.status)}>{result.nisab.status}</h3>
        <small>
          Selected threshold: {formatMoney(result.nisab.selectedThreshold, currency)}
        </small>
      </article>

      <article className="breakdown-card">
        <h3>Assets Breakdown</h3>
        <dl className="breakdown">
          <div>
            <dt>Cash & Bank (Savings + Current + Fixed)</dt>
            <dd>{formatMoney(result.breakdown.cashTotal, currency)}</dd>
          </div>
          <div>
            <dt>Gold (24K + 22K + 18K + Other)</dt>
            <dd>{formatMoney(result.breakdown.goldTotal, currency)}</dd>
          </div>
          <div>
            <dt>Silver (Utensils + Artifacts + Jewelry)</dt>
            <dd>{formatMoney(result.breakdown.silverTotal, currency)}</dd>
          </div>
          <div>
            <dt>Precious Stones</dt>
            <dd>{formatMoney(result.breakdown.preciousStones, currency)}</dd>
          </div>
          <div>
            <dt>Investments, Loans & Funds</dt>
            <dd>{formatMoney(result.breakdown.investmentsTotal, currency)}</dd>
          </div>
          <div>
            <dt>Landed Property</dt>
            <dd>{formatMoney(result.breakdown.landedProperty, currency)}</dd>
          </div>
          <div>
            <dt>Business Assets</dt>
            <dd>{formatMoney(result.breakdown.businessTotal, currency)}</dd>
          </div>
          <div>
            <dt>Partnership Firms</dt>
            <dd>{formatMoney(result.breakdown.partnershipTotal, currency)}</dd>
          </div>
          <div className="total-row">
            <dt>Total Assets</dt>
            <dd>{formatMoney(result.breakdown.totalAssets, currency)}</dd>
          </div>
        </dl>
      </article>

      <article className="breakdown-card">
        <h3>Liabilities Breakdown</h3>
        <dl className="breakdown">
          <div>
            <dt>Short-Term Debts</dt>
            <dd>{formatMoney(result.breakdown.shortTermDebts, currency)}</dd>
          </div>
          <div>
            <dt>Loans from Friends/Relatives</dt>
            <dd>{formatMoney(result.breakdown.loansFriendsRelatives, currency)}</dd>
          </div>
          <div>
            <dt>Loans from Banks/Institutions</dt>
            <dd>{formatMoney(result.breakdown.loansBanksInstitutions, currency)}</dd>
          </div>
          <div>
            <dt>Tax Payable</dt>
            <dd>{formatMoney(result.breakdown.taxPayable, currency)}</dd>
          </div>
          <div className="total-row">
            <dt>Total Liabilities</dt>
            <dd>{formatMoney(result.breakdown.totalLiabilities, currency)}</dd>
          </div>
        </dl>
      </article>

      <article className="price-note">
        <h4>Nisab Price Source</h4>
        <div className="price-grid">
          <div className="price-row">
            <span className="metal-label">Gold:</span>
            <span className="price-units">
              {formatMoney(prices.goldPerGram, currency, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} / gram{" | "}
              {formatMoney(prices.goldPerOunce, currency, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} / oz{" | "}
              {formatMoney(prices.goldPerTola, currency, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} / tola
            </span>
          </div>
          <div className="price-row">
            <span className="metal-label">Silver:</span>
            <span className="price-units">
              {formatMoney(prices.silverPerGram, currency, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} / gram{" | "}
              {formatMoney(prices.silverPerOunce, currency, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} / oz{" | "}
              {formatMoney(prices.silverPerTola, currency, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} / tola
            </span>
          </div>
        </div>
        <p className="price-source">
          Source: {prices.source}
          {isLoadingPrices ? " (loading latest...)" : ""}
          {prices.fallback ? " (fallback values in use)" : ""}
          {prices.conversionRateFallback ? " (currency conversion fallback)" : ""}
        </p>
      </article>
    </section>
  );
}
