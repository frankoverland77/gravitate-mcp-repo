import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { AuthenticatedRoute } from "./AuthenticatedRoute";
import { demoRegistry } from "../pageConfig";
import { WelcomePage } from "../pages/WelcomePages/WelcomePage";

export function Main() {
  // Debug: log the routes being created
  console.log('demoRegistry total count:', demoRegistry.length);
  console.log('demoRegistry routes:', demoRegistry.map(d => ({ key: d.key, path: d.path })));

  // Check if Contracts routes exist
  const contractsRoutes = demoRegistry.filter(d => d.path?.includes('Contracts'));
  console.log('Contracts routes found:', contractsRoutes.length, contractsRoutes.map(d => d.path));

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/*" element={<AuthenticatedRoute />}>
        {/* Welcome/Home route */}
        <Route index element={<WelcomePage />} />
        <Route path="demos" element={<WelcomePage />} />

        {/* Demo routes from registry */}
        {demoRegistry.map((demo) => {
          const routePath = demo.path.startsWith('/') ? demo.path.slice(1) : demo.path;
          console.log(`Creating route: ${demo.key} -> ${routePath}`);
          return (
            <Route
              key={demo.key}
              path={routePath}
              element={demo.element}
            />
          );
        })}

        {/* Catch-all fallback */}
        <Route path="*" element={<WelcomePage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}
