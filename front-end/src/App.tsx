import { Provider } from "react-redux";
import { store } from "./store";
import AppRouter from "./routes";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/toast-provider";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ToastProvider />
        <AppRouter />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
