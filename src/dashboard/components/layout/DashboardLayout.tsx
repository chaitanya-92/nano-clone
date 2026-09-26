import "@/dashboard/dashboard.css";
import { Outlet } from "react-router-dom";
import { DashboardNavbar } from "./DashboardNavbar";
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardLayout() {
  return (
    <div className="dashboard-shell h-screen overflow-hidden bg-[#f6f8fb]">
      <DashboardNavbar />

      <div className="h-[calc(100vh-64px)]">
        <DashboardSidebar />

        <main className="dashboard-scroll-area h-full overflow-y-auto overscroll-contain lg:ml-20">
          <div className="px-5 py-6 sm:px-7 sm:py-8 lg:px-9">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
