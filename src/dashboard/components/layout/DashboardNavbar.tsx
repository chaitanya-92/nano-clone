import {
  Bell,
  CheckCheck,
  ChevronDown,
  Globe2,
  LogOut,
  PanelLeft,
  Settings,
  Sparkles,
  WalletCards,
} from "lucide-react";
import {
  motion,
} from "framer-motion";
import {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
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
import {
  useAppDispatch,
  useAppSelector,
} from "@/store/hooks";

interface DashboardNavbarProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
}

export function DashboardNavbar({
  collapsed,
  onToggleSidebar,
}: DashboardNavbarProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(
    (state) => state.auth.user,
  );

  const [availableBalance, setAvailableBalance] =
    useState(0);
  const [notifications, setNotifications] =
    useState<Notification[]>([]);
  const [notificationsLoading, setNotificationsLoading] =
    useState(true);

  const initials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ||
    "N";

  useEffect(() => {
    let cancelled = false;

    void Promise.all([
      getDashboard(),
      getNotifications(),
    ])
      .then(
        ([
          dashboardResult,
          notificationsResult,
        ]) => {
          if (cancelled) {
            return;
          }

          setAvailableBalance(
            dashboardResult.data.earnings
              ?.available ?? 0,
          );
          setNotifications(
            notificationsResult.data,
          );
        },
      )
      .catch(() => {
        if (!cancelled) {
          setNotifications([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setNotificationsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const unreadCount =
    notifications.filter(
      (item) => !item.read_at,
    ).length;

  const handleNotificationClick = async (
    notification: Notification,
  ) => {
    if (notification.read_at) {
      return;
    }

    try {
      await markNotification(
        notification.id,
      );

      setNotifications(
        (current) =>
          current.map((item) =>
            item.id === notification.id
              ? {
                  ...item,
                  read_at:
                    new Date().toISOString(),
                }
              : item,
          ),
      );
    } catch {
      return;
    }
  };

  const handleMarkAll = async () => {
    if (!unreadCount) {
      return;
    }

    try {
      await markAllNotifications();

      const readAt =
        new Date().toISOString();

      setNotifications(
        (current) =>
          current.map((item) => ({
            ...item,
            read_at:
              item.read_at ?? readAt,
          })),
      );
    } catch {
      return;
    }
  };

  const handleLogout = async () => {
    await logout().catch(
      () => undefined,
    );

    dispatch(signOut());

    navigate("/login", {
      replace: true,
    });
  };

  const formatNotificationTime =
    (value: string) => {
      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {
        return "";
      }

      return date.toLocaleString(
        undefined,
        {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        },
      );
    };

  return (
    <header className="sticky top-0 z-30 h-[72px] border-b border-[#e8ebf0] bg-white/95 backdrop-blur">
      <div className="flex h-full items-center justify-between gap-4 px-5 md:px-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          className="h-10 w-10 cursor-pointer rounded-xl text-[#526078] hover:bg-[#f5f7fa] hover:text-[#202124]"
        >
          <motion.span
            animate={{
              rotate: collapsed ? 0 : 180,
            }}
            transition={{
              duration: 0.24,
              ease: "easeOut",
            }}
            className="flex items-center justify-center"
          >
            <PanelLeft
              className="h-[18px] w-[18px]"
              strokeWidth={1.8}
            />
          </motion.span>
        </Button>

        <div className="ml-auto flex items-center gap-1">
          <motion.div
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                navigate(
                  "/dashboard/earnings",
                )
              }
              className="h-10 cursor-pointer rounded-lg px-3 text-[13px] font-medium text-[#526078] hover:bg-[#f5f7fa] hover:text-[#202124]"
            >
              <WalletCards
                className="h-[17px] w-[17px]"
                strokeWidth={1.8}
              />
              <span>
                €{" "}
                {availableBalance.toLocaleString()}
              </span>
            </Button>
          </motion.div>

          <div className="hidden h-10 items-center gap-1 rounded-lg px-1 sm:flex">
            <Globe2
              className="h-[17px] w-[17px] text-[#68748a]"
              strokeWidth={1.8}
            />

            <Button
              type="button"
              variant="ghost"
              className="h-9 cursor-pointer rounded-[9px] bg-white px-3 text-[12px] font-semibold text-[#202124] hover:bg-[#f5f7fa]"
            >
              EN
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="h-9 cursor-pointer rounded-[9px] px-3 text-[12px] font-semibold text-[#68748a] hover:bg-[#f5f7fa] hover:text-[#202124]"
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
                  size="icon"
                  className="relative h-10 w-10 cursor-pointer rounded-full text-[#526078] hover:bg-[#f5f7fa] hover:text-[#202124]"
                />
              }
            >
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="relative flex h-full w-full items-center justify-center"
              >
                <Bell
                  className="h-[19px] w-[19px]"
                  strokeWidth={1.8}
                />

                {unreadCount > 0 && (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#2864f0]" />
                )}
              </motion.span>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={10}
              className="w-[360px] rounded-2xl border-[#e3e7ee] bg-white p-0 shadow-[0_20px_60px_rgba(20,35,60,0.14)]"
            >
              <div className="flex items-center justify-between border-b border-[#e9edf2] px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-[#182239]">
                    Notifications
                  </p>

                  <p className="mt-0.5 text-[11px] text-[#8a96aa]">
                    {unreadCount
                      ? unreadCount +
                        " unread"
                      : "All caught up"}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    void handleMarkAll()
                  }
                  disabled={!unreadCount}
                  className="h-8 cursor-pointer rounded-lg px-2.5 text-xs text-[#59667e]"
                >
                  <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
                  Mark all read
                </Button>
              </div>

              <div className="max-h-[420px] overflow-y-auto p-2">
                {notificationsLoading ? (
                  <div className="flex min-h-[180px] items-center justify-center text-sm text-[#8995aa]">
                    Loading…
                  </div>
                ) : notifications.length ? (
                  notifications.map(
                    (notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() =>
                          void handleNotificationClick(
                            notification,
                          )
                        }
                        className={
                          notification.read_at
                            ? "flex w-full cursor-pointer gap-3 rounded-xl px-3 py-3 text-left hover:bg-[#f8fafc]"
                            : "flex w-full cursor-pointer gap-3 rounded-xl bg-[#f7f9ff] px-3 py-3 text-left hover:bg-[#f1f5ff]"
                        }
                      >
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eef4ff] text-[#2864f0]">
                          •
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-semibold text-[#344059]">
                            {
                              notification.title
                            }
                          </span>

                          <span className="mt-1 block text-xs leading-5 text-[#7c899f]">
                            {
                              notification.body
                            }
                          </span>

                          <span className="mt-1 block text-[10px] text-[#9aa5b5]">
                            {formatNotificationTime(
                              notification.created_at,
                            )}
                          </span>
                        </span>

                        {!notification.read_at && (
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2864f0]" />
                        )}
                      </button>
                    ),
                  )
                ) : (
                  <div className="flex min-h-[180px] items-center justify-center px-6 text-center text-sm text-[#8995aa]">
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
                  className="h-10 cursor-pointer rounded-full p-0 hover:bg-transparent"
                />
              }
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-[#5966c9] text-[15px] font-semibold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <ChevronDown
                  className="ml-1 hidden h-4 w-4 text-[#68748a] sm:block"
                  strokeWidth={1.8}
                />
              </motion.div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-60 rounded-xl border-[#e8ebf0] bg-white p-2 shadow-[0_16px_40px_rgba(20,35,60,0.12)]"
            >
              <div className="flex items-center gap-3 px-3 py-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-[#5966c9] text-[15px] font-semibold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-[#202124]">
                    {user?.name ??
                      "Naano member"}
                  </p>

                  <p className="truncate text-[12px] text-[#8792a6]">
                    {user?.role ===
                    "brand"
                      ? "Brand"
                      : "Creator"}
                  </p>
                </div>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() =>
                  navigate("/dashboard")
                }
                className="h-10 cursor-pointer rounded-lg px-3 text-[13px] text-[#526078] focus:bg-[#f5f7fa] focus:text-[#202124]"
              >
                <Sparkles
                  className="mr-2 h-4 w-4"
                  strokeWidth={1.8}
                />
                Guided tour
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  navigate(
                    "/dashboard/settings",
                  )
                }
                className="h-10 cursor-pointer rounded-lg px-3 text-[13px] text-[#526078] focus:bg-[#f5f7fa] focus:text-[#202124]"
              >
                <Settings
                  className="mr-2 h-4 w-4"
                  strokeWidth={1.8}
                />
                Settings
              </DropdownMenuItem>

              <DropdownMenuItem
                render={
                  <a href="mailto:hello@naano.co" />
                }
                className="h-10 cursor-pointer rounded-lg px-3 text-[13px] text-[#526078] focus:bg-[#f5f7fa] focus:text-[#202124]"
              >
                <Globe2
                  className="mr-2 h-4 w-4"
                  strokeWidth={1.8}
                />
                Contact support
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() =>
                  void handleLogout()
                }
                className="h-10 cursor-pointer rounded-lg px-3 text-[13px] text-[#d34a4a] focus:bg-[#fff3f3] focus:text-[#d34a4a]"
              >
                <LogOut
                  className="mr-2 h-4 w-4"
                  strokeWidth={1.8}
                />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
