import { ThemeProvider } from "./contexts/ThemeContext";
import { AppProvider, useApp } from "./contexts/AppContext";
import { Sidebar } from "./components/Sidebar";
import { ZakatCalculatorView } from "./views/ZakatCalculatorView";
import { ZakatPaymentsView } from "./views/ZakatPaymentsView";

function AppContent() {
  const { activeModule, sharedZakatDue, currency } = useApp();

  return (
    <div className="app-container">
      <Sidebar zakatDue={sharedZakatDue} />
      <main className="app-main">
        {activeModule === "calculator" ? (
          <ZakatCalculatorView />
        ) : (
          <ZakatPaymentsView zakatDue={sharedZakatDue} currency={currency} />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
