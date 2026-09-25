import { Outlet } from "react-router-dom";
import { DashboardNavbar } from "./DashboardNavbar";
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <DashboardSidebar />

      <div className="min-h-screen pl-[76px]">
        <DashboardNavbar />

        <main className="min-h-[calc(100vh-72px)] bg-[#f7f9fc]">
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
