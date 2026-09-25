import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Eye,
  MoreHorizontal,
  MousePointer2,
  Users,
} from "lucide-react";

import post1 from "@/assets/images/posts/post1.png";
import post2 from "@/assets/images/posts/post2.png";
import post3 from "@/assets/images/posts/post3.png";
import post4 from "@/assets/images/posts/post4.png";

import thomasAvatar from "@/assets/images/workflowimages/thomas.png";
import robinAvatar from "@/assets/images/workflowimages/robin.png";
import ericAvatar from "@/assets/images/workflowimages/eric.png";
import nadaAvatar from "@/assets/images/workflowimages/nada.png";

import lemlistLogo from "@/assets/logos/hero/lemlist.png";
import leadbayLogo from "@/assets/logos/hero/leadbay.png";
import abbysaleLogo from "@/assets/logos/hero/abbysale.png";

interface CreatorPost {
  id: string;
  name: string;
  role: string;
  avatar: string;
  postImage: string;
  text: string;

  metrics: {
    impressions: string;
    clicks: string;
    leads: string;
  };

  company: string;
  companyLogo: string;
}

interface CreatorPostCardProps {
  post: CreatorPost;
  index: number;
}

/* -------------------------------------------------------------------------- */
/* Actual Vite assets                                                         */
/* -------------------------------------------------------------------------- */

const creatorAssets = {
  thomas: {
    avatar: thomasAvatar,
    post: post1,
    logo: lemlistLogo,
  },

  robin: {
    avatar: robinAvatar,
    post: post2,
    logo: leadbayLogo,
  },

  eric: {
    avatar: ericAvatar,
    post: post3,
    logo: leadbayLogo,
  },

  marina: {
    avatar: nadaAvatar,
    post: post4,
    logo: abbysaleLogo,
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Creator Post Card                                                          */
/* -------------------------------------------------------------------------- */

export function CreatorPostCard({ post, index }: CreatorPostCardProps) {
  const assets = creatorAssets[post.id as keyof typeof creatorAssets];

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 24,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.55,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        group
        flex
        h-[588px]
        w-full
        flex-col
        overflow-hidden
        rounded-[22px]
        border
        border-[#cfe4ed]
        bg-white
        shadow-[0_10px_30px_rgba(43,101,130,0.035)]
        transition-shadow
        duration-300
        hover:shadow-[0_16px_45px_rgba(43,101,130,0.08)]
      "
    >
      {/* ================================================================== */}
      {/* CREATOR HEADER                                                     */}
      {/* ================================================================== */}

      <div
        className="
          flex
          h-[92px]
          shrink-0
          items-center
          border-b
          border-[#e2edf2]
          px-5
        "
      >
        {/* Avatar */}

        <div
          className="
            h-[45px]
            w-[45px]
            shrink-0
            rounded-full
            border
            border-[#d7e2e8]
            bg-[#f4f8fa]
            p-[3px]
          "
        >
          <img
            src={assets.avatar}
            alt=""
            className="
              h-full
              w-full
              rounded-full
              object-cover
            "
          />
        </div>

        {/* Creator information */}

        <div className="ml-3 min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3
              className="
                truncate
                text-[15px]
                font-semibold
                leading-[1.15]
                tracking-[-0.025em]
                text-[#202124]
              "
            >
              {post.name}
            </h3>

            {/* LinkedIn */}

            <span
              className="
                inline-flex
                h-[16px]
                w-[16px]
                shrink-0
                items-center
                justify-center
                rounded-[2px]
                bg-[#1677c8]
                text-[9px]
                font-bold
                leading-none
                text-white
              "
            >
              in
            </span>
          </div>

          <p
            className="
              mt-1
              max-w-[190px]
              text-[12px]
              leading-[1.25]
              text-[#899198]
            "
          >
            {post.role}
          </p>
        </div>

        {/* More menu */}

        <button
          type="button"
          aria-label="More options"
          className="
            ml-2
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            text-[#a9b0b5]
            transition-colors
            hover:bg-[#f3f6f8]
          "
        >
          <MoreHorizontal className="h-[18px] w-[18px]" strokeWidth={2} />
        </button>
      </div>

      {/* ================================================================== */}
      {/* POST CONTENT                                                       */}
      {/* ================================================================== */}

      <div className="flex flex-1 flex-col px-5">
        {/* Post text */}

        <p
          className="
            mt-5
            min-h-[92px]
            text-[17px]
            font-semibold
            leading-[1.38]
            tracking-[-0.025em]
            text-[#292d31]
          "
        >
          {post.text}
        </p>

        {/* Post image */}

        <div
          className="
            mt-4
            h-[194px]
            w-full
            shrink-0
            overflow-hidden
            rounded-[17px]
            bg-[#eef5f8]
          "
        >
          <img
            src={assets.post}
            alt=""
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-[1.015]
            "
          />
        </div>

        {/* ================================================================= */}
        {/* METRICS                                                           */}
        {/* ================================================================= */}

        <div
          className="
            mt-8
            flex
            h-[68px]
            shrink-0
            items-center
            rounded-[17px]
            border
            border-[#d6e8ef]
            bg-[#f5fbfe]
            px-3
          "
        >
          {/* Impressions */}

          <div
            className="
              flex
              min-w-0
              flex-1
              items-center
              gap-2
            "
          >
            <Eye
              className="
                h-[16px]
                w-[16px]
                shrink-0
                text-[#9ca5ab]
              "
              strokeWidth={1.6}
            />

            <div className="min-w-0">
              <strong
                className="
                  block
                  text-[16px]
                  font-semibold
                  leading-none
                  tracking-[-0.025em]
                  text-[#25292d]
                "
              >
                {post.metrics.impressions}
              </strong>

              <span
                className="
                  mt-1
                  block
                  text-[11px]
                  leading-none
                  text-[#9aa2a8]
                "
              >
                Impressions
              </span>
            </div>
          </div>

          {/* Clicks */}

          <div
            className="
              flex
              min-w-0
              flex-1
              items-center
              gap-2
            "
          >
            <MousePointer2
              className="
                h-[15px]
                w-[15px]
                shrink-0
                text-[#9ca5ab]
              "
              strokeWidth={1.6}
            />

            <div className="min-w-0">
              <strong
                className="
                  block
                  text-[16px]
                  font-semibold
                  leading-none
                  tracking-[-0.025em]
                  text-[#25292d]
                "
              >
                {post.metrics.clicks}
              </strong>

              <span
                className="
                  mt-1
                  block
                  text-[11px]
                  leading-none
                  text-[#9aa2a8]
                "
              >
                Clicks
              </span>
            </div>
          </div>

          {/* Leads */}

          <div
            className="
              flex
              min-w-0
              flex-1
              items-center
              gap-2
            "
          >
            <Users
              className="
                h-[15px]
                w-[15px]
                shrink-0
                text-[#9ca5ab]
              "
              strokeWidth={1.6}
            />

            <div className="min-w-0">
              <strong
                className="
                  block
                  text-[16px]
                  font-semibold
                  leading-none
                  tracking-[-0.025em]
                  text-[#25292d]
                "
              >
                {post.metrics.leads}
              </strong>

              <span
                className="
                  mt-1
                  block
                  text-[11px]
                  leading-none
                  text-[#9aa2a8]
                "
              >
                Leads
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* FOOTER                                                             */}
      {/* ================================================================== */}

      <div
        className="
          mt-4
          flex
          h-[52px]
          shrink-0
          items-center
          justify-between
          border-t
          border-[#e2edf2]
          px-5
        "
      >
        {/* Company */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-2
          "
        >
          <span
            className="
              text-[13px]
              text-[#929aa0]
            "
          >
            For
          </span>

          <img
            src={assets.logo}
            alt={post.company}
            className="
              max-h-[20px]
              max-w-[78px]
              object-contain
            "
          />
        </div>

        {/* View post */}

        <a
          href="#"
          className="
            inline-flex
            shrink-0
            items-center
            gap-1
            text-[13px]
            font-semibold
            text-[#2670ed]
            no-underline
            transition-opacity
            hover:opacity-70
          "
        >
          View post
          <ArrowUpRight className="h-[14px] w-[14px]" strokeWidth={2} />
        </a>
      </div>
    </motion.article>
  );
}
