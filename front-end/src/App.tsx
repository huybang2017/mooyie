import { Provider } from "react-redux";
import { store } from "./store";
import AppRouter from "./routes";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/toast-provider";

function App() {
  return (
    <Provider store={store}>
      <ToastProvider />
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AppRouter />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
