import { Link, useLocation } from "react-router-dom";

import { dashboardNavigation } from "@/dashboard/constants/navigation";
import { Logo } from "@/components/layout/Logo";

export function DashboardSidebar({ collapsed }: { collapsed: boolean }) {
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
        "fixed inset-y-0 left-0 z-50 hidden bg-white lg:flex lg:flex-col",
        "border-r border-[#edf0f5] shadow-[4px_0_18px_rgba(24,35,57,0.025)]",
        "transition-[width] duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
        collapsed ? "w-[76px]" : "w-[224px]",
      ].join(" ")}
    >
      <div className="flex h-16 shrink-0 items-center px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div
            className={[
              "flex h-10 items-center overflow-hidden transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
              collapsed ? "w-[42px] justify-center" : "w-[170px]",
            ].join(" ")}
          >
            <Logo
              compact={collapsed}
              href="/dashboard"
              className={
                collapsed
                  ? "[&>span:first-child]:scale-[0.82]"
                  : "[&>span:first-child]:scale-[0.9] [&>span:last-child]:text-[1.45rem]"
              }
            />
          </div>
        </div>
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
                "group relative flex h-11 cursor-pointer items-center rounded-xl",
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
                <span className="pointer-events-none absolute left-[64px] z-[100] whitespace-nowrap rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-xs font-medium text-[#202938] opacity-0 shadow-[0_8px_24px_rgba(20,30,50,0.14)] translate-x-[-4px] transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100">
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
