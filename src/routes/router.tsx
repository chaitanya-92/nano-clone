import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { dashboardRoutes } from "@/dashboard/dashboardRoutes";
import NotFound from "@/pages/NotFound";

function RootLayout() {
  useScrollRestoration();

  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  dashboardRoutes,
]);
