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
  AnimatePresence,
  motion,
} from "framer-motion";
import { useState } from "react";
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
  const [hovered, setHovered] =
    useState<string | null>(null);

  const activePath =
    location.pathname === "/dashboard"
      ? "/dashboard"
      : navigation.find((item) =>
          location.pathname.startsWith(
            item.href,
          ),
        )?.href ?? "/dashboard";

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[76px] flex-col border-r border-[#e7ebf0] bg-white">
      <div className="flex h-[72px] items-center justify-center border-b border-[#e7ebf0]">
        <Link
          to="/dashboard"
          aria-label="Naano dashboard"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl"
        >
          <span className="text-[26px] font-bold tracking-[-1.8px] text-[#111318]">
            n
          </span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col items-center gap-2 px-2 py-6">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active =
            activePath === item.href;

          return (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() =>
                setHovered(item.href)
              }
              onMouseLeave={() =>
                setHovered(null)
              }
            >
              {hovered === item.href &&
                !active && (
                  <motion.div
                    layoutId="dashboard-hover-nav"
                    transition={{
                      type: "spring",
                      stiffness: 520,
                      damping: 38,
                    }}
                    className="absolute inset-0 rounded-xl bg-[#f6f8fb]"
                  />
                )}

              {active && (
                <motion.div
                  layoutId="dashboard-active-nav"
                  transition={{
                    type: "spring",
                    stiffness: 550,
                    damping: 38,
                  }}
                  className="absolute inset-0 rounded-xl bg-[#eef4ff]"
                />
              )}

              <motion.div
                whileHover={{
                  scale: 1.04,
                }}
                whileTap={{
                  scale: 0.96,
                }}
              >
                <Link
                  to={item.href}
                  aria-label={item.label}
                  className="relative z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-[#617089] transition-colors duration-200 hover:text-[#26324a]"
                >
                  <Icon
                    className="h-5 w-5"
                    strokeWidth={1.8}
                  />
                </Link>
              </motion.div>

              <AnimatePresence>
                {hovered === item.href && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      x: -8,
                      scale: 0.96,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      x: -8,
                      scale: 0.96,
                    }}
                    transition={{
                      duration: 0.18,
                      ease: "easeOut",
                    }}
                    className="pointer-events-none absolute left-[58px] top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-lg border border-[#e1e6ee] bg-white px-3 py-2 text-xs font-semibold text-[#344059] shadow-[0_12px_32px_rgba(20,35,60,0.11)]"
                  >
                    {item.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      <div className="flex h-16 items-center justify-center border-t border-[#e7ebf0]">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.65, 1, 0.65],
          }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-2 w-2 rounded-full bg-[#2864f0]"
        />
      </div>
    </aside>
  );
}
