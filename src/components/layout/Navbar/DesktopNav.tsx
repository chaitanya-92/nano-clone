import { ChevronDown, Globe2 } from "lucide-react";
import { Link } from "react-router-dom";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { scrollToSection } from "@/lib/landingNavigation";

import { navItems, resourceLinks, navigationActions } from "@/data/data";

export function DesktopNav() {
  const navigate = (href: string) => {
    if (href.startsWith("#")) {
      scrollToSection(href);
      return;
    }

    window.location.assign(href);
  };

  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const showDashboard = !isLoading && isAuthenticated;

  return (
    <div className="hidden items-center lg:flex">
      <NavigationMenu>
        <NavigationMenuList className="gap-7">
          {navItems.map((item) => (
            <NavigationMenuItem key={item.label}>
              <NavigationMenuLink
                render={<button type="button" onClick={() => navigate(item.href)} />}
                onClick={(event) => event.preventDefault()}
                className="
                    inline-flex
                    items-center
                    text-[15px]
                    font-medium
                    text-[hsl(var(--naano-ink))]
                    no-underline
                    outline-none
                    transition-none
                    hover:text-[hsl(var(--naano-ink))]
                    hover:bg-transparent
                "
              >
                {item.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}

          <NavigationMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    className="
                      h-auto
                      cursor-pointer
                      gap-1
                      rounded-none
                      bg-transparent
                      p-0
                      text-[15px]
                      font-medium
                      text-[hsl(var(--naano-ink))]
                      shadow-none
                      transition-none
                      hover:bg-transparent
                      hover:text-[hsl(var(--naano-ink))]
                      focus-visible:ring-0
                    "
                  />
                }
              >
                <span>{navigationActions.resources.label}</span>

                <ChevronDown className="h-3 w-3" strokeWidth={1.8} />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={12}
                className="
                  w-52
                  rounded-2xl
                  border-black/[0.06]
                  bg-white
                  p-2
                  shadow-[0_18px_50px_rgba(0,0,0,0.10)]
                "
              >
                {resourceLinks.map((item) => (
                  <DropdownMenuItem
                    key={item.label}
                    onClick={() => navigate(item.href)}
                    className="
                      cursor-pointer
                      rounded-xl
                      px-3.5
                      py-2.5
                      text-sm
                      font-medium
                      focus:bg-black/[0.04]
                    "
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="ml-9 flex items-center gap-2.5">
        <Button
          variant="ghost"
          onClick={() => navigate(navigationActions.language.href)}
          aria-label={navigationActions.language.ariaLabel}
          className="
            h-10
            gap-1.5
            rounded-full
            px-2
            text-[14px]
            font-medium
            text-[#68717c]
            shadow-none
            transition-none
            hover:bg-transparent
            hover:text-[#68717c]
            focus-visible:ring-0
          "
        >
          <Globe2 className="h-3.5 w-3.5" strokeWidth={1.8} />

          <span>{navigationActions.language.label}</span>
        </Button>

        {!showDashboard ? (
          <Button
            variant="outline"
            render={<Link to="/login" />}
          className="
            h-10
            rounded-full
            border-black/[0.06]
            bg-white
            px-5
            text-[14px]
            font-medium
            text-black
            shadow-none
            transition-none
            hover:bg-white
            hover:text-black
            focus-visible:ring-0
          "
        >
            {navigationActions.signIn.label}
          </Button>
        ) : null}

        {!showDashboard ? (
          <Button
            render={<Link to="/register" />}
          className="
            h-10
            rounded-full
            bg-black
            px-5
            text-[14px]
            font-medium
            !text-white
            shadow-none
            transition-none
            hover:bg-black
            hover:text-white
            focus-visible:ring-0
          "
        >
            {navigationActions.signUp.label}
          </Button>
        ) : (
          <Button
            render={<Link to="/dashboard" />}
            className="
              h-10
              rounded-full
              bg-black
              px-5
              text-[14px]
              font-medium
              !text-white
              shadow-none
              transition-none
              hover:bg-black
              hover:text-white
              focus-visible:ring-0
            "
          >
            Dashboard
          </Button>
        )}
      </div>
    </div>
  );
}
