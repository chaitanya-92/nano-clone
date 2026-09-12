import { useState } from "react";
import {
  Activity,
  BarChart3,
  Eye,
  FileText,
  Users,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { analyticsData } from "../data/dashboardData";

const icons = {
  posts: FileText,
  reach: Eye,
  engagements: Activity,
  followers: Users,
};

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<string>(
    analyticsData.defaultTimeRange,
  );

  return (
    <div className="min-h-[calc(100vh-72px)] w-full bg-[#f7f9fc] px-8 py-8">
      <div className="mx-auto max-w-[1380px]">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-[40px] font-semibold tracking-[-2px] text-[#141a29]">
              {analyticsData.title}
            </h1>

            <p className="mt-1 text-[18px] text-[#74819a]">
              {analyticsData.description}
            </p>
          </div>

          <div className="relative">
            <select
              value={timeRange}
              onChange={(event) => setTimeRange(event.target.value)}
              className="h-[52px] w-[172px] appearance-none rounded-[13px] border border-[#cbd5e4] bg-white px-4 pr-10 text-[14px] font-medium text-[#59667e] outline-none transition-all focus:border-[#2864f0] focus:ring-2 focus:ring-[#2864f0]/20"
            >
              {analyticsData.timeRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#68758c]" />
          </div>
        </div>

        <section className="relative mt-6 overflow-hidden rounded-[20px] border border-[#d9e4f4] bg-white">
          <img
            src="/src/assets/images/cloud-background.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-[0.28]"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-white/20" />

          <div className="relative flex min-h-[162px] items-center justify-between gap-10 px-8 py-7">
            <div className="max-w-[820px]">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#20b26b]" />

                <span className="text-[11px] font-semibold tracking-[0.13em] text-[#536887]">
                  {analyticsData.snapshot.eyebrow}
                </span>
              </div>

              <h2 className="mt-3 text-[30px] font-semibold tracking-[-1.4px] text-[#182239]">
                {analyticsData.snapshot.title}
              </h2>

              <p className="mt-2 text-[14px] leading-6 text-[#64738e]">
                {analyticsData.snapshot.description}
              </p>
            </div>

            <div className="flex min-w-[335px] items-center gap-8 border-l border-[#d8e0eb] pl-8">
              <div>
                <div className="text-[34px] font-semibold tracking-[-1.5px] text-[#182239]">
                  {analyticsData.snapshot.percentage}
                </div>

                <p className="mt-0.5 max-w-[170px] text-[12px] leading-5 text-[#63728d]">
                  {analyticsData.snapshot.percentageDescription}
                </p>

                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#d8e2ed] bg-white/90 px-3 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#69d7a3]" />
                  <span className="text-[11px] font-medium text-[#63728d]">
                    {analyticsData.snapshot.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-4 gap-4">
          {analyticsData.stats.map((stat) => {
            const Icon = icons[stat.icon];

            return (
              <div
                key={stat.label}
                className="rounded-[18px] border border-[#dfe5ed] bg-white px-5 py-5 shadow-[0_4px_14px_rgba(32,52,82,0.035)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium text-[#77839a]">
                    {stat.label}
                  </span>

                  <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#eef4ff]">
                    <Icon
                      className="h-[17px] w-[17px] text-[#2864f0]"
                      strokeWidth={1.8}
                    />
                  </div>
                </div>

                <div className="mt-4 text-[24px] font-semibold tracking-[-1px] text-[#151b2b]">
                  {stat.value}
                </div>

                <p className="mt-1 text-[12px] text-[#7d899f]">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </section>

        <section className="mt-4 grid grid-cols-[minmax(0,2fr)_minmax(330px,1fr)] gap-4">
          <div className="min-h-[255px] rounded-[18px] border border-[#dfe5ed] bg-white p-6 shadow-[0_4px_14px_rgba(32,52,82,0.035)]">
            <h2 className="text-[16px] font-semibold text-[#171d2c]">
              {analyticsData.recentPosts.title}
            </h2>

            <p className="mt-1 text-[12px] text-[#7c879d]">
              {analyticsData.recentPosts.description}
            </p>

            <div className="flex min-h-[170px] flex-col items-center justify-center text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f1f4fa]">
                <BarChart3
                  className="h-5 w-5 text-[#8490a6]"
                  strokeWidth={1.7}
                />
              </div>

              <h3 className="mt-4 text-[14px] font-semibold text-[#747f96]">
                {analyticsData.recentPosts.emptyTitle}
              </h3>

              <p className="mt-1 max-w-[400px] text-[12px] leading-5 text-[#8994a9]">
                {analyticsData.recentPosts.emptyDescription}
              </p>
            </div>
          </div>

          <div className="min-h-[255px] rounded-[18px] border border-[#dfe5ed] bg-white p-6 shadow-[0_4px_14px_rgba(32,52,82,0.035)]">
            <h2 className="text-[16px] font-semibold text-[#171d2c]">
              {analyticsData.profileSummary.title}
            </h2>

            <p className="mt-1 text-[12px] text-[#7c879d]">
              {analyticsData.profileSummary.description}
            </p>

            <div className="mt-5 space-y-4">
              {analyticsData.profileSummary.metrics.map((metric) => (
                <div key={metric.label}>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#59677f]">
                      {metric.label}
                    </span>

                    <span className="text-[12px] font-semibold text-[#202637]">
                      {metric.value}
                    </span>
                  </div>

                  <div className="mt-2 h-[5px] overflow-hidden rounded-full bg-[#edf1f6]">
                    <div className="h-full w-0 rounded-full bg-[#2864f0]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-4 flex items-center gap-4 rounded-[17px] border border-[#d7e3fa] bg-[#f5f8ff] px-5 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#e9f0ff]">
            <ShieldCheck
              className="h-[18px] w-[18px] text-[#2864f0]"
              strokeWidth={1.8}
            />
          </div>

          <div>
            <h3 className="text-[13px] font-semibold text-[#182239]">
              {analyticsData.informationBanner.title}
            </h3>

            <p className="mt-0.5 text-[12px] text-[#7b879e]">
              {analyticsData.informationBanner.description}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
