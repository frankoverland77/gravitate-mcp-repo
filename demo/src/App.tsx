import "./styles.css";

import { ThemeContextProvider } from "@gravitate-js/excalibrr";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

import { Main } from "./_Main";
import { themeConfigs } from "./components/shared/Theming/themeconfigs";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeWrapper themeConfigs={themeConfigs} />
    </QueryClientProvider>
  );
}

function ThemeWrapper({ themeConfigs }) {
  useEffect(() => {
    if (!localStorage.getItem("TYPE_OF_THEME")) {
      localStorage.setItem("TYPE_OF_THEME", "LIGHT_MODE");
    }
  }, []);

  if (!themeConfigs || Object.entries(themeConfigs)?.length <= 0) return null;

  return (
    <ThemeContextProvider themeConfigs={themeConfigs}>
      <Main />
    </ThemeContextProvider>
  );
}
