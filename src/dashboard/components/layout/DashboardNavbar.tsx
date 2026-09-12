import {
    Bell,
    ChevronDown,
    Globe2,
    LogOut,
    Settings,
    Sparkles,
    WalletCards,
  } from "lucide-react";
  import { Link } from "react-router-dom";
  import { Avatar, AvatarFallback } from "@/components/ui/avatar";
  import { Button } from "@/components/ui/button";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { SidebarTrigger } from "@/components/ui/sidebar";
  
  export function DashboardNavbar() {
    return (
      <header className="sticky top-0 z-30 h-[72px] border-b border-[#e8ebf0] bg-white">
        <div className="flex h-full items-center justify-between px-6">
          <SidebarTrigger className="h-9 w-9 rounded-lg text-[#526078] hover:bg-[#f5f7fa] hover:text-[#202124]" />
  
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="h-10 rounded-lg px-3 text-[13px] font-medium text-[#526078] hover:bg-[#f5f7fa] hover:text-[#202124]">
              <WalletCards className="h-[17px] w-[17px]" strokeWidth={1.8} />
              <span>€0</span>
            </Button>
  
            <div className="flex h-10 items-center gap-1 rounded-lg px-1">
              <Globe2 className="h-[17px] w-[17px] text-[#68748a]" strokeWidth={1.8} />
  
              <Button variant="ghost" className="h-9 rounded-[9px] bg-white px-3 text-[12px] font-semibold text-[#202124] hover:bg-[#f5f7fa]">
                EN
              </Button>
  
              <Button variant="ghost" className="h-9 rounded-[9px] px-3 text-[12px] font-semibold text-[#68748a] hover:bg-[#f5f7fa] hover:text-[#202124]">
                FR
              </Button>
            </div>
  
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-[#526078] hover:bg-[#f5f7fa] hover:text-[#202124]">
              <Bell className="h-[19px] w-[19px]" strokeWidth={1.8} />
            </Button>
  
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" className="h-10 rounded-full p-0 hover:bg-transparent" />}>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-[#5966c9] text-[15px] font-semibold text-white">
                    C
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="ml-1 h-4 w-4 text-[#68748a]" strokeWidth={1.8} />
              </DropdownMenuTrigger>
  
              <DropdownMenuContent align="end" className="w-56 rounded-xl border-[#e8ebf0] bg-white p-2 shadow-lg">
                <div className="flex items-center gap-3 px-3 py-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-[#5966c9] text-[15px] font-semibold text-white">
                      C
                    </AvatarFallback>
                  </Avatar>
  
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-[#202124]">
                      Chaitanya
                    </p>
                    <p className="truncate text-[12px] text-[#8792a6]">
                      Creator
                    </p>
                  </div>
                </div>
  
                <DropdownMenuSeparator />
  
                <DropdownMenuItem className="h-10 cursor-pointer rounded-lg px-3 text-[13px] text-[#526078] focus:bg-[#f5f7fa] focus:text-[#202124]">
                  <Sparkles className="mr-2 h-4 w-4" strokeWidth={1.8} />
                  Guided tour
                </DropdownMenuItem>
  
                <DropdownMenuItem className="h-10 cursor-pointer rounded-lg px-3 text-[13px] text-[#526078] focus:bg-[#f5f7fa] focus:text-[#202124]">
                  <Settings className="mr-2 h-4 w-4" strokeWidth={1.8} />
                  Settings
                </DropdownMenuItem>
  
                <DropdownMenuItem className="h-10 cursor-pointer rounded-lg px-3 text-[13px] text-[#526078] focus:bg-[#f5f7fa] focus:text-[#202124]">
                  <Link to="/dashboard/integrations" className="flex w-full items-center">
                    <Globe2 className="mr-2 h-4 w-4" strokeWidth={1.8} />
                    Integrations
                  </Link>
                </DropdownMenuItem>
  
                <DropdownMenuSeparator />
  
                <DropdownMenuItem className="h-10 cursor-pointer rounded-lg px-3 text-[13px] text-[#d34a4a] focus:bg-[#fff3f3] focus:text-[#d34a4a]">
                  <LogOut className="mr-2 h-4 w-4" strokeWidth={1.8} />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    );
  }