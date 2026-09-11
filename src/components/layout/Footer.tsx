import { footerGroups, siteConfig } from "../../data/data";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="cloud-wash border-t border-border/45">
      <div className="naano-shell py-14 sm:py-18">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_2fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {siteConfig.tagline}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-[hsl(var(--naano-copy))]">
                  {group.title}
                </h2>
                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#footer"
                        className="text-base leading-6 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border/58 pt-7 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 naano. All rights reserved.</p>
          <p className="font-medium text-emerald-600">★ Trustpilot reviews</p>
        </div>
      </div>
    </footer>
  );
}
