import { ArrowLeft, ArrowUpRight, Check, ExternalLink, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/store/hooks";
import {
  getCampaigns,
  getCollaborations,
  getDashboard,
  getPublicCardUrl,
  type Campaign,
  type Collaboration,
  type DashboardResponse,
} from "@/lib/dashboard";
import { AnimatedNumber } from "@/components/dashboard/AnimatedNumber";
import { PublicCardActions } from "@/dashboard/components/shared/PublicCardActions";
import { Logo } from "@/components/layout/Logo";

const stats = [
  {
    key: "impressions",
    label: "Public post reach",
    description: "Open analytics",
  },
  {
    key: "posts",
    label: "Public posts",
    description: "Open analytics",
  },
  {
    key: "engagements",
    label: "Public engagements",
    description: "Open analytics",
  },
  {
    key: "followers",
    label: "LinkedIn followers",
    description: "Open analytics",
  },
] as const;

function StatSkeleton() {
  return (
    <div className="rounded-[18px] border border-[#e1e6ee] bg-white px-5 py-5">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="mt-5 h-8 w-20" />
      <Skeleton className="mt-2 h-3 w-24" />
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatSkeleton key={stat.key} />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[410px_1fr]">
        <div className="rounded-[22px] border border-[#e1e6ee] bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="mt-2 h-4 w-44" />
            </div>
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
          <Skeleton className="mt-5 h-[360px] rounded-[20px]" />
        </div>

        <div className="rounded-[22px] border border-[#e1e6ee] bg-white p-6">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="mt-2 h-4 w-52" />
          <Skeleton className="mt-12 h-16 w-full rounded-xl" />
          <Skeleton className="mt-3 h-16 w-full rounded-xl" />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="rounded-[22px] border border-[#e1e6ee] bg-white p-6">
          <Skeleton className="h-5 w-52" />
          <Skeleton className="mt-2 h-4 w-64" />
          <Skeleton className="mt-5 h-16 w-full rounded-xl" />
          <Skeleton className="mt-3 h-16 w-full rounded-xl" />
          <Skeleton className="mt-3 h-16 w-full rounded-xl" />
        </div>

        <div className="rounded-[22px] border border-[#e1e6ee] bg-white p-6">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="mt-2 h-4 w-60" />
          <Skeleton className="mt-5 h-16 w-full rounded-xl" />
          <Skeleton className="mt-3 h-16 w-full rounded-xl" />
        </div>
      </div>
    </>
  );
}

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "EUR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default function Overview() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [dashboard, setDashboard] = useState<DashboardResponse["data"] | null>(
    null,
  );
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cardFlipped, setCardFlipped] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void Promise.all([getDashboard(), getCampaigns(), getCollaborations()])
      .then(([dashboardResult, campaignResult, collaborationResult]) => {
        if (cancelled) {
          return;
        }

        setDashboard(dashboardResult.data);
        setCampaigns(campaignResult.data);
        setCollaborations(collaborationResult.data);
      })
      .catch((value) => {
        if (cancelled) {
          return;
        }

        setError(
          value instanceof Error
            ? value.message
            : "Unable to load your dashboard.",
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const profile = dashboard?.profile;

  const cardUrl = profile?.slug ? getPublicCardUrl(profile.slug) : "";

  const activeCollaborations = collaborations
    .filter(
      (item) => !["completed", "declined", "cancelled"].includes(item.status),
    )
    .slice(0, 3);

  const recommendedCampaigns = campaigns.slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <section>
        <p className="text-[14px] font-medium text-[#5b7393]">
          Creator workspace
        </p>

        <h1 className="mt-2 text-[34px] font-semibold tracking-[-1.7px] text-[#111827]">
          Good to see you, {profile?.name ?? user?.name ?? "there"}
        </h1>

        <p className="mt-1 text-[18px] text-[#7d899f]">
          Your creator activity, at a glance.
        </p>
      </section>

      {error && (
        <div className="mt-5 rounded-xl border border-[#f1c7c7] bg-[#fff7f7] px-4 py-3 text-sm text-[#9b3e3e]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-7">
          <OverviewSkeleton />
        </div>
      ) : (
        <>
          <section className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => {
              const value = Number(dashboard?.metrics?.[stat.key] ?? 0);

              return (
                <motion.button
                  key={stat.key}
                  type="button"
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.35,
                    delay: 0.05 + index * 0.06,
                  }}
                  whileHover={{
                    y: -4,
                    scale: 1.01,
                  }}
                  whileTap={{
                    scale: 0.995,
                  }}
                  onClick={() =>
                    navigate("/dashboard/analytics?metric=" + stat.key)
                  }
                  className="cursor-pointer rounded-[18px] border border-[#e1e6ee] bg-white px-5 py-5 text-left shadow-[0_3px_12px_rgba(20,35,60,0.025)]"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b9bb3]">
                    {stat.label}
                  </p>

                  <p className="mt-5 text-[29px] font-semibold tracking-[-1px] text-[#172033]">
                    {stat.key === "impressions" && value === 0 ? (
                      "—"
                    ) : (
                      <AnimatedNumber value={value} />
                    )}
                  </p>

                  <p className="mt-1 text-[12px] text-[#8794aa]">
                    {stat.description}
                  </p>
                </motion.button>
              );
            })}
          </section>

          <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[410px_1fr]">
            <motion.div
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.45,
              }}
              whileHover={{
                y: -3,
              }}
              className="overflow-hidden rounded-[22px] border border-[#e1e6ee] bg-white shadow-[0_2px_8px_rgba(20,35,60,0.03)]"
            >
              <div className="flex items-start justify-between gap-4 p-6">
                <div>
                  <h2 className="text-[18px] font-semibold text-[#111827]">Your creator card</h2>
                  <p className="mt-1 max-w-[190px] text-[13px] leading-5 text-[#8490a5]">
                    Hover for details and click to flip.
                  </p>
                </div>
                <div className="flex w-[112px] flex-col gap-2">
                  <Link to="/dashboard/my-card" className="inline-flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#dce3ec] px-3 text-[12px] font-medium text-[#60708a] transition hover:bg-[#f8fafc]">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open card
                  </Link>
                  <PublicCardActions url={cardUrl} title={(profile?.name ?? "Creator") + " on Naano"} compact />
                </div>
              </div>

              <div
                className="group mx-6 mb-6 cursor-pointer [perspective:1200px]"
                onClick={() => setCardFlipped((current) => !current)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setCardFlipped((current) => !current);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={cardFlipped ? "Show creator card" : "Show creator details"}
              >
                <motion.div
                  animate={{ rotateY: cardFlipped ? 180 : 0 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="relative min-h-[390px] w-full [transform-style:preserve-3d]"
                >
                  <div className="absolute inset-0 overflow-hidden rounded-[20px] border border-[#e0e4ec] bg-white shadow-[0_8px_30px_rgba(30,55,100,0.06)] [backface-visibility:hidden]">
                    <div className="relative h-[90px] bg-gradient-to-br from-[#2864f0] via-[#356cf3] to-[#6d8df4]">
                      <span className="absolute left-5 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[13px] font-bold text-[#2864f0]">in</span>
                      <Logo compact={false} href="/dashboard" className="absolute left-1/2 top-4 -translate-x-1/2 text-white [filter:brightness(0)_invert(1)] [&>span:last-child]:text-[1.25rem]" />
                      <span className="absolute right-5 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[18px]">
                        {profile?.country === "India" ? "🇮🇳" : "🌐"}
                      </span>
                      <div className="absolute -bottom-10 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center overflow-hidden rounded-full border-4 border-[#2864f0] bg-white">
                        {profile?.profile_photo_url ? (
                          <img src={profile.profile_photo_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Logo compact href="/dashboard" className="[&>span:first-child]:scale-[0.9]" />
                        )}
                      </div>
                    </div>
                    <div className="px-5 pb-5 pt-14 text-center">
                      <h3 className="text-[23px] font-semibold text-[#111827]">{profile?.name ?? "Creator"}</h3>
                      <p className="mt-1 text-[15px] text-[#8792a6]">{profile?.category || profile?.headline || "Creator"}</p>
                      <p className="mt-5 line-clamp-3 text-[13px] leading-5 text-[#7f8a9d]">
                        {profile?.bio || profile?.headline || "Complete your creator card to help brands understand your positioning."}
                      </p>
                      <div className="mt-5 flex justify-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#dce4ef] bg-white px-4 py-2 text-xs font-semibold text-[#52617b] shadow-[0_4px_12px_rgba(30,55,100,0.06)] transition-transform duration-200 group-hover:-translate-y-0.5">
                          More details <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 overflow-hidden rounded-[20px] border border-[#dce4ef] bg-white p-5 shadow-[0_12px_35px_rgba(30,55,100,0.08)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8b9bb3]">Performance & ICP</p>
                        <h3 className="mt-1 text-lg font-semibold text-[#172033]">{profile?.name ?? "Creator"}</h3>
                      </div>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef4ff] text-[#2864f0]"><Share2 className="h-4 w-4" /></span>
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      {[
                        ["Followers", Number(dashboard?.metrics?.followers ?? 0)],
                        ["Impressions", Number(dashboard?.metrics?.impressions ?? 0)],
                        ["Engagements", Number(dashboard?.metrics?.engagements ?? 0)],
                        ["Posts", Number(dashboard?.metrics?.posts ?? 0)],
                      ].map(([label, value]) => (
                        <div key={String(label)} className="rounded-xl border border-[#e2e8f0] bg-[#fbfcfe] p-3 text-center">
                          <p className="text-[10px] font-medium text-[#8794aa]">{label}</p>
                          <p className="mt-2 text-lg font-semibold text-[#172033]">{Number(value) ? Number(value).toLocaleString() : "—"}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 rounded-xl border border-[#e2e8f0] bg-white p-4">
                      <p className="text-xs font-semibold text-[#27344b]">About</p>
                      <p className="mt-2 line-clamp-3 text-xs leading-5 text-[#7d899f]">{profile?.bio || profile?.headline || "No creator bio available yet."}</p>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#dce4ef] bg-white px-4 py-2 text-xs font-semibold text-[#52617b]">
                        <ArrowLeft className="h-3.5 w-3.5" /> Back to card
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.45,
                delay: 0.08,
              }}
              className="rounded-[22px] border border-[#e1e6ee] bg-white shadow-[0_2px_8px_rgba(20,35,60,0.03)]"
            >
              <div className="flex items-start justify-between p-6">
                <div>
                  <h2 className="text-[18px] font-semibold text-[#111827]">
                    Your launch guide
                  </h2>

                  <p className="mt-1 text-[13px] text-[#8995aa]">
                    {profile?.card_status === "published"
                      ? "1 of 1 steps complete"
                      : "Complete your creator card to launch"}
                  </p>
                </div>

                <Link
                  to="/dashboard/my-card"
                  className="cursor-pointer text-[13px] font-medium text-[#2864f0]"
                >
                  Open card
                </Link>
              </div>

              <div className="px-6 pb-6 pt-12">
                <div className="flex items-center gap-5">
                  <div
                    className={
                      profile?.card_status === "published"
                        ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#16a765] text-white"
                        : "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-[#2864f0]"
                    }
                  >
                    <Check className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-[15px] font-semibold text-[#4f5e75]">
                      Card and price ready
                    </h3>

                    <p className="mt-1 text-[12px] text-[#94a0b3]">
                      {profile?.card_status === "published"
                        ? "Your positioning and offer are ready."
                        : "Finish your card before sharing it."}
                    </p>
                  </div>

                  <span className="rounded-full bg-[#e8f8ef] px-4 py-1.5 text-[11px] font-semibold text-[#15945a]">
                    {profile?.card_status === "published"
                      ? "Complete"
                      : "Pending"}
                  </span>

                  <Link
                    to="/dashboard/my-card"
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#dce3ec] text-[#65738a]"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </section>

          <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
            <motion.section
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                delay: 0.12,
              }}
              className="rounded-[22px] border border-[#e1e6ee] bg-white p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[18px] font-semibold text-[#111827]">
                    Recommended opportunities
                  </h2>

                  <p className="mt-1 text-[13px] text-[#8995aa]">
                    Open campaigns available from the marketplace.
                  </p>
                </div>

                <Link
                  to="/dashboard/opportunities"
                  className="cursor-pointer text-[13px] font-medium text-[#2864f0]"
                >
                  Explore
                </Link>
              </div>

              <div className="mt-5 space-y-3">
                {recommendedCampaigns.length ? (
                  recommendedCampaigns.map((campaign) => (
                    <Link
                      key={campaign.id}
                      to="/dashboard/opportunities"
                      className="block cursor-pointer rounded-xl border border-[#e4e8ee] p-4 transition hover:-translate-y-0.5 hover:bg-[#fafbfc]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8b97aa]">
                            {campaign.brand_name || "Brand"}
                          </p>

                          <h3 className="mt-1 truncate text-sm font-semibold text-[#27344b]">
                            {campaign.title}
                          </h3>
                        </div>

                        <ArrowUpRight className="h-4 w-4 shrink-0 text-[#77859c]" />
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-[#8794aa]">
                        <span>
                          {formatMoney(
                            campaign.budget_cents,
                            campaign.currency,
                          )}
                        </span>

                        <span>
                          {campaign.min_followers.toLocaleString()}+ followers
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-[#dfe5ed] px-5 py-10 text-center">
                    <p className="text-sm font-semibold text-[#5d6a80]">
                      No open opportunities yet
                    </p>

                    <p className="mt-1 text-xs text-[#8b97aa]">
                      New brand campaigns will appear here.
                    </p>
                  </div>
                )}
              </div>
            </motion.section>

            <motion.section
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                delay: 0.18,
              }}
              className="rounded-[22px] border border-[#e1e6ee] bg-white p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[18px] font-semibold text-[#111827]">
                    Active collaborations
                  </h2>

                  <p className="mt-1 text-[13px] text-[#8995aa]">
                    Everything currently moving from brief to publication.
                  </p>
                </div>

                <Link
                  to="/dashboard/collaborations"
                  className="cursor-pointer text-[13px] font-medium text-[#2864f0]"
                >
                  See all
                </Link>
              </div>

              <div className="mt-5 overflow-hidden rounded-xl border border-[#e7ebf0]">
                <div className="grid grid-cols-[1.3fr_0.8fr_0.9fr_0.6fr] gap-3 border-b border-[#e7ebf0] bg-[#fafbfd] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#96a1b1]">
                  <span>Brand</span>
                  <span>Status</span>
                  <span>Next action</span>
                  <span>Due</span>
                </div>

                {activeCollaborations.length ? (
                  activeCollaborations.map((item) => (
                    <Link
                      key={item.id}
                      to="/dashboard/collaborations"
                      className="grid cursor-pointer grid-cols-[1.3fr_0.8fr_0.9fr_0.6fr] gap-3 border-b border-[#edf0f4] px-4 py-4 last:border-b-0 transition hover:bg-[#fafbfc]"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-[#334057]">
                          {item.brand_name}
                        </p>
                        <p className="mt-1 truncate text-[10px] text-[#8d99ab]">
                          {item.campaign_title}
                        </p>
                      </div>

                      <span className="text-[10px] font-semibold text-[#65738a]">
                        {item.status.replaceAll("_", " ")}
                      </span>

                      <span className="truncate text-[10px] text-[#8794aa]">
                        {item.status === "application_accepted"
                          ? "Submit content"
                          : item.status === "content_submitted"
                            ? "Await review"
                            : item.status === "content_approved"
                              ? "Complete"
                              : "In progress"}
                      </span>

                      <span className="text-[10px] text-[#8794aa]">
                        {item.due_at
                          ? new Date(item.due_at).toLocaleDateString()
                          : "—"}
                      </span>
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-12 text-center">
                    <p className="text-sm text-[#8995aa]">
                      No active collaborations.
                    </p>
                  </div>
                )}
              </div>
            </motion.section>
          </section>
        </>
      )}
    </div>
  );
}
