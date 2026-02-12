import { InputField } from "../../components/InputField";

export function AssetsStepView({ assets, updateAsset, currencySymbol }) {
  return (
    <section className="panel">
      <h2>Step 1: Enter Zakatable Assets</h2>
      <p className="panel-subtitle">
        Add values you currently own and can access for this zakat period.
      </p>

      <div className="field-grid">
        <InputField
          id="cash-bank"
          label="Cash in Bank"
          tooltip="Money in checking/savings accounts and digital wallets."
          value={assets.cashBank}
          onChange={(value) => updateAsset("cashBank", value)}
          prefix={currencySymbol}
        />
        <InputField
          id="cash-on-hand"
          label="Cash on Hand"
          tooltip="Physical cash that you currently hold."
          value={assets.cashOnHand}
          onChange={(value) => updateAsset("cashOnHand", value)}
          prefix={currencySymbol}
        />
      </div>

      <div className="sub-panel">
        <h3>Gold</h3>
        <p>
          Enter gold as weight (grams, ounces, or tola) or value. This includes jewelry, bars, and
          coins.
        </p>
        <div className="toggle-group">
          <button
            type="button"
            className={assets.goldMode === "grams" ? "toggle active" : "toggle"}
            onClick={() => updateAsset("goldMode", "grams")}
          >
            Grams
          </button>
          <button
            type="button"
            className={assets.goldMode === "ounce" ? "toggle active" : "toggle"}
            onClick={() => updateAsset("goldMode", "ounce")}
          >
            Ounce
          </button>
          <button
            type="button"
            className={assets.goldMode === "tola" ? "toggle active" : "toggle"}
            onClick={() => updateAsset("goldMode", "tola")}
          >
            Tola
          </button>
          <button
            type="button"
            className={assets.goldMode === "value" ? "toggle active" : "toggle"}
            onClick={() => updateAsset("goldMode", "value")}
          >
            Value
          </button>
        </div>
        {assets.goldMode === "grams" ? (
          <InputField
            id="gold-grams"
            label="Gold Weight"
            tooltip="Total pure gold weight in grams."
            value={assets.goldGrams}
            onChange={(value) => updateAsset("goldGrams", value)}
            placeholder="0"
            prefix="g"
          />
        ) : assets.goldMode === "ounce" ? (
          <InputField
            id="gold-ounce"
            label="Gold Weight"
            tooltip="Total pure gold weight in troy ounces."
            value={assets.goldOunce}
            onChange={(value) => updateAsset("goldOunce", value)}
            placeholder="0"
            prefix="oz"
          />
        ) : assets.goldMode === "tola" ? (
          <InputField
            id="gold-tola"
            label="Gold Weight"
            tooltip="Total pure gold weight in tola (1 tola ≈ 11.66 grams)."
            value={assets.goldTola}
            onChange={(value) => updateAsset("goldTola", value)}
            placeholder="0"
            prefix="tola"
          />
        ) : (
          <InputField
            id="gold-value"
            label="Gold Value"
            tooltip="Current market value of your gold holdings."
            value={assets.goldValue}
            onChange={(value) => updateAsset("goldValue", value)}
            prefix={currencySymbol}
          />
        )}
      </div>

      <div className="sub-panel">
        <h3>Silver</h3>
        <p>Enter silver as weight (grams, ounces, or tola) or value. Includes jewelry and coins.</p>
        <div className="toggle-group">
          <button
            type="button"
            className={assets.silverMode === "grams" ? "toggle active" : "toggle"}
            onClick={() => updateAsset("silverMode", "grams")}
          >
            Grams
          </button>
          <button
            type="button"
            className={assets.silverMode === "ounce" ? "toggle active" : "toggle"}
            onClick={() => updateAsset("silverMode", "ounce")}
          >
            Ounce
          </button>
          <button
            type="button"
            className={assets.silverMode === "tola" ? "toggle active" : "toggle"}
            onClick={() => updateAsset("silverMode", "tola")}
          >
            Tola
          </button>
          <button
            type="button"
            className={assets.silverMode === "value" ? "toggle active" : "toggle"}
            onClick={() => updateAsset("silverMode", "value")}
          >
            Value
          </button>
        </div>
        {assets.silverMode === "grams" ? (
          <InputField
            id="silver-grams"
            label="Silver Weight"
            tooltip="Total pure silver weight in grams."
            value={assets.silverGrams}
            onChange={(value) => updateAsset("silverGrams", value)}
            placeholder="0"
            prefix="g"
          />
        ) : assets.silverMode === "ounce" ? (
          <InputField
            id="silver-ounce"
            label="Silver Weight"
            tooltip="Total pure silver weight in troy ounces."
            value={assets.silverOunce}
            onChange={(value) => updateAsset("silverOunce", value)}
            placeholder="0"
            prefix="oz"
          />
        ) : assets.silverMode === "tola" ? (
          <InputField
            id="silver-tola"
            label="Silver Weight"
            tooltip="Total pure silver weight in tola (1 tola ≈ 11.66 grams)."
            value={assets.silverTola}
            onChange={(value) => updateAsset("silverTola", value)}
            placeholder="0"
            prefix="tola"
          />
        ) : (
          <InputField
            id="silver-value"
            label="Silver Value"
            tooltip="Current market value of your silver holdings."
            value={assets.silverValue}
            onChange={(value) => updateAsset("silverValue", value)}
            prefix={currencySymbol}
          />
        )}
      </div>

      <div className="field-grid">
        <InputField
          id="investments-crypto"
          label="Investments / Crypto"
          tooltip="Zakatable investment value including stocks and crypto."
          value={assets.investmentsCrypto}
          onChange={(value) => updateAsset("investmentsCrypto", value)}
          prefix={currencySymbol}
        />
        <InputField
          id="receivables"
          label="Money Owed to You"
          tooltip="Receivables you reasonably expect to collect."
          value={assets.receivables}
          onChange={(value) => updateAsset("receivables", value)}
          prefix={currencySymbol}
        />
      </div>
    </section>
  );
}
