import { motion } from "framer-motion";
import { LinkedinIcon } from "../ui/icons/linkedin-icon";
import { footerGroups, siteConfig } from "../../data/data";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer id="footer" className="cloud-wash relative overflow-hidden border-t border-border/45">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.95),rgba(239,250,255,0.82)_48%,rgba(222,246,255,0.95)_100%)]" />

      <div className="relative z-10 naano-shell pt-24 sm:pt-28 lg:pt-[150px]">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_2.95fr] lg:gap-20">
          <div className="max-w-[270px]">
            <Logo />

            <p className="mt-7 text-[18px] leading-[1.5] tracking-[-0.015em] text-[#7f8d95]">
              {siteConfig.tagline}
            </p>

            <motion.a href="#" whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400, damping: 28 }} aria-label="LinkedIn" className="mt-9 inline-flex text-[#8a969d] no-underline transition-colors duration-200 hover:text-[#252a2e]">
              <LinkedinIcon className="h-[18px] w-[18px]" />
            </motion.a>
          </div>

          <div className="grid gap-12 sm:grid-cols-2 xl:grid-cols-4 xl:gap-14">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2 className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#69747c]"> 
                  {group.title}
                </h2>

                <ul className="mt-5 space-y-4">
                  {group.links.map((link) => (
                    <li key={link}>
                      <motion.a href="#footer" whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400, damping: 28 }} className="inline-block text-[16px] leading-[1.35] tracking-[-0.01em] text-[#e80909] no-underline transition-colors duration-200 hover:text-[#252a2e]">
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 border-t border-[#d5e5eb] pt-6 pb-7 sm:mt-24">
          <div className="flex flex-col gap-5 text-[14px] text-[#9aa5ab] sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 naano. All rights reserved.</p>

            <motion.p whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400, damping: 28 }} className="font-medium text-[#8c9aa2]">
              <span className="mr-2 text-[#42b883]">★</span>
              Trustpilot reviews
            </motion.p>
          </div>
        </div>
      </div>
    </footer>
  );
}