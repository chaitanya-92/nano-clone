import { Menu } from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import {
  navItems,
  resourceLinks,
  navigationActions,
} from "@/data/data";

export function MobileNav() {
  const navigate = (href: string) => {
    window.location.href = href;
  };

  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label={navigationActions.mobileMenu.label}
              className="
                h-10
                w-10
                rounded-full
                shadow-none
                transition-none
                hover:bg-black/[0.04]
                focus-visible:ring-0
              "
            />
          }
        >
          <Menu
            className="h-5 w-5"
            strokeWidth={1.8}
          />
        </SheetTrigger>

        <SheetContent
          side="right"
          className="
            w-[min(90vw,380px)]
            border-l-black/[0.06]
            bg-white
            px-6
          "
        >
          <SheetHeader className="text-left">
            <SheetTitle className="text-lg font-semibold">
              {navigationActions.mobileMenu.label}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-8 flex flex-col">
            {/* Main navigation */}
            {navItems.map((item) => (
              <SheetClose
                key={item.label}
                onClick={() => navigate(item.href)}
                className="
                  w-full
                  border-b
                  border-black/[0.06]
                  bg-transparent
                  py-4
                  text-left
                  text-base
                  font-medium
                  text-black
                  outline-none
                "
              >
                {item.label}
              </SheetClose>
            ))}

            {/* Resources */}
            <div className="border-b border-black/[0.06]">
              <div className="py-4 text-base font-medium text-black">
                {navigationActions.resources.label}
              </div>

              <div className="pb-3 pl-3">
                {resourceLinks.map((item) => (
                  <SheetClose
                    key={item.label}
                    onClick={() => navigate(item.href)}
                    className="
                      block
                      w-full
                      bg-transparent
                      py-2.5
                      text-left
                      text-sm
                      text-black/65
                      outline-none
                    "
                  >
                    {item.label}
                  </SheetClose>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3">
              <SheetClose
                onClick={() =>
                  navigate(navigationActions.signIn.href)
                }
                className="
                  inline-flex
                  h-11
                  w-full
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-black/[0.08]
                  bg-white
                  px-5
                  text-sm
                  font-medium
                  text-black
                  shadow-none
                  outline-none
                  transition-none
                  hover:bg-white
                "
              >
                {navigationActions.signIn.label}
              </SheetClose>

              <SheetClose
                onClick={() =>
                  navigate(navigationActions.signUp.href)
                }
                className="
                  inline-flex
                  h-11
                  w-full
                  items-center
                  justify-center
                  rounded-full
                  bg-black
                  px-5
                  text-sm
                  font-medium
                  text-white
                  shadow-none
                  outline-none
                  transition-none
                  hover:bg-black
                "
              >
                {navigationActions.signUp.label}
              </SheetClose>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}