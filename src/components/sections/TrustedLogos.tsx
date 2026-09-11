import { motion } from "framer-motion";

import { trustLogos } from "@/data/data";

export function TrustedLogos() {
  const logos = [...trustLogos, ...trustLogos];

  return (
    <div className="mt-10 w-full overflow-hidden sm:mt-14">
      <div className="relative mx-auto max-w-6xl overflow-hidden">
        <motion.div
          className="flex w-max items-center gap-16"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 24,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {logos.map((logo, index) => (
            <div
              key={`${logo}-${index}`}
              className="
                flex
                h-12
                min-w-[140px]
                items-center
                justify-center
                whitespace-nowrap
                text-base
                font-extrabold
                tracking-tight
                text-slate-500/60
                sm:text-lg
              "
            >
              {logo}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}