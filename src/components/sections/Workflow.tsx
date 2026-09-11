import { motion } from "framer-motion";

import {
  workflowSection,
  workflowSteps,
} from "@/data/data";

import { WorkflowCard } from "../ui/WorkflowCard";

export function Workflow() {
  return (
    <section
      id="how-it-works"
      className="
        relative
        overflow-hidden
        bg-white
        pt-20
        pb-16
        sm:pt-24
        sm:pb-20
        lg:pt-24
        lg:pb-24
      "
    >
      <div
          className="
            relative
            z-10
            mx-auto
            w-[calc(100%-2rem)]
            max-w-[1248px]
            sm:w-[calc(100%-3rem)]
            lg:w-[calc(100%-5rem)]
            xl:w-[calc(100%-6rem)]
          "
        >


        <div
          className="
            grid
            items-end
            gap-7
            border-b
            border-[#eef1f3]
            pb-8
            lg:grid-cols-[1.35fr_0.8fr]
            lg:gap-16
            lg:pb-9
          "
        >
          {/* Left */}

          <motion.div
            initial={{
              opacity: 0,
              y: 12,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.4,
            }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p className="eyebrow">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-sky-400" />
              {workflowSection.eyebrow}
            </p>

            <h2
              className="
                mt-7
                max-w-[620px]
                text-[clamp(2.55rem,3.8vw,3.65rem)]
                font-semibold
                leading-[0.98]
                tracking-[-0.055em]
                text-[#171a1e]
              "
            >
              {workflowSection.title}
            </h2>
          </motion.div>

          {/* Right */}

          <motion.p
            initial={{
              opacity: 0,
              y: 12,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.4,
            }}
            transition={{
              duration: 0.5,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              max-w-[410px]
              text-[16px]
              leading-[1.55]
              text-[#626a74]
              lg:justify-self-end
              lg:pb-1
            "
          >
            {workflowSection.description}
          </motion.p>
        </div>

        {/* ================================================================ */}
        {/* WORKFLOW CARDS                                                   */}
        {/* ================================================================ */}

        <div className="relative mt-12 lg:mt-14">

          {/* ============================================================ */}
          {/* CONNECTING LINE                                                */}
          {/* ============================================================ */}

          <svg
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-0
              top-[116px]
              z-0
              hidden
              h-[125px]
              w-full
              overflow-visible
              lg:block
            "
            viewBox="0 0 1200 125"
            preserveAspectRatio="none"
          >
            {/* Soft line underneath */}

            <path
              d="
                M 25 62
                C 100 62, 130 91, 205 91
                C 280 91, 330 36, 405 36
                C 480 36, 530 87, 605 87
                C 680 87, 730 45, 805 45
                C 880 45, 930 87, 1005 87
                C 1080 87, 1120 62, 1175 62
              "
              fill="none"
              stroke="#e1f2fa"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Animated dashed line */}

            <motion.path
              d="
                M 25 62
                C 100 62, 130 91, 205 91
                C 280 91, 330 36, 405 36
                C 480 36, 530 87, 605 87
                C 680 87, 730 45, 805 45
                C 880 45, 930 87, 1005 87
                C 1080 87, 1120 62, 1175 62
              "
              fill="none"
              stroke="#a9d9ed"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="6 10"
              animate={{
                strokeDashoffset: [0, -32],
              }}
              transition={{
                duration: 2.4,
                ease: "linear",
                repeat: Infinity,
              }}
            />
          </svg>

    
          <div
            className="
              relative
              z-10
              grid
              gap-3
              sm:grid-cols-2
              lg:grid-cols-5
              lg:gap-3
            "
          >
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.number}
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
                  amount: 0.18,
                }}
                transition={{
                  delay: index * 0.07,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="min-w-0"
              >
                <WorkflowCard step={step} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}