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
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/*" element={<AuthenticatedRoute />}>
        {/* Welcome/Home route */}
        <Route index element={<WelcomePage />} />
        <Route path="demos" element={<WelcomePage />} />

        {/* Demo routes from registry */}
        {demoRegistry.map((demo) => (
          <Route
            key={demo.key}
            path={demo.path.startsWith('/') ? demo.path.slice(1) : demo.path}
            element={demo.element}
          />
        ))}

        {/* Catch-all fallback */}
        <Route path="*" element={<WelcomePage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}
