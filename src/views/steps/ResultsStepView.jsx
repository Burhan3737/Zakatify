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
        <h3>Breakdown</h3>
        <dl className="breakdown">
          <div>
            <dt>Cash (bank + on-hand)</dt>
            <dd>{formatMoney(result.breakdown.cashTotal, currency)}</dd>
          </div>
          <div>
            <dt>Gold</dt>
            <dd>{formatMoney(result.breakdown.goldTotal, currency)}</dd>
          </div>
          <div>
            <dt>Silver</dt>
            <dd>{formatMoney(result.breakdown.silverTotal, currency)}</dd>
          </div>
          <div>
            <dt>Investments / Crypto</dt>
            <dd>{formatMoney(result.breakdown.investmentsCrypto, currency)}</dd>
          </div>
          <div>
            <dt>Receivables</dt>
            <dd>{formatMoney(result.breakdown.receivables, currency)}</dd>
          </div>
          <div>
            <dt>Total Assets</dt>
            <dd>{formatMoney(result.breakdown.totalAssets, currency)}</dd>
          </div>
          <div>
            <dt>Total Liabilities</dt>
            <dd>{formatMoney(result.breakdown.totalLiabilities, currency)}</dd>
          </div>
        </dl>
      </article>

      <article className="price-note">
        <h4>Nisab Price Source</h4>
        <p>
          Gold:{" "}
          {formatMoney(prices.goldPerGram, currency, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
          })}{" "}
          / gram, Silver:{" "}
          {formatMoney(prices.silverPerGram, currency, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
          })}{" "}
          / gram
        </p>
        <p>
          Source: {prices.source}
          {isLoadingPrices ? " (loading latest...)" : ""}
          {prices.fallback ? " (fallback values in use)" : ""}
          {prices.conversionRateFallback ? " (currency conversion fallback)" : ""}
        </p>
      </article>
    </section>
  );
}
