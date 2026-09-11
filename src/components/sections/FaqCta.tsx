import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";

import { faqs } from "@/data/data";

export function FaqCta() {
  const [open, setOpen] = useState(0);

  return (
    <section id="resources" className="relative overflow-hidden bg-white py-24 sm:py-28 lg:py-[150px]">
      <div className="naano-shell grid gap-16 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} className="lg:pt-[130px]">
          <h2 className="max-w-[390px] text-[clamp(3.2rem,5vw,4.7rem)] font-semibold leading-[0.94] tracking-[-0.065em] text-[#181b1f]">
            Frequently
            <br />
            asked
            <br />
            questions.
          </h2>

          <p className="mt-7 max-w-[380px] text-[18px] leading-[1.55] tracking-[-0.015em] text-[#68707a]">
            Everything you need to know before getting started.
          </p>

          <a href="#top" className="mt-8 inline-flex items-center gap-3 text-[16px] font-semibold text-[#202124] no-underline">
            <span className="font-normal text-[#7b828b]">Still have questions?</span>
            <span>Talk to our team</span>
            <ArrowRight className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </a>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }} className="w-full">
          <div className="border-t border-[#dceaf0]">
            {faqs.map(([question, answer], index) => {
              const isOpen = open === index;

              return (
                <div key={question} className="border-b border-[#dceaf0]">
                  <motion.button type="button" onClick={() => setOpen(isOpen ? -1 : index)} aria-expanded={isOpen} whileHover={{ backgroundColor: "#f2f8fb" }} transition={{ duration: 0.2 }} className="group flex w-full items-center justify-between gap-6 rounded-[14px] px-4 text-left">
                    <motion.span whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 350, damping: 25 }} className="py-[25px] text-[20px] font-medium leading-[1.35] tracking-[-0.02em] text-[#202124] sm:text-[21px]">
                      {question}
                    </motion.span>

                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="mr-1 flex shrink-0">
                      <ChevronDown className="h-[17px] w-[17px] text-[#202124]" strokeWidth={1.7} />
                    </motion.span>
                  </motion.button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ height: { duration: 0.38, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.25, ease: "easeOut" } }} className="overflow-hidden">
                        <motion.p initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.3, delay: 0.04, ease: [0.22, 1, 0.36, 1] }} className="max-w-[900px] pb-8 pl-4 pr-8 pt-1 text-[18px] leading-[1.55] tracking-[-0.01em] text-[#737983]">
                          {answer}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}