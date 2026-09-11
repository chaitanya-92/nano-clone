import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

import blogsVideo from "@/assets/vid/blogsvid.mp4";

import lemlistLogo from "@/assets/logos/hero/lemlist.png";
import folkLogo from "@/assets/logos/hero/folk.png";
import leadbayLogo from "@/assets/logos/hero/leadbay.png";
import laggLogo from "@/assets/logos/hero/lagg.png";
import gojiLogo from "@/assets/logos/hero/goji.png";
import chatseoLogo from "@/assets/logos/hero/chatseo.png";
import abyssaleLogo from "@/assets/logos/hero/abbysale.png";

import { proofSection } from "@/data/data";

/* -------------------------------------------------------------------------- */
/* Trusted logo mapping                                                       */
/* -------------------------------------------------------------------------- */

const trustedLogoAssets: Record<string, string> = {
  lemlist: lemlistLogo,
  "folk.": folkLogo,
  LEADbay: leadbayLogo,
  "La Growth Machine": laggLogo,
  gojiberry: gojiLogo,
  ChatSEO: chatseoLogo,
  Abyssale: abyssaleLogo,
};

/* -------------------------------------------------------------------------- */
/* Count-up                                                                    */
/* -------------------------------------------------------------------------- */

function useCountUp(
  target: number,
  duration = 1500,
  enabled = false,
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let frame = 0;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress =
        1 - Math.pow(1 - progress, 3);

      setValue(
        Math.round(target * easedProgress),
      );

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [target, duration, enabled]);

  return value;
}

/* -------------------------------------------------------------------------- */
/* Metric                                                                      */
/* -------------------------------------------------------------------------- */

function Metric({
  value,
  label,
  animate,
}: {
  value: string;
  label: string;
  animate: boolean;
}) {
  const numericValue = Number(
    value.replace(/,/g, ""),
  );

  const animatedValue = useCountUp(
    numericValue,
    1500,
    animate,
  );

  return (
    <div className="min-w-0 flex-1">
      <strong
        className="
          block
          text-[36px]
          font-semibold
          leading-none
          tracking-[-0.055em]
          text-[#202124]
          sm:text-[42px]
        "
      >
        {animatedValue.toLocaleString("en-US")}
      </strong>

      <span
        className="
          mt-2.5
          block
          text-[12px]
          leading-5
          text-[#989da3]
          sm:text-[13px]
        "
      >
        {label}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Video testimonial                                                           */
/* -------------------------------------------------------------------------- */

function VideoTestimonial() {
  const { video } = proofSection;

  const videoRef =
    useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const handlePlay = async () => {
    const element = videoRef.current;

    if (!element) {
      return;
    }

    try {
      await element.play();
    } catch {
      return;
    }
  };

  return (
    <motion.article
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
        amount: 0.2,
      }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        relative
        z-20
        w-full
        rounded-[30px]
        border
        border-[#dcecf3]
        bg-white
        p-6
        shadow-[0_14px_45px_rgba(36,90,120,0.055)]
        sm:p-8

        lg:absolute
        lg:left-0
        lg:top-[44px]

        lg:w-[42.25%]

        lg:p-8
        xl:p-9
      "
    >
      {/* Eyebrow */}

      <p
        className="
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.23em]
          text-[#9ca3a9]
          sm:text-[11px]
        "
      >
        {video.eyebrow}
      </p>

      {/* Video */}

      <div
        className="
          relative
          mt-5
          aspect-[1.48/0.82]
          overflow-hidden
          rounded-[20px]
          bg-[#e8eef1]
        "
      >
        {/* Blurred background */}

        <video
          src={blogsVideo}
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-[-25px]
            h-[calc(100%+50px)]
            w-[calc(100%+50px)]
            scale-110
            object-cover
            blur-[20px]
          "
        />

        {/* Soft overlay */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-[1]
            bg-white/10
          "
        />

        {/* Main video */}

        <video
          ref={videoRef}
          src={blogsVideo}
          playsInline
          preload="metadata"
          controls
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          className="
            absolute
            inset-0
            z-[2]
            h-full
            w-full
            object-contain
          "
        />

        {/* Center play button */}

        {!isPlaying && (
          <button
            type="button"
            onClick={handlePlay}
            aria-label="Play testimonial"
            className="
              absolute
              left-1/2
              top-1/2
              z-[5]
              flex
              h-[72px]
              w-[72px]
              -translate-x-1/2
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              bg-white
              shadow-[0_8px_35px_rgba(0,0,0,0.14)]
              transition-transform
              duration-200
              hover:scale-105
            "
          >
            <Play
              className="
                ml-1
                h-6
                w-6
                fill-[#202124]
                text-[#202124]
              "
              strokeWidth={0}
            />
          </button>
        )}
      </div>

      {/* Quote */}

      <p
        className="
          mt-7
          max-w-[590px]
          text-[23px]
          font-semibold
          leading-[1.28]
          tracking-[-0.045em]
          text-[#202124]
          sm:text-[25px]
          lg:text-[27px]
        "
      >
        {video.quote}
      </p>

      {/* Person */}

      <div
        className="
          mt-6
          flex
          items-center
          gap-3
          rounded-full
          border
          border-[#d8edf7]
          bg-[#effaff]
          px-2.5
          py-2
        "
      >
        <img
          src={video.person.image}
          alt={video.person.name}
          className="
            h-10
            w-10
            shrink-0
            rounded-full
            object-cover
          "
        />

        <div className="min-w-0">
          <p
            className="
              text-[13px]
              font-semibold
              leading-5
              tracking-[-0.015em]
              text-[#303338]
            "
          >
            {video.person.name}
          </p>

          <p
            className="
              text-[11px]
              leading-4
              text-[#969da4]
            "
          >
            {video.person.role}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

/* -------------------------------------------------------------------------- */
/* Trusted logos                                                               */
/* -------------------------------------------------------------------------- */

function TrustedLogos() {
  const { caseStudy } = proofSection;

  return (
    <div
      className="
        mt-8
        border-t
        border-[#e9edef]
        pt-6
      "
    >
      <p
        className="
          text-[9px]
          font-semibold
          uppercase
          tracking-[0.22em]
          text-[#adb2b7]
        "
      >
        {caseStudy.trustedEyebrow}
      </p>

      <div
        className="
          mt-5
          grid
          grid-cols-3
          items-center
          gap-x-7
          gap-y-5
          sm:grid-cols-4
          lg:grid-cols-5
        "
      >
        {caseStudy.trustedLogos.map(
          (logoName) => {
            const logo =
              trustedLogoAssets[logoName];

            if (!logo) {
              return (
                <span
                  key={logoName}
                  className="
                    text-[11px]
                    font-medium
                    tracking-[-0.02em]
                    text-[#73787e]
                  "
                >
                  {logoName}
                </span>
              );
            }

            return (
              <div
                key={logoName}
                className="
                  flex
                  h-7
                  items-center
                "
              >
                <img
                  src={logo}
                  alt={logoName}
                  className="
                    max-h-[24px]
                    max-w-[100px]
                    object-contain
                  "
                />
              </div>
            );
          },
        )}

        <span
          className="
            flex
            h-7
            items-center
            text-[12px]
            font-medium
            text-[#9da2a8]
          "
        >
          {caseStudy.additionalCount}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Case study                                                                  */
/* -------------------------------------------------------------------------- */

function CaseStudy() {
  const { caseStudy } = proofSection;

  const caseStudyRef =
    useRef<HTMLElement>(null);

  const [shouldCount, setShouldCount] =
    useState(false);

  useEffect(() => {
    const element = caseStudyRef.current;

    if (!element) {
      return;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (
            entry.isIntersecting
          ) {
            setShouldCount(true);

            observer.disconnect();
          }
        },
        {
          threshold: 0.25,
        },
      );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <motion.article
      ref={caseStudyRef}
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
        amount: 0.2,
      }}
      transition={{
        duration: 0.7,
        delay: 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        relative
        z-10
        mt-6
        w-full
        rounded-[30px]
        border
        border-[#dcecf3]
        bg-white
        p-7
        shadow-[0_14px_45px_rgba(36,90,120,0.045)]
        sm:p-9

        lg:absolute
        lg:right-0
        lg:top-0

        lg:min-h-[690px]
        lg:w-[60%]

        lg:p-11
      "
    >
      {/* Header */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-6
        "
      >
        <p
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.23em]
            text-[#9ca3a9]
            sm:text-[11px]
          "
        >
          {caseStudy.eyebrow}
        </p>

        {/* BlogSEO */}

        <div
          className="
            flex
            shrink-0
            items-center
            gap-2
            text-[#202124]
          "
        >
          <span
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-[7px]
              border-2
              border-[#299cf3]
              text-[14px]
              font-bold
              text-[#299cf3]
            "
          >
            ↪
          </span>

          <span
            className="
              text-[20px]
              font-bold
              tracking-[-0.045em]
            "
          >
            {caseStudy.company}
          </span>
        </div>
      </div>

      {/* Heading */}

      <h3
        className="
          mt-9
          max-w-[650px]
          text-[29px]
          font-semibold
          leading-[1.08]
          tracking-[-0.05em]
          text-[#202124]
          sm:text-[34px]
          lg:text-[37px]
        "
      >
        {caseStudy.title}
      </h3>

      {/* Description */}

      <p
        className="
          mt-5
          max-w-[680px]
          text-[15px]
          leading-[1.55]
          text-[#969ba1]
          sm:text-[16px]
        "
      >
        {caseStudy.description}
      </p>

      {/* Metrics */}

      <div
        className="
          mt-8
          flex
          border-y
          border-[#e8edef]
          py-7
        "
      >
        {caseStudy.metrics.map(
          (metric, index) => (
            <div
              key={metric.label}
              className={`
                min-w-0
                flex-1

                ${
                  index !== 0
                    ? "border-l border-[#e8edef] pl-5 sm:pl-7"
                    : ""
                }

                ${
                  index !==
                  caseStudy.metrics.length - 1
                    ? "pr-5 sm:pr-7"
                    : ""
                }
              `}
            >
              <Metric
                value={metric.value}
                label={metric.label}
                animate={shouldCount}
              />
            </div>
          ),
        )}
      </div>

      {/* CTA */}

      <a
        href="#resources"
        className="
          mt-7
          inline-flex
          items-center
          gap-2
          text-[14px]
          font-semibold
          tracking-[-0.02em]
          text-[#202124]
          no-underline
        "
      >
        {caseStudy.cta}

        <ArrowRight
          className="h-4 w-4"
          strokeWidth={1.8}
        />
      </a>

      {/* Trusted logos */}

      <TrustedLogos />
    </motion.article>
  );
}

/* -------------------------------------------------------------------------- */
/* Proof section                                                               */
/* -------------------------------------------------------------------------- */

export function Proof() {
  return (
    <section
      id="proof"
      className="
        relative
        overflow-hidden
        bg-[#fbfdfe]
        py-24
        sm:py-28
        lg:py-32
      "
    >
      {/* Background atmosphere */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-[650px]
          bg-[radial-gradient(circle_at_50%_0%,rgba(225,246,255,0.65),transparent_68%)]
        "
      />

      <div className="relative naano-shell">
        {/* Section heading */}

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
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <h2 className="section-title">
            {proofSection.title}
          </h2>

          <p className="section-copy mt-5">
            {proofSection.description}
          </p>
        </motion.div>

        {/* Card composition */}

        <div
          className="
            relative
            mx-auto
            mt-20
            min-h-0
            w-full

            max-w-[1248px]

            lg:min-h-[700px]
          "
        >
          <VideoTestimonial />

          <CaseStudy />
        </div>
      </div>
    </section>
  );
}