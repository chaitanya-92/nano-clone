import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { creatorPosts } from "@/data/data";
import { CreatorPostCard } from "@/components/ui/CreatorPostCard";

/* -------------------------------------------------------------------------- */
/* Creator Posts Section                                                      */
/* -------------------------------------------------------------------------- */

export function CreatorPosts() {
  return (
    <section
      id="creators"
      className="
        relative
        overflow-hidden
        bg-white
        py-24
        sm:py-28
        lg:py-32
      "
    >
      {/* ================================================================== */}
      {/* BACKGROUND                                                         */}
      {/* ================================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-[900px]
          bg-[radial-gradient(circle_at_50%_5%,rgba(225,246,255,0.8),rgba(247,252,254,0.7)_48%,transparent_78%)]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          h-[300px]
          w-full
          bg-[radial-gradient(ellipse_at_50%_100%,rgba(219,242,250,0.65),transparent_70%)]
        "
      />

      {/* ================================================================== */}
      {/* MAIN CONTAINER                                                     */}
      {/* ================================================================== */}

      <div
        className="
          relative
          mx-auto
          w-[calc(100%-2rem)]
          max-w-[1332px]
          sm:w-[calc(100%-3rem)]
          lg:w-[calc(100%-6rem)]
        "
      >
        {/* ================================================================ */}
        {/* HEADING                                                           */}
        {/* ================================================================ */}

        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.35,
          }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-center"
        >
          {/* Eyebrow */}

          <p
            className="
              inline-flex
              items-center
              gap-2
              text-[12px]
              font-semibold
              uppercase
              tracking-[0.22em]
              text-[#315d7d]
            "
          >
            <span
              className="
                h-[9px]
                w-[9px]
                rounded-full
                bg-[#3d7396]
              "
            />
            The results
          </p>

          {/* Heading */}

          <h2
            className="
              mx-auto
              mt-6
              max-w-[1100px]
              text-[clamp(2.7rem,5vw,4.1rem)]
              font-semibold
              leading-[1.02]
              tracking-[-0.055em]
              text-[#202124]
            "
          >
            Proven across thousands of campaigns.
          </h2>
        </motion.div>

        {/* ================================================================ */}
        {/* STATISTICS PANEL                                                  */}
        {/* ================================================================ */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.7,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            relative
            mx-auto
            mt-12
            max-w-[1225px]
            overflow-hidden
            rounded-[31px]
            border
            border-white/80
            bg-[linear-gradient(180deg,rgba(239,249,253,0.92),rgba(229,246,252,0.7))]
            px-5
            py-14
            shadow-[inset_0_0_60px_rgba(255,255,255,0.55)]
            sm:px-8
            sm:py-16
            lg:px-5
            lg:py-[90px]
          "
        >
          {/* Soft cloud effect */}

          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              h-[130px]
              bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,255,255,0.95),transparent_72%)]
            "
          />

          <div
            className="
              relative
              grid
              gap-4
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >
            <StatCard
              value={5}
              suffix="M+"
              label="Impressions generated"
              index={0}
            />

            <StatCard
              value={30}
              suffix="K+"
              label="Leads generated"
              index={1}
            />

            <StatCard
              value={2000}
              suffix="+"
              label="Creators on Naano"
              index={2}
            />

            <StatCard value={5} suffix="K+" label="Posts published" index={3} />
          </div>
        </motion.div>

        {/* ================================================================ */}
        {/* CREATOR POSTS                                                     */}
        {/* ================================================================ */}

        <div
          className="
            relative
            mt-16
            grid
            gap-4
            sm:grid-cols-2
            lg:mt-16
            lg:grid-cols-4
          "
        >
          {creatorPosts.map((post, index) => (
            <CreatorPostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================================================================== */
/* STAT CARD                                                                  */
/* ========================================================================== */

function StatCard({
  value,
  suffix,
  label,
  index,
}: {
  value: number;
  suffix: string;
  label: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.97,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.3,
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
      }}
      className="
        flex
        h-[140px]
        flex-col
        items-center
        justify-center
        rounded-[22px]
        border
        border-white
        bg-white/75
        px-4
        shadow-[0_8px_25px_rgba(70,130,160,0.025)]
        backdrop-blur-[2px]
        sm:h-[142px]
        lg:h-[142px]
      "
    >
      {/* Count */}

      <CountUp value={value} suffix={suffix} />

      {/* Label */}

      <span
        className="
          mt-4
          text-[14px]
          leading-none
          text-[#6f8491]
        "
      >
        {label}
      </span>
    </motion.div>
  );
}

/* ========================================================================== */
/* COUNT UP                                                                   */
/* ========================================================================== */

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const isInView = useInView(ref, {
    once: true,
    amount: 0.6,
  });

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) {
      return;
    }

    const duration = 1500;
    const startTime = performance.now();

    let animationFrame: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;

      const progress = Math.min(elapsed / duration, 1);

      /*
       * Ease-out:
       * starts quickly and slows down near the final number.
       */

      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const currentValue = value * easedProgress;

      setCount(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isInView, value]);

  /* ---------------------------------------------------------------------- */
  /* Formatting                                                             */
  /* ---------------------------------------------------------------------- */

  const formattedCount =
    value >= 1000
      ? Math.round(count).toLocaleString("en-US")
      : Math.round(count);

  return (
    <div
      ref={ref}
      className="
        whitespace-nowrap
        text-[48px]
        font-semibold
        leading-none
        tracking-[-0.065em]
        text-[#202124]
        sm:text-[52px]
      "
    >
      {formattedCount}
      {suffix}
    </div>
  );
}
