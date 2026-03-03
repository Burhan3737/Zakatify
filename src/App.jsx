import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AppProvider, useApp } from "./contexts/AppContext";
import { Sidebar } from "./components/Sidebar";
import { ZakatCalculatorView } from "./views/ZakatCalculatorView";
import { ZakatPaymentsView } from "./views/ZakatPaymentsView";
import { AuthView } from "./views/AuthView";

function AuthLoading() {
  return (
    <div className="auth-loading">
      <span className="auth-loading-logo">☪️</span>
      <p>Loading...</p>
    </div>
  );
}

function AppContent() {
  const { session, loading } = useAuth();
  const { activeModule, sharedZakatDue, currency } = useApp();

  if (loading) {
    return <AuthLoading />;
  }

  if (!session) {
    return <AuthView />;
  }

  return (
    <div className="app-container">
      <Sidebar />
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
    <AuthProvider>
      <ThemeProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
