import { UserControlPanel } from "../components/shared/Navigation/ControlPanel/UserControlPanel";
import { NavigationContextProvider } from "@gravitate-js/excalibrr";
import React, { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";

import { createPageConfig } from "../pageConfig";
import { ProductFormulaProvider } from "../contexts/ProductFormulaContext";
import { FormulaTemplateProvider } from "../contexts/FormulaTemplateContext";
import { FeatureModeProvider } from "../contexts/FeatureModeContext";
import { getScopesFromHubState } from "../pages/ProjectHub/ProjectHub.utils";

// Static fallback scopes — used when no hub state exists yet
const DEFAULT_SCOPES = {
  ProjectHub: true,
  Welcome: true,
  DesignSystem: true,
  Bakery: true,
  Forms: true,
  Dashboards: true,
  ContractFormulas: true,
  OnlineSellingPlatform: true,
  MarketPlatform: true,
  SupplierAnalysis: true,
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
  Contracts: true,
  NegotiationMode: true,
  DeliveredPricing: true,
  PriceElasticity: true,
  QuotebookWholesale: true,
  QuotePricing: true,
  QuotebookQoL: true,
  PriceManagement: true,
};

export function AuthenticatedRoute() {
  const [scopeVersion, setScopeVersion] = useState(0);

  // Listen for hub state changes to refresh sidebar
  useEffect(() => {
    const handleUpdate = () => setScopeVersion((v) => v + 1);
    window.addEventListener("project-hub-updated", handleUpdate);
    return () => window.removeEventListener("project-hub-updated", handleUpdate);
  }, []);

  // Re-create pageConfig when scopeVersion changes to trigger NavigationContextProvider re-read
  const pageConfig = useMemo(() => createPageConfig(), [scopeVersion]);

  // Build dynamic scopes from hub state
  const scopes = useMemo(() => {
    const hubScopes = getScopesFromHubState();
    if (Object.keys(hubScopes).length > 0) {
      return { ...hubScopes, ProjectHub: true, Welcome: true };
    }
    return DEFAULT_SCOPES;
  }, [scopeVersion]);
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
