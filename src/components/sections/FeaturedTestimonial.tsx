
import {  useScroll } from "framer-motion";
import { useRef } from "react";

import { featuredTestimonial } from "@/data/data";
import { RevealWord } from "@/components/ui/reveal-word";

export function FeaturedTestimonial() {
  const quoteRef = useRef<HTMLDivElement>(null);

  const { company, quote, person } = featuredTestimonial;

  /*
   * Scroll progress is ONLY connected to the quote.
   * Nothing else in this section uses it.
   */
  const { scrollYProgress: quoteProgress } = useScroll({
    target: quoteRef,
    offset: ["start 80%", "center 35%"],
  });

  const quoteWords = quote.before.trim().split(/\s+/);

  return (
    <section
    id="testimonial"
    className="
      relative
      min-h-[720px]
      overflow-hidden
      bg-white
      py-20
      sm:min-h-[735px]
      sm:py-24
      lg:min-h-[750px]
      lg:py-24
    ">
      <div
        className="
          naano-shell
          flex
          w-full
          flex-col
          items-center
          text-center
        "
      >
        {/* Company Logo — STATIC */}

        <img
          src={company.logo}
          alt={company.name}
          className="
            h-auto
            max-h-14
            w-auto
            max-w-[180px]
            object-contain
          "
        />

        {/* Blue Divider — STATIC */}

        <div
          className="
            mt-4
            h-[2px]
            w-[42px]
            bg-[#1769ff]
          "
        />

                {/* Quote — ONLY THIS REVEALS */}

                <div
                ref={quoteRef}
                className="
                    mx-auto
                    mt-12
                    max-w-[950px]
                    text-[clamp(2rem,3.4vw,3.5rem)]
                    font-medium
                    leading-[1.1]
                    tracking-[-0.045em]
                "
                >
                <span className="text-[#202124]">
                    “
                </span>

                {quoteWords.map((word, index) => (
        <span key={`${word}-${index}`}>
            <RevealWord
            word={word}
            index={index}
            total={quoteWords.length + 2}
            progress={quoteProgress}
            />
            {" "}
        </span>
        ))}

        <RevealWord
        word={quote.highlight}
        index={quoteWords.length}
        total={quoteWords.length + 2}
        progress={quoteProgress}
        highlight
        />

        <RevealWord
        word={quote.closingQuote}
        index={quoteWords.length + 1}
        total={quoteWords.length + 2}
        progress={quoteProgress}
        />

   
        </div>

        {/* David — STATIC */}

        <div
          className="
            mt-10
            flex
            flex-col
            items-center
          "
        >
          <img
            src={person.image}
            alt={person.name}
            className="
              h-24
              w-24
              rounded-full
              object-cover
              ring-1
              ring-black/5
            "
          />

          <p
            className="
              mt-4
              text-[18px]
              font-semibold
              tracking-[-0.02em]
              text-[#202124]
            "
          >
            {person.name}
          </p>

          <p
            className="
              mt-1
              text-[15px]
              text-[#737982]
            "
          >
            {person.role}
          </p>

          <p
            className="
              mt-1
              text-[15px]
              text-[#aeb2b8]
            "
          >
            {person.category}
          </p>
        </div>

      
      </div>
    </section>
  );
}