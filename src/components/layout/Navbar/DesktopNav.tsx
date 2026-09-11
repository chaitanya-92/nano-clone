import { ChevronDown, Globe2 } from "lucide-react";

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

import {
  navItems,
  resourceLinks,
  navigationActions,
} from "@/data/data";

export function DesktopNav() {
  const navigate = (href: string) => {
    window.location.href = href;
  };

  return (
    <div className="hidden items-center lg:flex">
      {/* Main navigation */}
      <NavigationMenu>
        <NavigationMenuList className="gap-7">
          {navItems.map((item) => (
            <NavigationMenuItem key={item.label}>
              <NavigationMenuLink
                render={<a href={item.href} />}
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
                "
              >
                {item.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}

          {/* Resources */}
          <NavigationMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    className="
                      h-auto
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
                <span>
                  {navigationActions.resources.label}
                </span>

                <ChevronDown
                  className="h-3 w-3"
                  strokeWidth={1.8}
                />
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

      {/* Right side actions */}
      <div className="ml-9 flex items-center gap-2.5">
        {/* Language */}
        <Button
          variant="ghost"
          onClick={() =>
            navigate(navigationActions.language.href)
          }
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
          <Globe2
            className="h-3.5 w-3.5"
            strokeWidth={1.8}
          />

          <span>
            {navigationActions.language.label}
          </span>
        </Button>

        {/* Sign in */}
        <Button
          variant="outline"
          onClick={() =>
            navigate(navigationActions.signIn.href)
          }
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

        {/* Sign up */}
        <Button
          onClick={() =>
            navigate(navigationActions.signUp.href)
          }
          className="
            h-10
            rounded-full
            bg-black
            px-5
            text-[14px]
            font-medium
            text-white
            shadow-none
            transition-none
            hover:bg-black
            hover:text-white
            focus-visible:ring-0
          "
        >
          {navigationActions.signUp.label}
        </Button>
      </div>
    </div>
  );
}