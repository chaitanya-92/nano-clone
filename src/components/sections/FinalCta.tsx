import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import strategyAvatar from "@/assets/images/workflowimages/thomas.png";
import { finalCta } from "@/data/data";

export function FinalCta() {
  const { eyebrow, title, description, card, trustText } = finalCta;

  return (
    <section id="final-cta" className="relative min-h-[1050px] overflow-hidden bg-[#eefaff] pt-[76px] sm:min-h-[1050px] lg:pt-[74px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_5%,#ffffff_0%,#ffffff_26%,rgba(255,255,255,0.82)_42%,rgba(231,248,255,0.88)_70%,#dff6ff_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-[radial-gradient(circle_at_50%_100%,rgba(174,231,251,0.5),transparent_68%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1000px] flex-col items-center px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
          <p className="text-[13px] font-semibold tracking-[0.18em] text-[#376789]">{eyebrow}</p>

          <h2 className="mt-6 max-w-[760px] text-[clamp(3.2rem,5.8vw,4.8rem)] font-semibold leading-[0.95] tracking-[-0.065em] text-[#181b1f]">
            {title[0]}
            <br />
            {title[1]}
          </h2>

          <p className="mx-auto mt-8 max-w-[660px] text-[18px] leading-[1.5] tracking-[-0.015em] text-[#626a73] sm:text-[20px]">
            {description}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.75, delay: 0.05, ease: [0.22, 1, 0.36, 1] }} className="mt-[60px] w-full max-w-[570px] rounded-[30px] bg-white px-[51px] pb-[37px] pt-[38px] text-left shadow-[0_22px_65px_rgba(68,146,177,0.10)]">
          <div className="flex items-center gap-4">
            <img src={strategyAvatar} alt="" className="h-[42px] w-[42px] rounded-full object-cover" />
            <p className="text-[13px] font-semibold tracking-[0.17em] text-[#376789]">{card.eyebrow}</p>
          </div>

          <h3 className="mt-[27px] text-[31px] font-semibold leading-[1.08] tracking-[-0.045em] text-[#1d2024]">
            {card.title}
          </h3>

          <p className="mt-[17px] text-[17px] leading-[1.45] tracking-[-0.01em] text-[#656c74]">
            {card.description}
          </p>

          <div className="mt-[28px] border-t border-[#dceaf0]">
            {card.items.map((item) => (
              <div key={item} className="flex h-[52px] items-center gap-3 border-b border-[#dceaf0]">
                <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-[#376789]" />
                <span className="text-[16px] leading-none text-[#34383d]">{item}</span>
              </div>
            ))}
          </div>

          <motion.a href="#" whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }} className="mt-[20px] flex h-[54px] w-full items-center justify-center gap-2 rounded-[13px] bg-[#191b1e] !text-white no-underline transition-shadow duration-300 hover:!text-white hover:shadow-[0_10px_24px_rgba(0,0,0,0.13)]">
            <span className="!text-white">{card.primaryAction}</span>
            <ArrowRight className="h-[17px] w-[17px] !text-white" strokeWidth={1.8} />
            </motion.a>

          <p className="mt-[14px] text-center text-[14px] leading-none text-[#a0a5aa]">
            {card.helperText}
          </p>

          <div className="mt-[19px] text-center text-[15px] text-[#747a81]">
            {card.secondaryPrefix}{" "}
            <a href="#" className="font-semibold text-[#202124] no-underline transition-opacity duration-200 hover:opacity-60">
              {card.secondaryAction} →
            </a>
          </div>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: 0.25 }} className="mt-[38px] text-[15px] tracking-[-0.01em] text-[#a5afb6]">
          {trustText}
        </motion.p>
      </div>
    </section>
  );
}