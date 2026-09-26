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

export const dashboardNavigation = [
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
] as const;
