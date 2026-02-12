import { useTheme, THEMES } from "../contexts/ThemeContext";

export function ThemeSelector() {
  const { currentTheme, currentThemeId, setTheme, toggleDarkMode } = useTheme();

  const themeOptions = Object.values(THEMES).map((theme) => (
    <option key={theme.id} value={theme.id}>
      {theme.icon} {theme.name}
    </option>
  ));

  return (
    <div className="theme-selector">
      <label className="theme-selector__label" htmlFor="theme-select">
        <span className="theme-selector__icon">{currentTheme.icon}</span>
        <span className="theme-selector__name">Theme</span>
      </label>
      <div className="theme-selector__controls">
        <select
          id="theme-select"
          className="theme-selector__select"
          value={currentThemeId}
          onChange={(e) => setTheme(e.target.value)}
          aria-label="Select color theme"
        >
          {themeOptions}
        </select>
        <button
          type="button"
          className={`theme-selector__toggle ${currentTheme.isDark ? "is-dark" : ""}`}
          onClick={toggleDarkMode}
          aria-label={currentTheme.isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={currentTheme.isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {currentTheme.isDark ? "☀️" : "🌙"}
        </button>
      </div>
    </div>
  );
}
