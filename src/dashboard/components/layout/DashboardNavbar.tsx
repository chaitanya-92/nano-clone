import {
  Bell,
  ChevronDown,
  Globe2,
  LogOut,
  Settings,
  Sparkles,
  WalletCards,
} from "lucide-react";
import {
  motion,
} from "framer-motion";
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
import { signOut } from "@/features/authSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "@/store/hooks";

export function DashboardNavbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(
    (state) => state.auth.user,
  );

  const initials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(
        (part) => part[0],
      )
      .slice(0, 2)
      .join("")
      .toUpperCase() ||
    "N";

  const handleLogout =
    async () => {
      await logout().catch(
        () => undefined,
      );

      dispatch(signOut());

      navigate("/login", {
        replace: true,
      });
    };

  return (
    <header className="sticky top-0 z-30 h-[72px] border-b border-[#e8ebf0] bg-white/95 backdrop-blur">
      <div className="flex h-full items-center justify-end gap-2 px-6">
        <motion.div
          whileHover={{
            y: -1,
          }}
        >
          <Button
            variant="ghost"
            className="h-10 cursor-pointer rounded-lg px-3 text-[13px] font-medium text-[#526078] hover:bg-[#f5f7fa] hover:text-[#202124]"
          >
            <WalletCards
              className="h-[17px] w-[17px]"
              strokeWidth={1.8}
            />
            <span>€0</span>
          </Button>
        </motion.div>

        <div className="flex h-10 items-center gap-1 rounded-lg px-1">
          <Globe2
            className="h-[17px] w-[17px] text-[#68748a]"
            strokeWidth={1.8}
          />

          <Button
            variant="ghost"
            className="h-9 cursor-pointer rounded-[9px] bg-white px-3 text-[12px] font-semibold text-[#202124] hover:bg-[#f5f7fa]"
          >
            EN
          </Button>

          <Button
            variant="ghost"
            className="h-9 cursor-pointer rounded-[9px] px-3 text-[12px] font-semibold text-[#68748a] hover:bg-[#f5f7fa] hover:text-[#202124]"
          >
            FR
          </Button>
        </div>

        <motion.div
          whileHover={{
            scale: 1.04,
          }}
          whileTap={{
            scale: 0.97,
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 cursor-pointer rounded-full text-[#526078] hover:bg-[#f5f7fa] hover:text-[#202124]"
          >
            <Bell
              className="h-[19px] w-[19px]"
              strokeWidth={1.8}
            />
          </Button>
        </motion.div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="h-10 cursor-pointer rounded-full p-0 hover:bg-transparent"
              />
            }
          >
            <motion.div
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="flex items-center"
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-[#5966c9] text-[15px] font-semibold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <ChevronDown
                className="ml-1 h-4 w-4 text-[#68748a]"
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
                navigate(
                  "/dashboard",
                )
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
    </header>
  );
}
