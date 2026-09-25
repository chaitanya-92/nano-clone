import { ArrowUpRight, Check, Copy, ExternalLink, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "../components/shared/StatCard";
import { creatorCard, launchGuide, overviewStats } from "../data/dashboardData";

export default function Overview() {
  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <section>
        <p className="text-[14px] font-medium text-[#5b7393]">
          Creator workspace
        </p>

        <h1 className="mt-2 text-[34px] font-semibold tracking-[-1.7px] text-[#111827]">
          Good to see you, Lord
        </h1>

        <p className="mt-1 text-[18px] text-[#7d899f]">
          Your creator activity, at a glance.
        </p>
      </section>

      <section className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            description={stat.description}
          />
        ))}
      </section>

      <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[410px_1fr]">
        <div className="overflow-hidden rounded-[22px] border border-[#e1e6ee] bg-white shadow-[0_2px_8px_rgba(20,35,60,0.03)]">
          <div className="flex items-start justify-between gap-4 p-6">
            <div>
              <h2 className="text-[18px] font-semibold tracking-[-0.4px] text-[#111827]">
                {creatorCard.title}
              </h2>

              <p className="mt-1 max-w-[190px] text-[13px] leading-5 text-[#8490a5]">
                {creatorCard.description}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="h-9 rounded-lg border-[#dce3ec] px-3 text-[12px] text-[#60708a]"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {creatorCard.actions.open}
              </Button>

              <Button
                variant="outline"
                className="h-9 rounded-lg border-[#dce3ec] px-3 text-[12px] text-[#60708a]"
              >
                <Copy className="h-3.5 w-3.5" />
                {creatorCard.actions.copy}
              </Button>

              <Button className="h-9 rounded-lg bg-[#2864f0] px-3 text-[12px] text-white hover:bg-[#1f58dc]">
                <Share2 className="h-3.5 w-3.5" />
                {creatorCard.actions.share}
              </Button>
            </div>
          </div>

          <div className="mx-6 mb-6 overflow-hidden rounded-[20px] border border-[#e0e4ec] bg-white">
            <div className="relative h-[90px] bg-gradient-to-br from-[#2864f0] via-[#356cf3] to-[#6d8df4]">
              <div className="absolute left-5 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[13px] font-bold text-[#2864f0]">
                in
              </div>

              <div className="absolute left-1/2 top-4 -translate-x-1/2 text-[24px] font-bold tracking-[-1px] text-white">
                naano
              </div>

              <div className="absolute right-5 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[18px]">
                🇮🇳
              </div>

              <div className="absolute -bottom-10 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full border-4 border-[#2864f0] bg-[#6572cc] text-[34px] font-medium text-white">
                L
              </div>
            </div>

            <div className="px-5 pb-6 pt-14 text-center">
              <h3 className="text-[23px] font-semibold tracking-[-0.8px] text-[#111827]">
                Lord Lord
              </h3>

              <p className="mt-1 text-[15px] text-[#8792a6]">Web3 / Crypto</p>

              <p className="mt-6 text-[13px] leading-5 text-[#7f8a9d]">
                Your LinkedIn headline and top positioning appear here.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[22px] border border-[#e1e6ee] bg-white shadow-[0_2px_8px_rgba(20,35,60,0.03)]">
          <div className="flex items-start justify-between p-6">
            <div>
              <h2 className="text-[18px] font-semibold tracking-[-0.4px] text-[#111827]">
                {launchGuide.title}
              </h2>

              <p className="mt-1 text-[13px] text-[#8995aa]">
                {launchGuide.progress}
              </p>
            </div>

            <Button
              variant="ghost"
              className="h-auto p-0 text-[13px] font-medium text-[#2864f0] hover:bg-transparent hover:text-[#1f58dc]"
            >
              {launchGuide.action}
            </Button>
          </div>

          <div className="px-6 pb-6 pt-12">
            <div className="flex items-center gap-5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#16a765] text-white">
                <Check className="h-4 w-4" strokeWidth={2.5} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-[15px] font-semibold text-[#4f5e75]">
                  {launchGuide.step.title}
                </h3>

                <p className="mt-1 text-[12px] text-[#94a0b3]">
                  {launchGuide.step.description}
                </p>
              </div>

              <span className="rounded-full bg-[#e8f8ef] px-4 py-1.5 text-[11px] font-semibold text-[#15945a]">
                {launchGuide.step.status}
              </span>

              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-xl border-[#dce3ec] text-[#65738a]"
              >
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
