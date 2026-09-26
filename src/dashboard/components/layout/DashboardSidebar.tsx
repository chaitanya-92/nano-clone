import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { dashboardNavigation } from "@/dashboard/constants/navigation";

const STORAGE_KEY = "naano-dashboard-sidebar-collapsed";

export function DashboardSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const location = useLocation();


  const activePath =
    dashboardNavigation
      .filter((item) =>
        item.href === "/dashboard"
          ? location.pathname === "/dashboard"
          : location.pathname.startsWith(item.href),
      )
      .sort((a, b) => b.href.length - a.href.length)[0]?.href ?? "";

  return (
    <aside
      className={[
        "fixed bottom-0 left-0 top-16 z-30 hidden bg-white lg:flex lg:flex-col",
        "border-r border-[#edf0f5] shadow-[4px_0_18px_rgba(24,35,57,0.025)]",
        "transition-[width] duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
        collapsed ? "w-[76px]" : "w-[224px]",
      ].join(" ")}
    >
      <div className="flex h-16 items-center justify-end px-3">
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-[#69758a] transition hover:bg-[#f5f7fa] hover:text-[#202938]"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-[19px] w-[19px]" strokeWidth={1.8} />
          ) : (
            <PanelLeftClose className="h-[19px] w-[19px]" strokeWidth={1.8} />
          )}
        </button>
      </div>

      <nav
        aria-label="Dashboard navigation"
        className="flex flex-1 flex-col gap-1.5 px-3 py-2"
      >
        {dashboardNavigation.map((item) => {
          const Icon = item.icon;
          const active = activePath === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              aria-current={active ? "page" : undefined}
              className={[
                "group relative flex h-11 cursor-pointer items-center overflow-hidden rounded-xl",
                "transition-[background-color,color,padding] duration-200",
                collapsed ? "justify-center px-0" : "gap-3 px-3",
                active
                  ? "bg-[#eef4ff] text-[#2864f0]"
                  : "text-[#67758b] hover:bg-[#f6f8fb] hover:text-[#202938]",
              ].join(" ")}
            >
              <Icon
                className="h-[19px] w-[19px] shrink-0 transition-transform duration-300 group-hover:scale-105"
                strokeWidth={1.8}
              />

              <span
                className={[
                  "whitespace-nowrap text-[13px] font-medium transition-all duration-200",
                  collapsed
                    ? "pointer-events-none w-0 translate-x-[-8px] opacity-0"
                    : "w-auto translate-x-0 opacity-100",
                ].join(" ")}
              >
                {item.label}
              </span>

              {collapsed && (
                <span className="pointer-events-none absolute left-[68px] z-50 rounded-lg bg-[#171d2b] px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
