import { useState } from "react";
import { ThemeSelector } from "./ThemeSelector";
import { CURRENCY_OPTIONS } from "../models/zakatModel";
import { useApp } from "../contexts/AppContext";
import { formatMoney } from "../utils/currency";

export function Sidebar({ zakatDue }) {
  const { currency, setCurrency, activeModule, setActiveModule } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const switchModule = (module) => {
    setActiveModule(module);
    setIsMenuOpen(false);
  };

  return (
    <aside className="sidebar">
      {/* Mobile Header with Hamburger */}
      <div className="sidebar-mobile-header">
        <button
          className="hamburger-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className={`hamburger-line ${isMenuOpen ? "open" : ""}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? "open" : ""}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? "open" : ""}`}></span>
        </button>
        <div className="sidebar-logo">
          <span className="logo-icon">☪️</span>
          <span className="logo-text">Zakatify</span>
        </div>
      </div>

      {/* Desktop Logo */}
      <div className="sidebar-logo desktop-only">
        <span className="logo-icon">☪️</span>
        <span className="logo-text">Zakatify</span>
      </div>

      {/* Navigation Menu */}
      <nav className={`sidebar-nav ${isMenuOpen ? "open" : ""}`}>
        <div className="nav-section">
          <span className="nav-label">Modules</span>
          <ul className="nav-list">
            <li>
              <button
                className={`nav-item ${activeModule === "calculator" ? "active" : ""}`}
                onClick={() => switchModule("calculator")}
              >
                <span className="nav-icon">🧮</span>
                <span className="nav-text">Calculator</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${activeModule === "payments" ? "active" : ""}`}
                onClick={() => switchModule("payments")}
              >
                <span className="nav-icon">💰</span>
                <span className="nav-text">Payments</span>
                {zakatDue > 0 && activeModule !== "payments" && (
                  <span className="nav-badge">{formatMoney(zakatDue, currency, { maximumFractionDigits: 0 })}</span>
                )}
              </button>
            </li>
          </ul>
        </div>

        <div className="nav-section">
          <span className="nav-label">Settings</span>
          <div className="nav-settings">
            <div className="setting-item">
              <ThemeSelector />
            </div>
            <div className="setting-item">
              <label className="currency-select sidebar-currency" htmlFor="sidebar-currency">
                <span>Currency</span>
                <select
                  id="sidebar-currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  {CURRENCY_OPTIONS.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.code} - {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isMenuOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>
      )}
    </aside>
  );
}

export default Sidebar;
