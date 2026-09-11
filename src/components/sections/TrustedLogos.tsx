import { motion } from "framer-motion";

import lemlistLogo from "@/assets/logos/hero/lemlist.png";
import folkLogo from "@/assets/logos/hero/folk.png";
import leadbayLogo from "@/assets/logos/hero/leadbay.png";

import gojiLogo from "@/assets/logos/hero/goji.png";
import chatseoLogo from "@/assets/logos/hero/chatseo.png";
import abbysaleLogo from "@/assets/logos/hero/abbysale.png";

const logos = [
  { name: "lemlist", src: lemlistLogo },
  { name: "folk", src: folkLogo },
  { name: "LEADBay", src: leadbayLogo },
  { name: "gojiberry", src: gojiLogo },
  { name: "ChatSEO", src: chatseoLogo },
  { name: "Abyssale", src: abbysaleLogo },
];

export function TrustedLogos() {
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="mt-10 w-full overflow-hidden sm:mt-14">
      <div className="relative mx-auto w-full max-w-6xl overflow-hidden">
        <motion.div className="flex w-max items-center gap-14 sm:gap-16" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 28, ease: "linear", repeat: Infinity }}>
          {duplicatedLogos.map((logo, index) => (
            <div key={`${logo.name}-${index}`} className="flex h-12 w-[140px] shrink-0 items-center justify-center">
              <img src={logo.src} alt={logo.name} className="max-h-[27px] max-w-[118px] object-contain opacity-55 grayscale" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}