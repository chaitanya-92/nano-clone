import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  ExternalLink,
  Link2,
  Share2,
} from "lucide-react";
import { LinkedinIcon } from "@/components/ui/icons/linkedin-icon";
import { communityData } from "../data/dashboardData";

export default function Community() {
  const [leaderboardMetric, setLeaderboardMetric] = useState<"impressions" | "posts">("impressions");

  return (
    <div className="min-h-[calc(100vh-72px)] w-full bg-[#edf5ff]">
      <div className="relative overflow-hidden px-8 py-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(202,225,255,0.95),transparent_55%)]" />

        <div className="relative mx-auto max-w-[1380px]">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-[40px] font-semibold tracking-[-2px] text-[#141a29]">
                {communityData.title}
              </h1>

              <p className="mt-1 max-w-[700px] text-[18px] leading-6 text-[#74819a]">
                {communityData.description}
              </p>
            </div>

            <div className="mt-1 flex items-center gap-2 rounded-full border border-[#cbdcf2] bg-white/70 px-3.5 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#19a85b] shadow-[0_0_0_4px_#e0f6ea]" />
              <span className="text-[12px] font-semibold text-[#53627c]">
                {communityData.badge}
              </span>
            </div>
          </div>

          <section className="mt-6 grid grid-cols-2 gap-4">
            <SlackCard />
            <LinkedInCard />
          </section>

          <Leaderboard metric={leaderboardMetric} setMetric={setLeaderboardMetric} />
        </div>
      </div>
    </div>
  );
}

function SlackCard() {
  return (
    <div className="min-h-[520px] rounded-[22px] border border-[#d4e1ef] bg-white p-6 shadow-[0_8px_30px_rgba(52,86,125,0.06)]">
      <div className="grid grid-cols-[220px_1fr] gap-6">
        <div className="flex h-[158px] flex-col items-center justify-center rounded-[20px] border border-[#dfe6ef] bg-[#fbfcfe]">
          <SlackLogo />

          <div className="mt-5 flex -space-x-2">
            {["E", "T", "J", "M", "K", "R", "S", "D"].map((letter, index) => (
              <div key={`${letter}-${index}`} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#dce7f5] text-[10px] font-semibold text-[#52617b]">
                {letter}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <p className="text-[10px] font-bold tracking-[0.16em] text-[#70809a]">
            {communityData.slack.eyebrow}
          </p>

          <h2 className="mt-2 max-w-[390px] text-[24px] font-semibold leading-[1.08] tracking-[-1px] text-[#151c2d]">
            {communityData.slack.title}
          </h2>

          <p className="mt-4 max-w-[390px] text-[13px] leading-5 text-[#71809a]">
            {communityData.slack.description}
          </p>
        </div>
      </div>

      <div className="my-7 h-px bg-[#e7ebf1]" />

      <div className="space-y-3">
        {communityData.slack.benefits.map((benefit) => (
          <div key={benefit} className="flex items-center gap-3">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#18a85b]">
              <Check className="h-3 w-3 text-white" strokeWidth={3} />
            </span>

            <span className="text-[13px] font-semibold text-[#52627d]">
              {benefit}
            </span>
          </div>
        ))}
      </div>

      <button type="button" className="mt-10 flex h-[52px] w-full items-center justify-between rounded-[15px] bg-white px-5 text-[14px] font-semibold text-[#245be8] shadow-[0_8px_24px_rgba(41,79,136,0.13)] transition-transform hover:-translate-y-0.5">
        <div className="flex items-center gap-3">
          <SlackLogo small />
          <span>{communityData.slack.action}</span>
        </div>

        <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
      </button>
    </div>
  );
}

function LinkedInCard() {
  return (
    <div className="min-h-[520px] rounded-[22px] border border-[#d4e1ef] bg-white p-6 shadow-[0_8px_30px_rgba(52,86,125,0.06)]">
      <div className="flex items-start gap-3">
        <div className="flex h-[66px] w-[66px] items-center justify-center rounded-[10px] bg-[#087bb9]">
          <LinkedinIcon variant="brand" className="h-10 w-10" />
        </div>

        <div>
          <p className="text-[10px] font-bold tracking-[0.16em] text-[#70809a]">
            {communityData.linkedin.eyebrow}
          </p>

          <h2 className="mt-1 max-w-[480px] text-[20px] font-semibold leading-[1.1] tracking-[-0.7px] text-[#151c2d]">
            {communityData.linkedin.title}
          </h2>
        </div>
      </div>

      <p className="mt-3 text-[13px] leading-5 text-[#71809a]">
        {communityData.linkedin.description}
      </p>

      <div className="mt-4 grid grid-cols-[120px_1fr] rounded-[15px] border border-[#cbddeb] bg-[#eef9ff] p-4">
        <div className="border-r border-[#d3e1eb] pr-4">
          <div className="text-[23px] font-semibold text-[#172033]">
            {communityData.linkedin.commission}
          </div>

          <div className="mt-1 text-[9px] font-semibold leading-3 text-[#60738f]">
            {communityData.linkedin.commissionText}
          </div>
        </div>

        <p className="pl-4 text-[11px] leading-4 text-[#60738f]">
          {communityData.linkedin.note}
        </p>
      </div>

      <div className="mt-4 rounded-[15px] border border-[#dce4ed] bg-white p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-[9px] border border-[#e0e5eb] bg-white shadow-sm">
            <span className="text-[26px] font-bold text-[#111318]">n</span>
          </div>

          <div>
            <div className="text-[14px] font-semibold text-[#202637]">
              {communityData.linkedin.creator.name}
            </div>

            <div className="text-[12px] text-[#273044]">
              {communityData.linkedin.creator.subtitle}
            </div>

            <div className="text-[11px] text-[#7b879c]">
              {communityData.linkedin.creator.status}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <CreatorCardPreview />
      </div>

      <button type="button" className="mt-5 flex h-[51px] w-full items-center justify-between rounded-[14px] bg-[#2864f0] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#1e57dc]">
        <div className="flex items-center gap-3">
          <Share2 className="h-4 w-4" strokeWidth={1.8} />
          {communityData.linkedin.action}
        </div>

        <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
      </button>
    </div>
  );
}

function CreatorCardPreview() {
  const creator = communityData.linkedin.creator;

  return (
    <div className="w-[375px] overflow-hidden rounded-[30px] bg-white shadow-[0_16px_45px_rgba(36,70,115,0.13)]">
      <div className="relative h-[92px] bg-gradient-to-br from-[#205ce8] via-[#2864f0] to-[#6c91ef]">
        <div className="absolute left-5 top-4 flex h-9 w-9 items-center justify-center rounded-[9px] bg-white/90">
          <LinkedinIcon variant="brand" className="h-5 w-5" />
        </div>

        <div className="absolute left-1/2 top-4 -translate-x-1/2 text-[22px] font-bold tracking-[-1px] text-white">
          naano
        </div>

        <div className="absolute right-5 top-4 flex h-9 w-9 items-center justify-center rounded-[9px] bg-white/90 text-[#2864f0]">
          <Link2 className="h-4 w-4" />
        </div>

        <div className="absolute -bottom-10 left-1/2 flex h-[82px] w-[82px] -translate-x-1/2 items-center justify-center rounded-full border-2 border-[#2864f0] bg-[#6473c5] text-[29px] text-white">
          {creator.initials}
        </div>
      </div>

      <div className="px-6 pb-5 pt-14 text-center">
        <div className="text-[22px] font-semibold tracking-[-1px] text-[#171d2c]">
          Lord Lord
        </div>

        <div className="mt-1 text-[14px] text-[#7d899f]">
          {creator.category}
        </div>

        <p className="mt-7 text-[13px] leading-5 text-[#7c879c]">
          Your LinkedIn headline and topics will appear here.
        </p>

        <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-[#dce4ee] px-3 py-1.5 text-[10px] font-semibold text-[#7b879c]">
          <span className="h-2 w-2 rounded-full bg-[#dce4ee]" />
          No post data available
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-[#e5e9ef]">
        <div className="border-r border-[#e5e9ef] py-4 text-center">
          <div className="text-[21px] font-semibold text-[#202637]">
            {creator.followers}
          </div>
          <div className="mt-1 text-[10px] text-[#8994a7]">Followers</div>
        </div>

        <div className="border-r border-[#e5e9ef] py-4 text-center">
          <div className="text-[21px] font-semibold text-[#202637]">
            {creator.impressions}
          </div>
          <div className="mt-1 text-[10px] text-[#8994a7]">Est. impressions</div>
        </div>

        <div className="py-4 text-center">
          <div className="text-[21px] font-semibold text-[#202637]">
            {creator.chosenCost}
          </div>
          <div className="mt-1 text-[10px] text-[#8994a7]">Chosen cost</div>
        </div>
      </div>
    </div>
  );
}

function Leaderboard({
  metric,
  setMetric,
}: {
  metric: "impressions" | "posts";
  setMetric: (metric: "impressions" | "posts") => void;
}) {
  const creators = communityData.leaderboard.creators;

  const maxValue = Math.max(
    ...creators.map((creator) => {
      if (metric === "posts") {
        return creator.posts;
      }

      return Number(creator.impressions.replace(/K/i, ""));
    }),
  );

  return (
    <section className="mt-5 overflow-hidden rounded-[22px] border border-[#d4e1ef] bg-white shadow-[0_8px_30px_rgba(52,86,125,0.06)]">
      <div className="flex items-center justify-between border-b border-[#e5eaf1] px-6 py-5">
        <div>
          <h2 className="text-[17px] font-semibold tracking-[-0.4px] text-[#171d2c]">
            {communityData.leaderboard.title}
          </h2>

          <p className="mt-1 text-[12px] text-[#7b879d]">
            {communityData.leaderboard.description}
          </p>
        </div>

        <div className="flex rounded-[11px] border border-[#dce3ed] bg-[#f4f6fa] p-1">
          <button
            type="button"
            onClick={() => setMetric("impressions")}
            className={`rounded-[8px] px-4 py-2 text-[12px] font-semibold transition-colors ${metric === "impressions" ? "bg-white text-[#2864f0] shadow-sm" : "text-[#7b879d]"}`}
          >
            {communityData.leaderboard.metrics.impressions}
          </button>

          <button
            type="button"
            onClick={() => setMetric("posts")}
            className={`rounded-[8px] px-4 py-2 text-[12px] font-semibold transition-colors ${metric === "posts" ? "bg-white text-[#2864f0] shadow-sm" : "text-[#7b879d]"}`}
          >
            {communityData.leaderboard.metrics.posts}
          </button>
        </div>
      </div>

      <div>
        {creators.map((creator) => {
          const numericImpressions = Number(creator.impressions.replace(/K/i, ""));

          const numericValue =
            metric === "impressions" ? numericImpressions : creator.posts;

          const width = Math.max((numericValue / maxValue) * 100, 5);

          const value =
            metric === "impressions"
              ? creator.impressions
              : `${creator.posts}`;

          return (
            <div key={creator.rank} className="grid min-h-[68px] grid-cols-[60px_minmax(260px,1fr)_minmax(300px,1.4fr)_90px] items-center gap-4 border-b border-[#edf0f4] px-6 last:border-b-0 hover:bg-[#fafcff]">
              <div className="flex justify-center">
                <Rank rank={creator.rank} />
              </div>

              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8eef8] text-[12px] font-semibold text-[#53617a]">
                  {creator.name
                    .split(" ")
                    .map((word) => word[0])
                    .slice(0, 2)
                    .join("")}
                </div>

                <div className="min-w-0">
                  <div className="truncate text-[14px] font-semibold text-[#202637]">
                    {creator.name}
                  </div>

                  <div className="mt-0.5 text-[10px] text-[#8b96aa]">
                    {creator.type}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-[#e9edf3]">
                  <div className="h-full rounded-full bg-[#2864f0] transition-all duration-300" style={{ width: `${width}%` }} />
                </div>

                <span className="min-w-[125px] text-right text-[9px] text-[#909bad]">
                  {metric === "impressions"
                    ? "estimated Naano impressions"
                    : "sponsored posts"}
                </span>
              </div>

              <div className="text-right text-[14px] font-semibold text-[#202637]">
                {value}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Rank({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff2cf] text-[13px] font-semibold text-[#b47b00]">
        1
      </span>
    );
  }

  if (rank === 2) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f2f5] text-[13px] font-semibold text-[#647083]">
        2
      </span>
    );
  }

  if (rank === 3) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff0df] text-[13px] font-semibold text-[#ad6c2b]">
        3
      </span>
    );
  }

  return (
    <span className="text-[13px] font-medium text-[#77849b]">
      {rank}
    </span>
  );
}

function SlackLogo({ small = false }: { small?: boolean }) {
  return (
    <div className={`relative ${small ? "h-5 w-5" : "h-12 w-12"}`}>
      <span className="absolute left-[42%] top-0 h-[42%] w-[22%] rounded-full bg-[#36c5f0]" />
      <span className="absolute left-[58%] top-[21%] h-[22%] w-[42%] rounded-full bg-[#2eb67d]" />
      <span className="absolute bottom-[21%] left-[58%] h-[22%] w-[42%] rounded-full bg-[#ecb22e]" />
      <span className="absolute bottom-0 left-[36%] h-[42%] w-[22%] rounded-full bg-[#e01e5a]" />
      <span className="absolute bottom-[21%] left-0 h-[22%] w-[42%] rounded-full bg-[#36c5f0]" />
      <span className="absolute left-0 top-[36%] h-[22%] w-[42%] rounded-full bg-[#e01e5a]" />
      <span className="absolute right-0 top-[36%] h-[22%] w-[42%] rounded-full bg-[#2eb67d]" />
      <span className="absolute left-[36%] top-[21%] h-[22%] w-[22%] rounded-full bg-[#ecb22e]" />
    </div>
  );
}