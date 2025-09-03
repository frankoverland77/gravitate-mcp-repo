import { UserControlPanel } from "../components/shared/Navigation/ControlPanel/UserControlPanel";
import { NavigationContextProvider } from "@gravitate-js/excalibrr";
import React, { useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";

import { createPageConfig } from "../pageConfig";

export function AuthenticatedRoute() {
  const pageConfig = useMemo(createPageConfig, []);

  return (
    <NavigationContextProvider
      getScopes={async () => ({
        Welcome: true,
        ProductGrid: true,
        ProductForm: true,
      })}
      handleLogout={() => {}}
      pageConfig={pageConfig}
      userControlPane={<UserControlPanel />}
      navStyle="vertical"
    >
      <Outlet />
    </NavigationContextProvider>
  );
}
