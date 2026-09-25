import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
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
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

const navigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My card", href: "/dashboard/my-card", icon: WalletCards },
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
  { label: "Community", href: "/dashboard/community", icon: Users },
  { label: "Earnings", href: "/dashboard/earnings", icon: CircleDollarSign },
  { label: "Affiliate program", href: "/dashboard/affiliate", icon: Percent },
  { label: "Messages", href: "/dashboard/messages", icon: MessageCircle },
];

export function DashboardSidebar() {
  const location = useLocation();
  const { setOpen } = useSidebar();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 120);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Sidebar
      collapsible="icon"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="border-[#e8ebf0]"
    >
      <SidebarHeader className="h-[72px] border-b border-[#e8ebf0] p-0">
        <Link
          to="/dashboard"
          className="flex h-full items-center px-6 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          <span className="text-[25px] font-bold tracking-[-1.5px] text-[#111318] group-data-[collapsible=icon]:hidden">
            naano
          </span>
          <span className="hidden text-[24px] font-bold tracking-[-1.5px] text-[#111318] group-data-[collapsible=icon]:block">
            n
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="pt-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <SidebarMenuItem key={item.href}>
                    <Link
                      to={item.href}
                      title={item.label}
                      className={`flex h-12 items-center gap-3 rounded-xl px-4 text-[15px] font-medium transition-colors ${isActive ? "bg-[#eef4ff] text-[#2864f0]" : "text-[#526078] hover:bg-[#f6f8fb] hover:text-[#202124]"} group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0`}
                    >
                      <Icon className="h-5 w-5 shrink-0" strokeWidth={1.8} />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
