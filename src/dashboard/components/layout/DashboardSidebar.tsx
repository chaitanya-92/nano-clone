import {
  BriefcaseBusiness,
  ChartNoAxesCombined,
  CircleDollarSign,
  Handshake,
  LayoutDashboard,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Percent,
  Users,
  WalletCards,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
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

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function DashboardSidebar({
  collapsed,
  onToggle,
}: DashboardSidebarProps) {
  const location = useLocation();

  const activePath =
    location.pathname === "/dashboard"
      ? "/dashboard"
      : navigation.find((item) =>
          location.pathname.startsWith(
            item.href,
          ),
        )?.href ?? "/dashboard";

  return (
    <motion.aside
      animate={{
        width: collapsed
          ? 76
          : 232,
      }}
      transition={{
        duration: 0.32,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="fixed inset-y-0 left-0 z-40 flex flex-col overflow-hidden border-r border-[#e7ebf0] bg-white"
    >
      <div className="flex h-[72px] items-center border-b border-[#e7ebf0] px-4">
        <Link
          to="/dashboard"
          aria-label="Naano dashboard"
          className={
            collapsed
              ? "mx-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl"
              : "flex h-10 min-w-0 flex-1 cursor-pointer items-center rounded-xl px-2"
          }
        >
          <AnimatePresence mode="wait">
            {collapsed ? (
              <motion.span
                key="collapsed"
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                }}
                transition={{
                  duration: 0.16,
                }}
                className="text-[26px] font-bold tracking-[-1.8px] text-[#111318]"
              >
                n
              </motion.span>
            ) : (
              <motion.span
                key="expanded"
                initial={{
                  opacity: 0,
                  x: -8,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -8,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="text-[22px] font-bold tracking-[-1.4px] text-[#111318]"
              >
                naano.
              </motion.span>
            )}
          </AnimatePresence>
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
              aria-label={item.label}
              className={
                collapsed
                  ? "group relative flex h-11 cursor-pointer items-center justify-center rounded-xl text-[#617089]"
                  : "group relative flex h-11 cursor-pointer items-center rounded-xl px-3 text-[#617089]"
              }
            >
              {active && (
                <motion.span
                  layoutId="dashboard-active-nav"
                  transition={{
                    type: "spring",
                    stiffness: 460,
                    damping: 34,
                    mass: 0.75,
                  }}
                  className="absolute inset-0 rounded-xl bg-[#eef4ff]"
                />
              )}

              {!active && (
                <span className="absolute inset-0 rounded-xl bg-[#f8fafc] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              )}

              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.16 }}
                className="relative z-10 flex shrink-0 items-center justify-center"
              >
                <Icon
                  className="h-5 w-5"
                  strokeWidth={1.8}
                />
              </motion.span>

              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    initial={{
                      opacity: 0,
                      x: -6,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: -6,
                    }}
                    transition={{
                      duration: 0.18,
                    }}
                    className={
                      active
                        ? "relative z-10 ml-3 truncate text-[13px] font-semibold text-[#2864f0]"
                        : "relative z-10 ml-3 truncate text-[13px] font-medium text-[#516078]"
                    }
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {collapsed && (
                <span className="pointer-events-none absolute left-[58px] top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-lg border border-[#e1e6ee] bg-white px-3 py-2 text-xs font-semibold text-[#344059] opacity-0 shadow-[0_12px_32px_rgba(20,35,60,0.11)] transition-all duration-150 group-hover:translate-x-1 group-hover:opacity-100">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#e7ebf0] p-3">
        <button
          type="button"
          onClick={onToggle}
          aria-label={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          className={
            collapsed
              ? "flex h-11 w-full cursor-pointer items-center justify-center rounded-xl text-[#68758b] transition-colors duration-200 hover:bg-[#f6f8fb] hover:text-[#29354b]"
              : "flex h-11 w-full cursor-pointer items-center rounded-xl px-3 text-[#68758b] transition-colors duration-200 hover:bg-[#f6f8fb] hover:text-[#29354b]"
          }
        >
          {collapsed ? (
            <PanelLeftOpen
              className="h-5 w-5"
              strokeWidth={1.8}
            />
          ) : (
            <>
              <PanelLeftClose
                className="h-5 w-5 shrink-0"
                strokeWidth={1.8}
              />
              <span className="ml-3 text-[13px] font-medium">
                Collapse sidebar
              </span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
