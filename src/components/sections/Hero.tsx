import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck } from "lucide-react";

import { LinkedinIcon } from "@/components/ui/icons/linkedin-icon";
import { TwitterIcon } from "@/components/ui/icons/TwitterIcon";
import { Button } from "@/components/ui/button";
import { heroSection } from "@/data/data";
import { useMouseParallax } from "@/hooks/useMouseParallax";

import cloudBackground from "@/assets/images/cloud-background.png";

import { TrustedLogos } from "./TrustedLogos";

export function Hero() {
  const { x, y } = useMouseParallax();

  const navigate = (href: string) => {
    window.location.href = href;
  };

  return (
    <section className="relative overflow-hidden border-b border-border/35 bg-[#c9edff] py-20 sm:py-28 lg:py-32">
      <motion.img src={cloudBackground} alt="" aria-hidden="true" className="pointer-events-none absolute -left-[5%] -top-[5%] z-0 h-[110%] w-[110%] max-w-none object-cover" animate={{ x: x * 32, y: y * 20 }} transition={{ type: "spring", stiffness: 65, damping: 20, mass: 0.6 }} />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] bg-white/[0.03]" />

      <div className="naano-shell relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm">
          <span className="flex items-center gap-1.5">
            <TwitterIcon className="h-4 w-4 text-black" />
            <LinkedinIcon className="h-4 w-4" variant="brand" />
          </span>
            <span>{heroSection.eyebrow}</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}>
          <h1 className="mx-auto mt-7 max-w-5xl text-[3.4rem] font-bold leading-[0.98] tracking-[-0.055em] text-[hsl(var(--naano-ink))] sm:text-6xl md:text-7xl lg:text-[4.5rem]">
            {heroSection.title}
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-base leading-7 text-[hsl(var(--naano-copy))] sm:text-lg sm:leading-8">
            {heroSection.description}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" onClick={() => navigate(heroSection.primaryAction.href)} className="h-14 rounded-2xl bg-black px-7 text-base font-medium text-white shadow-none transition-none hover:bg-black hover:text-white">
            {heroSection.primaryAction.label}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button variant="ghost" size="lg" onClick={() => navigate(heroSection.secondaryAction.href)} className="h-14 rounded-2xl px-5 text-base font-medium text-black shadow-none transition-none hover:bg-transparent hover:text-black">
            {heroSection.secondaryAction.label}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.25 }} className="mt-9 inline-flex items-center gap-2 text-sm font-medium text-slate-600">
          <BadgeCheck className="h-5 w-5" />
          <span>{heroSection.trustStatement}</span>
        </motion.div>

        <TrustedLogos />
      </div>
    </section>
  );
}