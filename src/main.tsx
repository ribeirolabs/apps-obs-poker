import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { TablesWidget } from "./TablesWidget.tsx";
import { ActiveTableWidget } from "./ActiveTableWidget.tsx";
import { OverlayWidget } from "./OverlayWidget.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/overlay-widget/:position",
    Component: OverlayWidget,
  },
  {
    path: "/tables-widget",
    Component: TablesWidget,
  },
  {
    path: "/active-table-widget/:position",
    Component: ActiveTableWidget,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
