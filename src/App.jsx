import { ThemeProvider } from "./contexts/ThemeContext";
import { ZakatCalculatorView } from "./views/ZakatCalculatorView";

function App() {
  return (
    <ThemeProvider>
      <ZakatCalculatorView />
    </ThemeProvider>
  );
}

export default App;
