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
import { ProjectHub } from "../pages/ProjectHub/ProjectHub";

export function Main() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/*" element={<AuthenticatedRoute />}>
        {/* Project Hub is the home/landing page */}
        <Route index element={<ProjectHub />} />
        <Route path="demos" element={<ProjectHub />} />

        {/* Demo routes from registry */}
        {demoRegistry.map((demo) => {
          const routePath = demo.path.startsWith('/') ? demo.path.slice(1) : demo.path;
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
