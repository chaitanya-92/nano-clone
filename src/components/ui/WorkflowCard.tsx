import { motion } from "framer-motion";
import { Check, CircleCheck } from "lucide-react";

import { workflowSteps } from "@/data/data";

/* -------------------------------------------------------------------------- */
/* Shared animation                                                          */
/* -------------------------------------------------------------------------- */

const revealTransition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1] as const,
};

/* -------------------------------------------------------------------------- */
/* Creator visual                                                            */
/* -------------------------------------------------------------------------- */

function CreatorVisual({
  step,
}: {
  step: (typeof workflowSteps)[number];
}) {
  if (step.visual.type !== "creators") return null;

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex items-start justify-center gap-2">
        {step.visual.creators.map((creator, index) => (
          <motion.div
            key={creator.name}
            initial={{
              opacity: 0,
              y: 10,
              scale: 0.94,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.5,
            }}
            transition={{
              ...revealTransition,
              delay: 0.18 + index * 0.08,
            }}
            className="w-[52px] text-center"
          >
            <motion.div
              animate={{
                y: [0, -1.5, 0],
              }}
              transition={{
                duration: 5,
                delay: index * 0.35,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                mx-auto
                h-10
                w-10
                overflow-hidden
                rounded-[9px]
                border
                border-white
                bg-white
                shadow-[0_4px_12px_rgba(30,80,110,0.10)]
              "
            >
              <img
                src={creator.image}
                alt={creator.name}
                className="h-full w-full object-cover"
              />
            </motion.div>

            <p className="mt-1.5 text-[8px] font-semibold leading-none text-[#25292d]">
              {creator.name}
            </p>

            <p className="mt-1 text-[7px] leading-none text-[#9199a1]">
              Fit{" "}
              <span className="font-semibold text-[#5b7d99]">
                {creator.fit}
              </span>
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Campaign brief visual                                                     */
/* -------------------------------------------------------------------------- */

function BriefVisual({
  step,
}: {
  step: (typeof workflowSteps)[number];
}) {
  if (step.visual.type !== "brief") return null;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
        scale: 0.97,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.45,
      }}
      transition={revealTransition}
      className="
        w-[166px]
        rounded-[16px]
        border
        border-[#e3edf3]
        bg-white
        px-4
        py-4
        shadow-[0_10px_30px_rgba(40,90,120,0.07)]
      "
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-[#252a2f]">
          Campaign brief
        </span>

        <span className="rounded-full bg-[#e5f3fb] px-2 py-1 text-[7px] font-bold leading-none text-[#4c7897]">
          {step.visual.badge}
        </span>
      </div>

      <div className="mt-4 space-y-2.5">
        {step.visual.items.map((item, index) => (
          <motion.div
            key={item}
            initial={{
              opacity: 0,
              x: -5,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.32,
              delay: 0.25 + index * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex items-start gap-2"
          >
            <span
              className="
                mt-[1px]
                grid
                h-3.5
                w-3.5
                shrink-0
                place-items-center
                rounded-full
                bg-[#e0f1fa]
              "
            >
              <Check
                className="h-2.5 w-2.5 text-[#5b8bae]"
                strokeWidth={2.6}
              />
            </span>

            <span className="text-[8.5px] leading-[1.25] text-[#69727a]">
              {item}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 h-[5px] overflow-hidden rounded-full bg-[#e8eef2]">
        <motion.div
          initial={{
            width: 0,
          }}
          whileInView={{
            width: `${step.visual.progress}%`,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.45,
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="h-full rounded-full bg-[#356482]"
        />
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Collaboration visual                                                      */
/* -------------------------------------------------------------------------- */

function CollaborationVisual({
  step,
}: {
  step: (typeof workflowSteps)[number];
}) {
  if (step.visual.type !== "collaboration") return null;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
        scale: 0.97,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.45,
      }}
      transition={revealTransition}
      className="
        w-[166px]
        rounded-[16px]
        border
        border-[#e3edf3]
        bg-white
        px-4
        py-3.5
        shadow-[0_10px_30px_rgba(40,90,120,0.07)]
      "
    >
      <div className="space-y-3">
        {step.visual.creators.map((creator, index) => (
          <motion.div
            key={creator.name}
            initial={{
              opacity: 0,
              x: -6,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.35,
              delay: 0.18 + index * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex items-center gap-2"
          >
            <img
              src={creator.image}
              alt={creator.name}
              className="
                h-7
                w-7
                shrink-0
                rounded-full
                border
                border-white
                object-cover
                shadow-[0_2px_8px_rgba(0,0,0,0.08)]
              "
            />

            <span className="flex-1 text-[9px] font-semibold text-[#2d3237]">
              {creator.name}
            </span>

            <motion.span
              initial={{
                opacity: 0,
                scale: 0.92,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.3 + index * 0.1,
                duration: 0.3,
              }}
              className="
                rounded-md
                bg-[#e5f3fb]
                px-1.5
                py-1
                text-[6px]
                font-semibold
                leading-none
                text-[#4d7897]
              "
            >
              {creator.status}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Results visual                                                            */
/* -------------------------------------------------------------------------- */

function ResultsVisual({
  step,
}: {
  step: (typeof workflowSteps)[number];
}) {
  if (step.visual.type !== "results") return null;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
        scale: 0.97,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.45,
      }}
      transition={revealTransition}
      className="
        w-[166px]
        rounded-[16px]
        border
        border-[#e3edf3]
        bg-white
        px-4
        py-3.5
        shadow-[0_10px_30px_rgba(40,90,120,0.07)]
      "
    >
      <p className="text-[7px] leading-none text-[#9ba2aa]">
        {step.visual.label}
      </p>

      <div className="mt-1 flex items-center gap-1.5">
        <span className="text-[23px] font-bold leading-none tracking-[-0.055em] text-[#252a2f]">
          {step.visual.value}
        </span>

        <span className="rounded-md bg-[#e1f1fb] px-1.5 py-1 text-[6px] font-bold leading-none text-[#4c7897]">
          {step.visual.change}
        </span>
      </div>

      <div className="mt-5 flex h-[58px] items-end gap-[5px]">
        {step.visual.bars.map((height, index) => (
          <motion.div
            key={`${height}-${index}`}
            initial={{
              height: 0,
            }}
            whileInView={{
              height: `${height}%`,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.15 + index * 0.07,
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`
              flex-1
              rounded-t-[3px]
              ${
                index >= step.visual.bars.length - 2
                  ? "bg-[#315f7e]"
                  : "bg-[#cfeaf8]"
              }
            `}
          />
        ))}
      </div>

      <div className="mt-3 flex justify-between text-[6.5px] leading-none text-[#9ba2aa]">
        <span>{step.visual.views}</span>
        <span>{step.visual.leads}</span>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Payment visual                                                            */
/* -------------------------------------------------------------------------- */

function PaymentVisual({
  step,
}: {
  step: (typeof workflowSteps)[number];
}) {
  if (step.visual.type !== "payment") return null;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
        scale: 0.97,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.45,
      }}
      transition={revealTransition}
      className="
        w-[166px]
        rounded-[16px]
        border
        border-[#e3edf3]
        bg-white
        px-4
        py-3.5
        shadow-[0_10px_30px_rgba(40,90,120,0.07)]
      "
    >
      <div className="flex items-start gap-2">
        <motion.span
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.35,
          }}
          className="
            grid
            h-7
            w-7
            shrink-0
            place-items-center
            rounded-full
            bg-[#e2f2fb]
          "
        >
          <CircleCheck
            className="h-4 w-4 text-[#4d7895]"
            strokeWidth={1.8}
          />
        </motion.span>

        <div>
          <p className="text-[9px] font-semibold leading-[1.05] text-[#292e33]">
            {step.visual.title}
          </p>

          <p className="mt-0.5 text-[6.5px] leading-none text-[#9ba2aa]">
            {step.visual.subtitle}
          </p>
        </div>
      </div>

      <motion.div
        initial={{
          opacity: 0,
          y: 5,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          delay: 0.2,
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          mt-4
          rounded-[11px]
          border
          border-[#edf0f2]
          bg-[#fcfdfe]
          px-3
          py-3
        "
      >
        <div className="flex items-center justify-between">
          <span className="max-w-[55px] text-[6.5px] leading-[1.2] text-[#9ba2aa]">
            {step.visual.payoutLabel}
          </span>

          <span className="text-[12px] font-bold leading-none text-[#292e33]">
            {step.visual.payout}
          </span>
        </div>
      </motion.div>

      <div className="mt-3 flex gap-1.5">
        {step.visual.actions.map((action, index) => (
          <motion.span
            key={action}
            initial={{
              opacity: 0,
              y: 3,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.35 + index * 0.07,
              duration: 0.25,
            }}
            className="
              rounded-md
              bg-[#f1f3f4]
              px-1.5
              py-1
              text-[5.5px]
              font-medium
              leading-none
              text-[#9299a0]
            "
          >
            {action}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Visual switcher                                                           */
/* -------------------------------------------------------------------------- */

function WorkflowVisual({
  step,
}: {
  step: (typeof workflowSteps)[number];
}) {
  switch (step.visual.type) {
    case "creators":
      return <CreatorVisual step={step} />;

    case "brief":
      return <BriefVisual step={step} />;

    case "collaboration":
      return <CollaborationVisual step={step} />;

    case "results":
      return <ResultsVisual step={step} />;

    case "payment":
      return <PaymentVisual step={step} />;

    default:
      return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Workflow card                                                             */
/* -------------------------------------------------------------------------- */

interface WorkflowCardProps {
  step: (typeof workflowSteps)[number];
  index?: number;
}

export function WorkflowCard({
  step,
  index = 0,
}: WorkflowCardProps) {
  return (
    <motion.article
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
        amount: 0.2,
      }}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -3,
      }}
      className="
        group
        relative
        flex
        min-h-[300px]
        flex-1
        flex-col
        overflow-visible
        rounded-[1.35rem]
        border
        border-[#e7eef2]
        bg-white/[0.78]
        px-5
        pb-5
        pt-7
        shadow-[0_15px_45px_rgba(45,90,115,0.045)]
        backdrop-blur-[2px]
        transition-shadow
        duration-500
        hover:shadow-[0_20px_50px_rgba(45,90,115,0.075)]
        sm:px-5
      "
    >
      {/* Number badge */}

      <div
        className="
          absolute
          -top-[13px]
          left-[14px]
          z-30
          grid
          h-7
          w-7
          place-items-center
          rounded-full
          border
          border-[#d9eaf3]
          bg-[#f7fcff]
          text-[8px]
          font-semibold
          leading-none
          text-[#5f8096]
          shadow-[0_2px_8px_rgba(55,100,125,0.04)]
        "
      >
        {step.number}
      </div>

      {/* Main visual */}

      <div
        className="
          flex
          min-h-[218px]
          flex-1
          items-center
          justify-center
        "
      >
        <WorkflowVisual step={step} />
      </div>

      {/* Title */}

      <h3
        className="
          mt-auto
          max-w-[205px]
          text-[15px]
          font-semibold
          leading-[1.18]
          tracking-[-0.025em]
          text-[#171a1e]
        "
      >
        {step.title}
      </h3>
    </motion.article>
  );
}