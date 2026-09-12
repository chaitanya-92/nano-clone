import type { RouteObject } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";

function Overview() {
  return <div>Dashboard Overview</div>;
}

export const dashboardRoutes: RouteObject = {
  path: "/dashboard",
  element: <DashboardLayout />,
  children: [
    {
      index: true,
      element: <Overview />,
    },
  ],
};