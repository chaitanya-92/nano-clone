import type { RouteObject } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Overview from "./pages/Overview";
import MyCard from "./pages/MyCard";
import Opportunities from "./pages/Opportunities";
import Collaborations from "./pages/Collaborations";
import Analytics from "./pages/Analytics";
import Earnings from "./pages/Earnings";
import Community from "./pages/Community";
import AffiliateProgram from "./pages/AffiliateProgram";
import Messages from "./pages/Messages";
import { RequireAuth } from "@/components/auth/RequireAuth";

export const dashboardRoutes: RouteObject = {
  path: "/dashboard",
  element: (
    <RequireAuth>
      <DashboardLayout />
    </RequireAuth>
  ),
  children: [
    {
      index: true,
      element: <Overview />,
    },
    {
      path: "my-card",
      element: <MyCard />,
    },
    {
      path: "opportunities",
      element: <Opportunities />,
    },
    {
      path: "collaborations",
      element: <Collaborations />,
    },
    {
      path: "analytics",
      element: <Analytics />,
    },
    {
      path: "earnings",
      element: <Earnings />,
    },
    {
      path: "community",
      element: <Community />,
    },
    {
      path: "affiliate",
      element: <AffiliateProgram />,
    },
    {
      path: "messages",
      element: <Messages />,
    },
  ],
};
