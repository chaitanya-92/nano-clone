import {
  BriefcaseBusiness,
  ChartNoAxesCombined,
  CircleDollarSign,
  Handshake,
  LayoutDashboard,
  MessageCircle,
  Percent,
  Users,
  WalletCards,
} from "lucide-react";
import {
  Link,
  useLocation,
} from "react-router-dom";

const navigation = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My card",
    href: "/dashboard/my-card",
    icon: WalletCards,
  },
  {
    label: "Opportunities",
    href: "/dashboard/opportunities",
    icon: BriefcaseBusiness,
  },
  {
    label: "Collaborations",
    href: "/dashboard/collaborations",
    icon: Handshake,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    label: "Community",
    href: "/dashboard/community",
    icon: Users,
  },
  {
    label: "Earnings",
    href: "/dashboard/earnings",
    icon: CircleDollarSign,
  },
  {
    label: "Affiliate program",
    href: "/dashboard/affiliate",
    icon: Percent,
  },
  {
    label: "Messages",
    href: "/dashboard/messages",
    icon: MessageCircle,
  },
];

export function DashboardSidebar() {
  const location = useLocation();

  const activePath =
    navigation
      .filter((item) => {
        if (
          item.href === "/dashboard"
        ) {
          return (
            location.pathname ===
            "/dashboard"
          );
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
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[232px] flex-col overflow-hidden border-r border-[#e7ebf0] bg-white">
      <div className="flex h-[72px] items-center border-b border-[#e7ebf0] px-4">
        <Link
          to="/dashboard"
          aria-label="Naano dashboard"
          className="flex h-10 min-w-0 flex-1 cursor-pointer items-center rounded-xl px-2"
        >
          <span className="text-[22px] font-bold tracking-[-1.4px] text-[#111318]">
            naano.
          </span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-3 py-6">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active =
            activePath === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              aria-current={
                active
                  ? "page"
                  : undefined
              }
              className="group relative flex h-11 cursor-pointer items-center rounded-xl px-3 text-[#617089]"
            >
              {active && (
                <span className="absolute inset-0 rounded-xl bg-[#eef4ff]" />
              )}

              {!active && (
                <span className="absolute inset-0 rounded-xl bg-[#f8fafc] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              )}

              <span className="relative z-10 flex shrink-0 items-center justify-center">
                <Icon
                  className="h-5 w-5"
                  strokeWidth={1.8}
                />
              </span>

              <span
                className={
                  active
                    ? "relative z-10 ml-3 truncate text-[13px] font-semibold text-[#2864f0]"
                    : "relative z-10 ml-3 truncate text-[13px] font-medium text-[#516078]"
                }
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
