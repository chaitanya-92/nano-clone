import { motion } from "framer-motion";

import { marketplaceSection } from "@/data/data";

import cloudBackground from "@/assets/images/cloud-background.png";
import marketplaceImage from "@/assets/images/marketplace.png";

export function Marketplace() {
  return (
    <section
      id="companies"
      className="
        relative
        overflow-hidden
        bg-white
        py-20
        sm:py-24
        lg:py-28
      "
    >
      <div className="naano-shell relative z-10">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-black/[0.06]
              bg-white
              px-4
              py-2
              text-[13px]
              font-semibold
              tracking-[-0.01em]
              text-[#69717b]
              shadow-[0_2px_10px_rgba(0,0,0,0.04)]
            "
          >
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            {marketplaceSection.eyebrow}
          </p>

          <h2
            className="
              mx-auto
              mt-7
              max-w-[760px]
              text-[3.2rem]
              font-bold
              leading-[0.98]
              tracking-[-0.055em]
              text-[hsl(var(--naano-ink))]
              sm:text-[4rem]
              lg:text-[4.4rem]
            "
          >
            {marketplaceSection.title}
          </h2>

          <p
            className="
              mx-auto
              mt-7
              max-w-[700px]
              text-base
              leading-7
              text-[hsl(var(--naano-copy))]
              sm:text-lg
              sm:leading-8
            "
          >
            {marketplaceSection.description}
          </p>
        </div>

        {/* Cloud / marketplace visual */}
        <div
          className="
            relative
            mx-auto
            mt-20
            w-full
            max-w-[1260px]
            overflow-hidden
            rounded-[2rem]
            bg-[#c9edff]
            sm:mt-24
            sm:rounded-[2.2rem]
          "
        >
          {/* Cloud background */}
          <img
            src={cloudBackground}
            alt=""
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              h-full
              w-full
              object-cover
            "
          />

          {/* Soft white atmospheric layer */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              bg-white/[0.03]
            "
          />

          {/* Marketplace image */}
          <div
            className="
              relative
              z-10
              mx-auto
              w-[90%]
              translate-y-[8%]
              sm:w-[90%]
              lg:w-[90%]
            "
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.15,
              }}
              whileHover={{
                y: -5,
              }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                relative
                rounded-[1.5rem]
                border
               
                bg-white/80
                p-2
                
                sm:rounded-[1.8rem]
                sm:p-3
              "
            >
              <div
                className="
                  overflow-hidden
                  rounded-[1.2rem]
                  
                  bg-white
                  sm:rounded-[1.5rem]
                "
              >
                <img
                  src={marketplaceImage}
                  alt={marketplaceSection.imageAlt}
                  className="
                    block
                    h-auto
                    w-full
                  "
                />
              </div>
            </motion.div>
          </div>

          {/* Bottom breathing space inside cloud panel */}
          <div aria-hidden="true" className="h-20 sm:h-24" />
        </div>
      </div>
    </section>
  );
}
