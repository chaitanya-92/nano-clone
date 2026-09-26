import { Link, useLocation } from "react-router-dom";
import { dashboardNavigation } from "@/dashboard/constants/navigation";

export function DashboardSidebar() {
  const location = useLocation();

  const activePath =
    dashboardNavigation
      .filter((item) => {
        if (item.href === "/dashboard") {
          return location.pathname === "/dashboard";
        }

        return location.pathname.startsWith(
          item.href,
        );
      })
      .sort(
        (first, second) =>
          second.href.length -
          first.href.length,
      )[0]?.href ?? "";

  return (
    <aside className="fixed bottom-0 left-0 top-16 z-30 hidden w-20 bg-white lg:flex lg:flex-col">
      <nav
        aria-label="Dashboard navigation"
        className="flex flex-1 flex-col items-center gap-2 px-3 py-5"
      >
        {dashboardNavigation.map((item) => {
          const Icon = item.icon;
          const active =
            activePath === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              aria-current={
                active ? "page" : undefined
              }
              aria-label={item.label}
              title={item.label}
              className={[
                "group flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl transition-all duration-200",
                active
                  ? "bg-[#eef4ff] text-[#2864f0] shadow-[0_8px_24px_rgba(40,100,240,0.10)]"
                  : "text-[#67758b] hover:bg-[#f6f8fb] hover:text-[#202938]",
              ].join(" ")}
            >
              <Icon
                className="h-[19px] w-[19px]"
                strokeWidth={1.8}
              />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
