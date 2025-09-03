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

export function Main() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="*">
        <Route path="*" element={<AuthenticatedRoute />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}
