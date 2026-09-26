import {
  Bell,
  CheckCheck,
  ChevronDown,
  Globe2,
  LogOut,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/auth";
import {
  getDashboard,
  getNotifications,
  markAllNotifications,
  markNotification,
  type Notification,
} from "@/lib/dashboard";
import { signOut } from "@/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

function formatBalance(cents: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "EUR",
      maximumFractionDigits: 0,
    }).format(cents / 100);
  } catch {
    return "€0";
  }
}

function formatNotificationTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DashboardNavbar({
  collapsed,
  onToggleSidebar,
}: {
  collapsed: boolean;
  onToggleSidebar: () => void;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState("EUR");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  const initials = useMemo(
    () =>
      user?.name
        ?.trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "N",
    [user?.name],
  );

  useEffect(() => {
    let cancelled = false;

    void Promise.all([getDashboard(), getNotifications()])
      .then(([dashboardResult, notificationsResult]) => {
        if (cancelled) {
          return;
        }

        setBalance(dashboardResult.data.earnings?.available ?? 0);
        setCurrency(dashboardResult.data.profile?.currency ?? "EUR");
        setNotifications(notificationsResult.data);
      })
      .catch(() => {
        if (!cancelled) {
          setNotifications([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingNotifications(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const unreadCount = notifications.filter((item) => !item.read_at).length;

  const markNotificationRead = async (notification: Notification) => {
    if (notification.read_at) {
      return;
    }

    try {
      await markNotification(notification.id);

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? {
                ...item,
                read_at: new Date().toISOString(),
              }
            : item,
        ),
      );
    } catch {
      return;
    }
  };

  const markAllRead = async () => {
    if (!unreadCount) {
      return;
    }

    try {
      await markAllNotifications();

      const readAt = new Date().toISOString();

      setNotifications((current) =>
        current.map((item) => ({
          ...item,
          read_at: item.read_at ?? readAt,
        })),
      );
    } catch {
      return;
    }
  };

  const handleLogout = async () => {
    await logout().catch(() => undefined);

    dispatch(signOut());

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-[#edf0f5]">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-7">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="h-9 w-9 cursor-pointer rounded-lg text-[#687166] transition-all duration-200 hover:bg-[#f2f3ee] hover:text-[#20251f]"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-[18px] w-[18px]" strokeWidth={1.8} />
          ) : (
            <PanelLeftClose className="h-[18px] w-[18px]" strokeWidth={1.8} />
          )}
        </Button>
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/dashboard/earnings")}
            className="h-10 cursor-pointer gap-2 rounded-xl px-2.5 text-[13px] font-medium text-[#55637b] hover:bg-[#f6f8fb] hover:text-[#202938] sm:px-3"
          >
            <WalletCards className="h-[17px] w-[17px]" strokeWidth={1.8} />
            <span className="hidden sm:inline">
              {formatBalance(balance, currency)}
            </span>
          </Button>

          <div className="hidden items-center gap-1 rounded-xl px-1 sm:flex">
            <Globe2
              className="h-[17px] w-[17px] text-[#748198]"
              strokeWidth={1.8}
            />

            <Button
              type="button"
              variant="ghost"
              className="h-9 cursor-pointer rounded-lg px-2.5 text-xs font-semibold text-[#202938] hover:bg-[#f6f8fb] hover:text-[#202938]"
            >
              EN
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="h-9 cursor-pointer rounded-lg px-2.5 text-xs font-semibold text-[#7a879b] hover:bg-[#f6f8fb] hover:text-[#202938]"
            >
              FR
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-lg"
                  aria-label="Notifications"
                  className="relative cursor-pointer rounded-xl text-[#5e6d84] hover:bg-[#f6f8fb] hover:text-[#202938]"
                />
              }
            >
              <Bell className="h-[19px] w-[19px]" strokeWidth={1.8} />

              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#2864f0]" />
              )}
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={10}
              className="w-[min(92vw,360px)] rounded-2xl border-[#e2e7ee] bg-white p-0 shadow-[0_24px_70px_rgba(20,35,60,0.14)]"
            >
              <div className="flex items-center justify-between border-b border-[#edf0f4] px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-[#182239]">
                    Notifications
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#8a96aa]">
                    {unreadCount ? unreadCount + " unread" : "All caught up"}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => void markAllRead()}
                  disabled={!unreadCount}
                  className="h-8 cursor-pointer rounded-lg px-2 text-xs text-[#5c6980] hover:bg-[#f6f8fb] hover:text-[#202938]"
                >
                  <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
                  Mark all read
                </Button>
              </div>

              <div className="max-h-[420px] overflow-y-auto p-2">
                {loadingNotifications ? (
                  <div className="flex min-h-[160px] items-center justify-center text-sm text-[#8995aa]">
                    Loading…
                  </div>
                ) : notifications.length ? (
                  notifications.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => void markNotificationRead(notification)}
                      className="flex w-full cursor-pointer gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-[#f7f9fc]"
                    >
                      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#2864f0]" />

                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-semibold text-[#344059]">
                          {notification.title}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-[#7c899f]">
                          {notification.body}
                        </span>
                        <span className="mt-1 block text-[10px] text-[#9aa5b5]">
                          {formatNotificationTime(notification.created_at)}
                        </span>
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="flex min-h-[160px] items-center justify-center px-6 text-center text-sm text-[#8995aa]">
                    No notifications yet.
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  aria-label="Open account menu"
                  className="h-10 cursor-pointer rounded-xl p-0 hover:bg-transparent"
                />
              }
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-[#5f6bc6] text-sm font-semibold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <ChevronDown
                  className="ml-1.5 hidden h-4 w-4 text-[#718098] sm:block"
                  strokeWidth={1.8}
                />
              </motion.div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={10}
              className="w-60 rounded-2xl border-[#e2e7ee] bg-white p-2 shadow-[0_24px_70px_rgba(20,35,60,0.14)]"
            >
              <div className="flex items-center gap-3 px-3 py-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-[#5f6bc6] text-sm font-semibold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#202938]">
                    {user?.name || "Naano member"}
                  </p>
                  <p className="mt-0.5 text-xs text-[#8b97aa]">
                    {user?.role === "brand" ? "Brand" : "Creator"}
                  </p>
                </div>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => navigate("/dashboard")}
                className="h-10 cursor-pointer rounded-lg px-3 text-[13px] text-[#526078] focus:bg-[#f6f8fb] focus:text-[#202938]"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Guided tour
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate("/dashboard/settings")}
                className="h-10 cursor-pointer rounded-lg px-3 text-[13px] text-[#526078] focus:bg-[#f6f8fb] focus:text-[#202938]"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuItem
                render={<a href="mailto:hello@naano.co" />}
                className="h-10 cursor-pointer rounded-lg px-3 text-[13px] text-[#526078] focus:bg-[#f6f8fb] focus:text-[#202938]"
              >
                <Globe2 className="mr-2 h-4 w-4" />
                Contact support
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => void handleLogout()}
                className="h-10 cursor-pointer rounded-lg px-3 text-[13px] text-[#c34b4b] focus:bg-[#fff4f4] focus:text-[#c34b4b]"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
