import { UserControlPanel } from "../components/shared/Navigation/ControlPanel/UserControlPanel";
import { NavigationContextProvider } from "@gravitate-js/excalibrr";
import React, { useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";

import { createPageConfig } from "../pageConfig";
import { ProductFormulaProvider } from "../contexts/ProductFormulaContext";

export function AuthenticatedRoute() {
  const pageConfig = useMemo(createPageConfig, []);
  const scopes = {
    Welcome: true,
    Grids: true,
    Forms: true,
    Dashboards: true,
    ProductGrid: true,
    BakeryDemo: true,
    FormulaManager: true,
    TabbedView: true,
  };
  return (
    <ProductFormulaProvider>
      <NavigationContextProvider
        getScopes={async () => scopes}
        handleLogout={() => {}}
        pageConfig={pageConfig}
        userControlPane={<UserControlPanel />}
        navStyle="vertical"
      >
        <Outlet />
      </NavigationContextProvider>
    </ProductFormulaProvider>
  );
}
