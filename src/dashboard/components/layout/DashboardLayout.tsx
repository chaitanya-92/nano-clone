import { useEffect, useRef, useState } from "react";
import "@/dashboard/dashboard.css";
import { Outlet, useLocation } from "react-router-dom";
import { DashboardNavbar } from "./DashboardNavbar";
import { DashboardSidebar } from "./DashboardSidebar";

const STORAGE_KEY = "naano-dashboard-sidebar-collapsed";

function readSidebarPreference() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function persistSidebarPreference(collapsed: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(collapsed));
  } catch {
    // Storage can be unavailable in privacy-restricted environments.
  }
}

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(readSidebarPreference);
  const location = useLocation();
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    mainRef.current?.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [location.pathname, location.search]);

  const toggleSidebar = () => {
    setCollapsed((current) => {
      const next = !current;
      persistSidebarPreference(next);
      return next;
    });
  };

  const contentMargin = collapsed ? "lg:ml-[76px]" : "lg:ml-[224px]";

  return (
    <div className="dashboard-shell h-screen overflow-hidden bg-[#f6f8fb]">
      <DashboardSidebar collapsed={collapsed} />

      <div
        className={[
          "h-full transition-[margin] duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
          contentMargin,
        ].join(" ")}
      >
        <DashboardNavbar
          collapsed={collapsed}
          onToggleSidebar={toggleSidebar}
        />

        <main
          ref={mainRef}
          className="dashboard-panel dashboard-scroll-area mx-3 mb-3 h-[calc(100vh-76px)] overflow-y-auto overflow-x-hidden overscroll-contain bg-[#f6f8fb] lg:mx-4"
        >
          <div className="min-h-full px-5 py-5 sm:px-7 sm:py-6 lg:px-9">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
