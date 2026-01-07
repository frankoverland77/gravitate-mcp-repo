import { UserControlPanel } from "../components/shared/Navigation/ControlPanel/UserControlPanel";
import { NavigationContextProvider } from "@gravitate-js/excalibrr";
import React, { useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";

import { createPageConfig } from "../pageConfig";
import { ProductFormulaProvider } from "../contexts/ProductFormulaContext";
import { FormulaTemplateProvider } from "../contexts/FormulaTemplateContext";
import { FeatureModeProvider } from "../contexts/FeatureModeContext";

export function AuthenticatedRoute() {
  const pageConfig = useMemo(createPageConfig, []);

  // IMPORTANT: This scopes object controls which navigation items appear in the menu.
  // It MUST match the section keys defined in pageConfig.tsx (createPageConfig function).
  // If you add a new section like "Bakery" or "Forms" in pageConfig, add it here too!
  const scopes = {
    Welcome: true,
    Bakery: true,
    Forms: true,
    Dashboards: true,
    ContractFormulas: true,
    OnlineSellingPlatform: true,
    MarketPlatform: true,
    CompetitorAnalysis: true,
    GlobalTieredPricing: true,
    ContractMeasurement: true,
    SubscriptionManagement: true,
    BakeryProducts: true,
    FormulaManager: true,
    DeliveryManagement: true,
    ScheduleDemo: true,
    CustomerList: true,
    InventoryGrid: true,
    BulkChangeTest: true,
    SubscriptionManagement: true,
  };
  return (
    <FeatureModeProvider>
      <ProductFormulaProvider>
        <FormulaTemplateProvider>
          <NavigationContextProvider
            getScopes={async () => scopes}
            handleLogout={() => {}}
            pageConfig={pageConfig}
            userControlPane={<UserControlPanel />}
            navStyle="vertical"
          >
            <Outlet />
          </NavigationContextProvider>
        </FormulaTemplateProvider>
      </ProductFormulaProvider>
    </FeatureModeProvider>
  );
}
