import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "./App";
import { LicenseManager } from "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

LicenseManager.setLicenseKey(
  "Using_this_AG_Grid_Enterprise_key_( AG-050987 )_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_( legal@ag-grid.com )___For_help_with_changing_this_key_please_contact_( info@ag-grid.com )___( capSpire )_is_granted_a_( Multiple Applications )_Developer_License_for_( 3 )_Front-End_JavaScript_developers___All_Front-End_JavaScript_developers_need_to_be_licensed_in_addition_to_the_ones_working_with_AG_Grid_Enterprise___This_key_has_been_granted_a_Deployment_License_Add-on_for_( 8 )_Production_Environments___This_key_works_with_AG_Grid_Enterprise_versions_released_before_( 17_December_2024 )____[v2]_MTczNDM5MzYwMDAwMA==97e04a13d661cd40e68a78abfaa164d0"
);
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
