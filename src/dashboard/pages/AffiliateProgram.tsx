import { useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  Copy,
  Link2,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";
import { affiliateProgramData } from "@/dashboard/data/dashboardData";

type AffiliateTab = "brands" | "creators";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-2 text-[12px] font-bold tracking-[2px] text-[#5c7d96]">
      <span className="h-2 w-2 rounded-full bg-[#8bd1ec]" />
      {children}
    </div>
  );
}

function CopyButton({
  children,
  disabled = false,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="inline-flex h-[56px] items-center justify-center gap-3 rounded-[15px] bg-[#17191d] px-7 text-[15px] font-semibold text-white transition hover:bg-[#292c31] disabled:cursor-not-allowed disabled:bg-[#aeb1b5]"
    >
      <Copy className="h-[18px] w-[18px]" strokeWidth={1.8} />
      {children}
    </button>
  );
}

function StatsRow({
  stats,
}: {
  stats: readonly {
    label: string;
    value: string;
    description?: string;
  }[];
}) {
  return (
    <div className="grid overflow-hidden rounded-[24px] border border-[#e2e4e7] bg-white md:grid-cols-3">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`min-h-[138px] px-6 py-7 md:px-7 ${index > 0 ? "border-t border-[#e2e4e7] md:border-l md:border-t-0" : ""}`}
        >
          <p className="text-[13px] font-medium text-[#8a96aa]">{stat.label}</p>
          <p className="mt-3 text-[29px] font-semibold tracking-[-1px] text-[#17191d]">
            {stat.value}
          </p>
          {stat.description && (
            <p className="mt-1 text-[12px] text-[#8995a9]">{stat.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function StepsSection({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: readonly {
    number: string;
    title: string;
    description: string;
  }[];
}) {
  return (
    <section className="py-24">
      <div className="mb-14">
        <SectionLabel>{eyebrow}</SectionLabel>
        <h2 className="max-w-[760px] text-[48px] font-medium leading-[1.06] tracking-[-2.8px] text-[#17191d] md:text-[52px]">
          {title}
        </h2>
      </div>

      <div className="grid md:grid-cols-3">
        {items.map((item, index) => (
          <div
            key={item.number}
            className={`px-0 py-2 md:px-8 ${index > 0 ? "mt-8 border-t border-[#e2e4e7] pt-8 md:mt-0 md:border-l md:border-t-0 md:pt-2" : ""}`}
          >
            <div className="mb-7 flex h-10 w-10 items-center justify-center rounded-full border border-[#cfe3ef] bg-[#f7fcff] text-[12px] font-medium text-[#63849a]">
              {item.number}
            </div>
            <h3 className="text-[19px] font-semibold tracking-[-0.5px] text-[#202228]">
              {item.title}
            </h3>
            <p className="mt-3 max-w-[330px] text-[15px] leading-7 text-[#718097]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function BrandHero() {
  const data = affiliateProgramData.brands;

  return (
    <>
      <section className="pb-24 pt-16 text-center">
        <div className="mx-auto max-w-[1080px]">
          <div className="mx-auto mb-16 flex w-fit rounded-[20px] border border-[#e5e2df] bg-[#f8f7f5] p-1.5">
            <div className="flex h-[52px] min-w-[220px] items-center justify-center gap-3 rounded-[16px] bg-white px-8 shadow-sm">
              <Building2 className="h-[18px] w-[18px] text-[#24262b]" />
              <span className="text-[15px] font-semibold text-[#24262b]">
                Invite brands
              </span>
            </div>
            <div className="flex h-[52px] min-w-[220px] items-center justify-center gap-3 px-8 text-[15px] font-semibold text-[#738097]">
              <Users className="h-[18px] w-[18px]" />
              Invite creators
            </div>
          </div>

          <div className="mx-auto mb-9 flex w-fit items-center gap-2 rounded-full border border-[#e4e3e0] bg-white px-4 py-2 text-[13px] font-semibold text-[#687184] shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-[#94d9ef]" />
            {data.badge.replace("Creator affiliation", "Creator affiliation")}
          </div>

          <h1 className="mx-auto max-w-[900px] text-[58px] font-medium leading-[1.04] tracking-[-4px] text-[#15171b] md:text-[70px]">
            {data.title}
          </h1>

          <p className="mx-auto mt-8 max-w-[800px] text-[18px] leading-8 text-[#626a77]">
            {data.description}
          </p>

          <div className="mt-10 flex items-center justify-center gap-7">
            <CopyButton>{data.primaryAction}</CopyButton>
            <button
              type="button"
              className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#202228]"
            >
              {data.secondaryAction}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-[#cce5f2] bg-[#f2faff] p-7 md:p-10">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div className="rounded-[22px] bg-white p-7 shadow-[0_10px_40px_rgba(50,100,130,0.06)]">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-[13px] bg-[#17191d] text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[16px] font-semibold text-[#202228]">
                  Introduce a company to Naano
                </h3>
                <p className="mt-1 text-[13px] text-[#8a96aa]">
                  Your link identifies you automatically
                </p>
              </div>
            </div>

            <div className="mt-7 flex items-center gap-3 rounded-[15px] border border-[#e5e5e5] px-5 py-4">
              <Link2 className="h-5 w-5 text-[#2864f0]" />
              <div className="flex-1">
                <p className="text-[10px] font-bold tracking-[1.4px] text-[#9aa5b5]">
                  YOUR PERSONAL REFERRAL LINK
                </p>
                <p className="mt-1 text-[14px] font-semibold text-[#2864f0]">
                  {data.referralLink}
                </p>
              </div>
              <Check className="h-5 w-5 text-[#17945a]" />
            </div>

            <button
              type="button"
              className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-[#a9c1ec]"
            >
              <Copy className="h-4 w-4" />
              Copy link
            </button>
          </div>

          <div className="rounded-[22px] bg-white p-8">
            <p className="text-[11px] font-bold tracking-[1.5px] text-[#8794a7]">
              YOUR SHARE OF NAANO'S COMMISSION
            </p>
            <p className="mt-3 text-[58px] font-medium tracking-[-3px] text-[#17191d]">
              25%
            </p>
            <div className="mt-7 border-t border-[#e3e5e8] pt-5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#8490a3]">
                  Reward period
                </span>
                <span className="text-[14px] font-semibold text-[#24262b]">
                  3 months
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-[13px] text-[#718097]">
          The three-month reward period starts after the company's first completed paid campaign.
        </p>
      </section>
    </>
  );
}

function CreatorHero() {
  const data = affiliateProgramData.creators;

  return (
    <>
      <section className="pb-24 pt-16">
        <div className="mx-auto mb-16 flex w-fit rounded-[20px] border border-[#e5e2df] bg-[#f8f7f5] p-1.5">
          <div className="flex h-[52px] min-w-[220px] items-center justify-center gap-3 px-8 text-[15px] font-semibold text-[#738097]">
            <Building2 className="h-[18px] w-[18px]" />
            Invite brands
          </div>
          <div className="flex h-[52px] min-w-[220px] items-center justify-center gap-3 rounded-[16px] bg-white px-8 shadow-sm">
            <Users className="h-[18px] w-[18px] text-[#24262b]" />
            <span className="text-[15px] font-semibold text-[#24262b]">
              Invite creators
            </span>
          </div>
        </div>

        <div className="grid gap-14 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <div className="mb-8 flex w-fit items-center gap-2 rounded-full border border-[#e4e3e0] bg-white px-4 py-2 text-[13px] font-semibold text-[#687184] shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-[#94d9ef]" />
              {data.badge}
            </div>

            <h1 className="max-w-[700px] text-[55px] font-medium leading-[1.05] tracking-[-3.5px] text-[#15171b] md:text-[64px]">
              {data.title}
            </h1>

            <p className="mt-8 max-w-[700px] text-[18px] leading-8 text-[#626a77]">
              {data.description}
            </p>

            <div className="mt-9">
              <CopyButton disabled>{data.primaryAction}</CopyButton>
              <p className="mt-4 text-[13px] text-[#7e8ca0]">
                {data.helperText}
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#cce5f2] bg-[#f2faff] p-7 md:p-8">
            <div className="rounded-[22px] bg-white p-7">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-[13px] bg-[#17191d] text-white">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold text-[#202228]">
                    {data.shareCard.title}
                  </h3>
                  <p className="mt-1 text-[13px] text-[#8a96aa]">
                    {data.shareCard.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-[15px] border border-[#e5e5e5] px-5 py-4">
                <Link2 className="h-5 w-5 text-[#2864f0]" />
                <span className="flex-1 text-[14px] font-semibold text-[#2864f0]">
                  {data.shareCard.link}
                </span>
                <Copy className="h-4 w-4 text-[#b4c8ed]" />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-[20px] border border-[#cde0ea] bg-white">
              <div className="p-6">
                <p className="text-[10px] font-bold tracking-[1.5px] text-[#8a96aa]">
                  {data.shareCard.share}
                </p>
                <p className="mt-3 text-[32px] font-medium tracking-[-1.5px] text-[#17191d]">
                  {data.shareCard.shareValue}
                </p>
              </div>
              <div className="border-l border-[#dce5eb] p-6">
                <p className="text-[10px] font-bold tracking-[1.5px] text-[#8a96aa]">
                  {data.shareCard.window}
                </p>
                <p className="mt-3 text-[32px] font-medium tracking-[-1.5px] text-[#17191d]">
                  {data.shareCard.windowValue}
                </p>
              </div>
            </div>

            <p className="mt-6 px-2 text-[13px] leading-6 text-[#718097]">
              {data.shareCard.footer}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function LinkChoiceSection() {
  const data = affiliateProgramData.linkChoice;

  return (
    <section className="py-24">
      <SectionLabel>{data.eyebrow}</SectionLabel>

      <h2 className="max-w-[800px] text-[50px] font-medium leading-[1.06] tracking-[-3px] text-[#17191d]">
        {data.title}
      </h2>

      <p className="mt-5 text-[16px] text-[#718097]">{data.description}</p>

      <div className="mt-12 overflow-hidden rounded-[28px] border border-[#cfe3ef]">
        {data.options.map((option, index) => (
          <div
            key={option.title}
            className={`flex flex-col gap-7 p-8 md:flex-row md:items-center md:justify-between md:px-9 ${index === 0 ? "bg-[#effaff]" : "bg-white"}`}
          >
            <div className="flex items-start gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[13px] bg-white text-[#2864f0] shadow-sm">
                {index === 0 ? (
                  <Building2 className="h-5 w-5" />
                ) : (
                  <WalletCards className="h-5 w-5" />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-[20px] font-semibold text-[#202228]">
                    {option.title}
                  </h3>
                  {"badge" in option && option.badge && (
                    <span className="rounded-full bg-white px-3 py-1 text-[9px] font-bold tracking-[1.4px] text-[#6d8396]">
                      {option.badge}
                    </span>
                  )}
                </div>
                <p className="mt-3 max-w-[760px] text-[15px] leading-7 text-[#718097]">
                  {option.description}
                </p>
              </div>
            </div>

            <button
              type="button"
              className={`shrink-0 rounded-[14px] px-6 py-4 text-[14px] font-semibold transition ${index === 0 ? "bg-[#aeb1b5] text-white" : "border border-[#d8e0e8] bg-white text-[#202228] hover:bg-[#f8fafc]"}`}
            >
              {option.action}
              {index === 1 && <ArrowRight className="ml-2 inline h-4 w-4" />}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function PaymentSection() {
  const data = affiliateProgramData.payment;

  return (
    <section className="py-24">
      <SectionLabel>{data.eyebrow}</SectionLabel>

      <h2 className="max-w-[700px] text-[50px] font-medium leading-[1.06] tracking-[-3px] text-[#17191d]">
        {data.title}
      </h2>

      <div className="mt-14 grid md:grid-cols-3">
        {data.steps.map((step, index) => (
          <div
            key={step.number}
            className={`py-3 md:px-8 ${index > 0 ? "mt-8 border-t border-[#e2e4e7] pt-8 md:mt-0 md:border-l md:border-t-0 md:pt-3" : ""}`}
          >
            <div className="mb-7 flex h-10 w-10 items-center justify-center rounded-full border border-[#cfe3ef] bg-[#f7fcff] text-[12px] font-medium text-[#63849a]">
              {step.number}
            </div>

            <h3 className="text-[19px] font-semibold text-[#202228]">
              {step.title}
            </h3>

            <p className="mt-3 max-w-[340px] text-[15px] leading-7 text-[#718097]">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RewardSimulator() {
  const data = affiliateProgramData.simulator;

  const [campaignVolume, setCampaignVolume] = useState<number>(
    data.campaign.defaultValue,
  );
  const [activeBrands, setActiveBrands] = useState<number>(data.brands.defaultValue);

  const reward = useMemo(() => {
    return campaignVolume * activeBrands * 0.2 * 0.25 * 3;
  }, [campaignVolume, activeBrands]);

  const monthlyReward = reward / 3;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <section className="rounded-[30px] border border-[#cde4ef] bg-[#f4fbff]">
      <div className="grid lg:grid-cols-2">
        <div className="p-9 md:p-11">
          <SectionLabel>{data.eyebrow}</SectionLabel>

          <h2 className="max-w-[470px] text-[48px] font-medium leading-[1.05] tracking-[-3px] text-[#17191d]">
            {data.title}
          </h2>

          <div className="mt-10 rounded-[24px] bg-[#17191d] p-7 text-white shadow-[0_18px_50px_rgba(20,24,30,0.16)]">
            <p className="text-[13px] text-[#a8adb5]">
              Potential over 3 months
            </p>

            <p className="mt-6 text-[46px] font-medium tracking-[-2px]">
              {formatCurrency(reward)}
            </p>

            <div className="mt-7 border-t border-white/15 pt-5">
              <p className="text-[13px] text-[#a8adb5]">
                {formatCurrency(monthlyReward)} estimated per month
              </p>
            </div>
          </div>

          <p className="mt-6 text-[12px] leading-5 text-[#8798aa]">
            {data.note}
          </p>
        </div>

        <div className="border-t border-[#cde4ef] p-9 md:p-11 lg:border-l lg:border-t-0">
          <SimulatorSlider
            label={data.campaign.label}
            value={campaignVolume}
            min={data.campaign.min}
            max={data.campaign.max}
            step={500}
            display={formatCurrency(campaignVolume)}
            onChange={setCampaignVolume}
            minLabel="€1,000"
            maxLabel="€25,000"
          />

          <div className="mt-14">
            <SimulatorSlider
              label={data.brands.label}
              value={activeBrands}
              min={data.brands.min}
              max={data.brands.max}
              step={1}
              display={String(activeBrands)}
              onChange={setActiveBrands}
              minLabel="1"
              maxLabel="10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SimulatorSlider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
  minLabel,
  maxLabel,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
  minLabel: string;
  maxLabel: string;
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-end justify-between gap-5">
        <p className="max-w-[330px] text-[15px] font-semibold leading-6 text-[#53627a]">
          {label}
        </p>
        <span className="shrink-0 text-[18px] font-semibold text-[#202228]">
          {display}
        </span>
      </div>

      <div className="relative mt-7">
        <div className="absolute left-0 right-0 top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-[#dce2e9]" />
        <div
          className="absolute left-0 top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-[#3569c7]"
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="relative z-10 h-5 w-full cursor-pointer appearance-none bg-transparent accent-[#3569c7]"
          aria-label={label}
        />
      </div>

      <div className="mt-1 flex justify-between text-[11px] text-[#96a1b1]">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

function TrackingSection({
  tracking,
  creator,
}: {
  tracking: {
    eyebrow: string;
    title: string;
    total: string;
    emptyTitle: string;
    emptyDescription: string;
    action: string;
  };
  creator: boolean;
}) {
  return (
    <section className="py-24">
      <div className="flex items-end justify-between border-b border-[#e1e3e6] pb-7">
        <div>
          <SectionLabel>{tracking.eyebrow}</SectionLabel>
          <h2 className="text-[48px] font-medium tracking-[-3px] text-[#17191d]">
            {tracking.title}
          </h2>
        </div>

        <div className="hidden text-right sm:block">
          <p className="text-[20px] font-semibold text-[#202228]">
            {tracking.total}
          </p>
          <p className="mt-1 text-[10px] font-bold tracking-[1.5px] text-[#8995a8]">
            TOTAL EARNED
          </p>
        </div>
      </div>

      <div className="min-h-[340px] pt-12">
        <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#eff8ff] text-[#2864f0]">
          {creator ? (
            <Users className="h-5 w-5" />
          ) : (
            <Building2 className="h-5 w-5" />
          )}
        </div>

        <h3 className="mt-7 text-[18px] font-semibold text-[#202228]">
          {tracking.emptyTitle}
        </h3>

        <p className="mt-3 max-w-[760px] text-[15px] leading-7 text-[#718097]">
          {tracking.emptyDescription}
        </p>

        <button
          type="button"
          className="mt-7 inline-flex items-center gap-2 text-[14px] font-semibold text-[#2864f0]"
        >
          <Copy className="h-4 w-4" />
          {tracking.action}
        </button>
      </div>
    </section>
  );
}

function AssistantPill() {
  return (
    <div className="pointer-events-none fixed bottom-7 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-full border border-[#e5e7eb] bg-white/95 px-5 py-3.5 shadow-[0_10px_35px_rgba(20,30,50,0.12)] backdrop-blur-md">
      <span className="flex h-6 w-6 items-center justify-center text-[#777d87]">
        <span className="h-4 w-4 rounded-full border-[3px] border-dashed border-[#777d87]" />
      </span>

      <span className="whitespace-nowrap text-[15px] text-[#90939a]">
        What would you like to see?
      </span>

      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4f5f6] text-[#8b9098]">
        <span className="text-[12px]">◫</span>
      </span>
    </div>
  );
}

export default function AffiliateProgram() {
  const [activeTab, setActiveTab] = useState<AffiliateTab>("brands");

  const brands = affiliateProgramData.brands;
  const creators = affiliateProgramData.creators;

  const currentData = activeTab === "brands" ? brands : creators;

  return (
    <div className="min-h-screen bg-[#fbfbfa]">
      <div className="mx-auto max-w-[1240px] px-6 pb-32 pt-8 md:px-10 lg:px-12">
        <div className="mb-8 flex justify-center">
          <div className="flex rounded-[20px] border border-[#e5e2df] bg-[#f5f4f2] p-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("brands")}
              className={`flex h-[52px] min-w-[205px] items-center justify-center gap-3 rounded-[16px] px-7 text-[15px] font-semibold transition ${activeTab === "brands" ? "bg-white text-[#24262b] shadow-sm" : "text-[#738097]"}`}
            >
              <Building2 className="h-[18px] w-[18px]" />
              Invite brands
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("creators")}
              className={`flex h-[52px] min-w-[205px] items-center justify-center gap-3 rounded-[16px] px-7 text-[15px] font-semibold transition ${activeTab === "creators" ? "bg-white text-[#24262b] shadow-sm" : "text-[#738097]"}`}
            >
              <Users className="h-[18px] w-[18px]" />
              Invite creators
            </button>
          </div>
        </div>

        {activeTab === "brands" ? <BrandHero /> : <CreatorHero />}

        <div className="mt-10">
          <StatsRow stats={currentData.stats} />
        </div>

        <StepsSection
          eyebrow={currentData.steps.eyebrow}
          title={currentData.steps.title}
          items={currentData.steps.items}
        />

        <TrackingSection
          tracking={currentData.tracking}
          creator={activeTab === "creators"}
        />

        {activeTab === "brands" && (
          <>
            <LinkChoiceSection />
            <PaymentSection />
            <RewardSimulator />
          </>
        )}

        {activeTab === "creators" && (
          <>
            <div className="mt-8">
              <LinkChoiceSection />
            </div>
            <PaymentSection />
          </>
        )}
      </div>

      <AssistantPill />
    </div>
  );
}
