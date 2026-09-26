import { useEffect, useState } from "react";
import "@/dashboard/dashboard.css";
import { Outlet } from "react-router-dom";
import { DashboardNavbar } from "./DashboardNavbar";
import { DashboardSidebar } from "./DashboardSidebar";

const STORAGE_KEY = "naano-dashboard-sidebar-collapsed";

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "true");
    } catch {
      // Ignore unavailable localStorage.
    }
  }, []);

  const toggleSidebar = () => {
    setCollapsed((value) => {
      const next = !value;
      try {
        window.localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // Ignore unavailable localStorage.
      }
      return next;
    });
  };

  return (
    <div className="dashboard-shell h-screen overflow-hidden bg-[#f4f5f0]">
      <DashboardSidebar collapsed={collapsed} />

      <div
        className={[
          "h-full transition-[margin] duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
          collapsed ? "lg:ml-[76px]" : "lg:ml-[224px]",
        ].join(" ")}
      >
        <DashboardNavbar
          collapsed={collapsed}
          onToggleSidebar={toggleSidebar}
        />

        <main className="dashboard-panel dashboard-scroll-area mx-0 mb-3 h-[calc(100vh-76px)] overflow-y-auto overscroll-contain rounded-[24px] border border-[#e3e5df] bg-white shadow-[0_2px_10px_rgba(30,35,25,0.025)] lg:mr-3">
          <div className="px-5 py-6 sm:px-7 sm:py-8 lg:px-9">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
