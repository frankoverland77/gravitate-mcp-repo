import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "./App";
import { LicenseManager } from "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
// Required for Excalibrr RangePicker — react-date-range ships its JS via
// Excalibrr's bundle but not its CSS. Matches the production frontend pattern
// at Gravitate.Dotnet.Next/frontend/src/modules/_Main/index.jsx:1-2.
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./tokens.css";

const agGridLicenseKey = import.meta.env.VITE_AG_GRID_LICENSE_KEY;
if (agGridLicenseKey) {
  LicenseManager.setLicenseKey(agGridLicenseKey);
} else {
  console.warn("AG Grid license key not found. Some enterprise features may not work.");
}
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
