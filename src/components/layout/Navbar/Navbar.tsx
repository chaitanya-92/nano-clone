import { cn } from "@/lib/utils";
import { useScrollPosition } from "@/hooks/useScrollPosition";

import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";
import { Logo } from "../Logo";

const NAVBAR_SCROLL_THRESHOLD = 16;

export function Navbar() {
  const scrollY = useScrollPosition();

  const isScrolled = scrollY > NAVBAR_SCROLL_THRESHOLD;

  return (
    <header
      data-scrolled={isScrolled}
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        "border-b border-transparent",
        "transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
        "data-[scrolled=true]:border-black/[0.05]",
        "data-[scrolled=true]:bg-white/90",
        "data-[scrolled=true]:shadow-[0_8px_30px_rgba(0,0,0,0.04)]",
        "data-[scrolled=true]:backdrop-blur-xl",
      )}
    >
      <nav
        aria-label="Main navigation"
        className={cn(
          "naano-shell flex items-center justify-between",
          "transition-[height] duration-300",
          isScrolled
            ? "h-16"
            : "h-[var(--nav-height)]",
        )}
      >
        <Logo />

        <DesktopNav />

        <MobileNav />
      </nav>
    </header>
  );
}