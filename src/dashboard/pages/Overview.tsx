import {
  ArrowUpRight,
  Check,
  Copy,
  ExternalLink,
  Share2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
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

const stats = [
  {
    key: "impressions",
    label: "Public post reach",
    description: "View in analytics",
  },
  {
    key: "posts",
    label: "Public posts",
    description: "View in analytics",
  },
  {
    key: "engagements",
    label: "Public engagements",
    description: "View in analytics",
  },
  {
    key: "followers",
    label: "LinkedIn followers",
    description: "View in analytics",
  },
] as const;

function formatCurrency(
  amountCents: number,
  currency: string,
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: currency || "EUR",
      maximumFractionDigits: 0,
    },
  ).format(amountCents / 100);
}

function formatStatus(
  value: string,
) {
  return value
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

export default function Overview() {
  const navigate = useNavigate();
  const user = useAppSelector(
    (state) => state.auth.user,
  );

  const [dashboard, setDashboard] =
    useState<
      DashboardResponse["data"] | null
    >(null);
  const [campaigns, setCampaigns] =
    useState<Campaign[]>([]);
  const [collaborations, setCollaborations] =
    useState<Collaboration[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    void Promise.all([
      getDashboard(),
      getCampaigns(),
      getCollaborations(),
    ])
      .then(
        ([
          dashboardResult,
          campaignResult,
          collaborationResult,
        ]) => {
          if (cancelled) {
            return;
          }

          setDashboard(
            dashboardResult.data,
          );
          setCampaigns(
            campaignResult.data,
          );
          setCollaborations(
            collaborationResult.data,
          );
        },
      )
      .catch((value) => {
        if (cancelled) {
          return;
        }

        setError(
          value instanceof Error
            ? value.message
            : "Unable to load your overview.",
        );
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const profile = dashboard?.profile;

  const cardUrl = useMemo(
    () =>
      profile?.slug
        ? getPublicCardUrl(
            profile.slug,
          )
        : "",
    [profile?.slug],
  );

  const copyLink = async () => {
    if (!cardUrl) {
      toast.add({
        title: "Card link unavailable",
        description:
          "Publish your creator card before sharing it.",
        type: "warning",
        timeout: 3000,
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(
        cardUrl,
      );

      toast.add({
        title: "Card link copied",
        description:
          "Your public creator card link is ready to share.",
        type: "success",
        timeout: 2500,
      });
    } catch {
      toast.add({
        title: "Copy failed",
        description:
          "Your browser blocked clipboard access.",
        type: "error",
        timeout: 3500,
      });
    }
  };

  const shareCard = async () => {
    if (!cardUrl) {
      toast.add({
        title: "Card link unavailable",
        description:
          "Publish your creator card before sharing it.",
        type: "warning",
        timeout: 3000,
      });
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title:
            (profile?.name ??
              "Creator") +
            " on Naano",
          url: cardUrl,
        });

        toast.add({
          title: "Card shared",
          description:
            "Your public creator card was shared successfully.",
          type: "success",
          timeout: 2500,
        });
      } catch {
        return;
      }

      return;
    }

    await copyLink();
  };

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <section>
        <p className="text-[14px] font-medium text-[#5b7393]">
          Creator workspace
        </p>

        <h1 className="mt-2 text-[34px] font-semibold tracking-[-1.7px] text-[#111827]">
          Good to see you,{" "}
          {profile?.name ??
            user?.name ??
            "there"}
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

      <section className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(
          (stat, index) => {
            const value =
              dashboard?.metrics?.[
                stat.key
              ] ?? 0;

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
                  delay:
                    0.05 +
                    index * 0.06,
                }}
                whileHover={{
                  y: -4,
                  scale: 1.01,
                }}
                whileTap={{
                  scale: 0.995,
                }}
                onClick={() =>
                  navigate(
                    "/dashboard/analytics?metric=" +
                      stat.key,
                  )
                }
                className="min-h-[142px] cursor-pointer rounded-[18px] border border-[#e1e6ee] bg-white px-5 py-5 text-left shadow-[0_3px_12px_rgba(20,35,60,0.025)]"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b9bb3]">
                  {stat.label}
                </p>

                <p className="mt-5 text-[29px] font-semibold tracking-[-1px] text-[#172033]">
                  {value === 0 &&
                  stat.key ===
                    "impressions"
                    ? "—"
                    : value.toLocaleString()}
                </p>

                <p className="mt-1 text-[12px] text-[#8794aa]">
                  {stat.description}
                </p>
              </motion.button>
            );
          },
        )}
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
            delay: 0.28,
          }}
          whileHover={{
            y: -3,
          }}
          className="overflow-hidden rounded-[22px] border border-[#e1e6ee] bg-white shadow-[0_2px_8px_rgba(20,35,60,0.03)]"
        >
          <div className="flex items-start justify-between gap-4 p-6">
            <div>
              <h2 className="text-[18px] font-semibold text-[#111827]">
                Your creator card
              </h2>

              <p className="mt-1 max-w-[190px] text-[13px] leading-5 text-[#8490a5]">
                This is how brands discover your positioning.
              </p>
            </div>

            <div className="grid min-w-[158px] gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate(
                    "/dashboard/my-card",
                  )
                }
                className="h-10 w-full cursor-pointer justify-center rounded-lg"
              >
                <ExternalLink className="mr-2 h-3.5 w-3.5" />
                Open card
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  void copyLink()
                }
                className="h-10 w-full cursor-pointer justify-center rounded-lg"
              >
                <Copy className="mr-2 h-3.5 w-3.5" />
                Copy card link
              </Button>

              <Button
                type="button"
                onClick={() =>
                  void shareCard()
                }
                className="h-10 w-full cursor-pointer justify-center rounded-lg bg-[#2864f0] text-white hover:bg-[#1f58dc]"
              >
                <Share2 className="mr-2 h-3.5 w-3.5" />
                Share my card
              </Button>
            </div>
          </div>

          <div className="mx-6 mb-6 overflow-hidden rounded-[20px] border border-[#e0e4ec] bg-white">
            <div className="relative h-[90px] bg-gradient-to-br from-[#2864f0] via-[#356cf3] to-[#6d8df4]">
              <span className="absolute left-5 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[13px] font-bold text-[#2864f0]">
                in
              </span>

              <span className="absolute left-1/2 top-4 -translate-x-1/2 text-[24px] font-bold text-white">
                naano
              </span>

              <span className="absolute right-5 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[18px]">
                {profile?.country ===
                "India"
                  ? "🇮🇳"
                  : "🌐"}
              </span>

              <span className="absolute -bottom-10 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center overflow-hidden rounded-full border-4 border-[#2864f0] bg-[#6572cc] text-[34px] text-white">
                {profile?.profile_photo_url ? (
                  <img
                    src={
                      profile.profile_photo_url
                    }
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  profile?.name
                    ?.trim()
                    .split(/\s+/)
                    .filter(Boolean)
                    .map(
                      (value) =>
                        value[0],
                    )
                    .slice(0, 2)
                    .join("")
                    .toUpperCase() ??
                  "N"
                )}
              </span>
            </div>

            <div className="px-5 pb-6 pt-14 text-center">
              <h3 className="text-[23px] font-semibold text-[#111827]">
                {profile?.name ??
                  "Creator"}
              </h3>

              <p className="mt-1 text-[15px] text-[#8792a6]">
                {profile?.category ||
                  profile?.headline ||
                  "Creator"}
              </p>

              <p className="mt-6 text-[13px] leading-5 text-[#7f8a9d]">
                {profile?.headline ||
                  "Complete your creator card to help brands understand your positioning."}
              </p>
            </div>
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
            delay: 0.34,
          }}
          whileHover={{
            y: -3,
          }}
          className="rounded-[22px] border border-[#e1e6ee] bg-white shadow-[0_2px_8px_rgba(20,35,60,0.03)]"
        >
          <div className="flex items-start justify-between p-6">
            <div>
              <h2 className="text-[18px] font-semibold text-[#111827]">
                Your launch guide
              </h2>

              <p className="mt-1 text-[13px] text-[#8995aa]">
                {profile?.card_status ===
                "published"
                  ? "1 of 1 steps complete"
                  : "Complete your creator card to launch"}
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                navigate(
                  "/dashboard/my-card",
                )
              }
              className="h-9 cursor-pointer px-3 text-[13px] font-medium text-[#2864f0]"
            >
              Open card
            </Button>
          </div>

          <div className="px-6 pb-6 pt-12">
            <div className="flex items-center gap-5">
              <div
                className={
                  profile?.card_status ===
                  "published"
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
                  {profile?.card_status ===
                  "published"
                    ? "Your positioning and offer are ready."
                    : "Finish your card before sharing it."}
                </p>
              </div>

              <span className="rounded-full bg-[#e8f8ef] px-4 py-1.5 text-[11px] font-semibold text-[#15945a]">
                {profile?.card_status ===
                "published"
                  ? "Complete"
                  : "Pending"}
              </span>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  navigate(
                    "/dashboard/my-card",
                  )
                }
                className="h-10 w-10 cursor-pointer rounded-xl"
              >
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
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
            duration: 0.45,
            delay: 0.4,
          }}
          className="rounded-[22px] border border-[#dfe5ed] bg-white p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[17px] font-semibold text-[#182239]">
                Recommended opportunities
              </h2>

              <p className="mt-1 text-[12px] text-[#8b97aa]">
                Open campaigns currently available to creators.
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                navigate(
                  "/dashboard/opportunities",
                )
              }
              className="h-8 cursor-pointer px-2 text-[12px] font-semibold text-[#2864f0]"
            >
              Explore
            </Button>
          </div>

          <div className="mt-5 space-y-3">
            {campaigns.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#dfe5ed] bg-[#fafbfd] px-4 py-8 text-center">
                <p className="text-sm font-medium text-[#5f6e85]">
                  No open opportunities
                </p>

                <p className="mt-1 text-xs text-[#8b97aa]">
                  New campaigns will appear here when brands publish them.
                </p>
              </div>
            ) : (
              campaigns
                .slice(0, 3)
                .map((campaign) => (
                  <button
                    key={campaign.id}
                    type="button"
                    onClick={() =>
                      navigate(
                        "/dashboard/opportunities",
                      )
                    }
                    className="w-full cursor-pointer rounded-xl border border-[#e5e9ef] bg-[#fbfcfe] p-4 text-left transition hover:border-[#cfd8e6] hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8c98aa]">
                          {campaign.brand_name ??
                            "Brand"}
                        </p>

                        <h3 className="mt-1 truncate text-sm font-semibold text-[#2d3950]">
                          {campaign.title}
                        </h3>
                      </div>

                      <ArrowUpRight className="h-4 w-4 shrink-0 text-[#8794aa]" />
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="text-xs text-[#7d899f]">
                        {campaign.min_followers.toLocaleString()}+ followers
                      </span>

                      <span className="text-xs font-semibold text-[#2f3b52]">
                        {formatCurrency(
                          campaign.budget_cents,
                          campaign.currency,
                        )}
                      </span>
                    </div>
                  </button>
                ))
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
            duration: 0.45,
            delay: 0.46,
          }}
          className="rounded-[22px] border border-[#dfe5ed] bg-white p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[17px] font-semibold text-[#182239]">
                Active collaborations
              </h2>

              <p className="mt-1 text-[12px] text-[#8b97aa]">
                Everything currently moving from brief to publication.
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                navigate(
                  "/dashboard/collaborations",
                )
              }
              className="h-8 cursor-pointer px-2 text-[12px] font-semibold text-[#2864f0]"
            >
              See all
            </Button>
          </div>

          <div className="mt-5 overflow-x-auto">
            {collaborations.filter(
              (item) =>
                ![
                  "completed",
                  "declined",
                  "cancelled",
                ].includes(item.status),
            ).length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#dfe5ed] bg-[#fafbfd] px-4 py-10 text-center">
                <p className="text-sm text-[#7d899f]">
                  No active collaborations.
                </p>
              </div>
            ) : (
              <table className="w-full min-w-[650px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#e8ecf2]">
                    <th className="px-2 pb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8f9aab]">
                      Brand
                    </th>
                    <th className="px-2 pb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8f9aab]">
                      Status
                    </th>
                    <th className="px-2 pb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8f9aab]">
                      Next action
                    </th>
                    <th className="px-2 pb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8f9aab]">
                      Due
                    </th>
                    <th className="px-2 pb-3 text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8f9aab]">
                      Net
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {collaborations
                    .filter(
                      (item) =>
                        ![
                          "completed",
                          "declined",
                          "cancelled",
                        ].includes(
                          item.status,
                        ),
                    )
                    .slice(0, 5)
                    .map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-[#f0f2f5] last:border-b-0"
                      >
                        <td className="px-2 py-4">
                          <p className="max-w-[180px] truncate text-sm font-semibold text-[#334057]">
                            {item.brand_name}
                          </p>

                          <p className="mt-1 max-w-[180px] truncate text-[11px] text-[#8b97aa]">
                            {item.campaign_title}
                          </p>
                        </td>

                        <td className="px-2 py-4">
                          <span className="inline-flex rounded-full bg-[#f4f6f9] px-2.5 py-1 text-[10px] font-semibold text-[#65738a]">
                            {formatStatus(
                              item.status,
                            )}
                          </span>
                        </td>

                        <td className="px-2 py-4 text-xs text-[#6e7b90]">
                          {item.status ===
                          "application_accepted"
                            ? "Submit content"
                            : item.status ===
                                "content_submitted"
                              ? "Await approval"
                              : "Publish / complete"}
                        </td>

                        <td className="px-2 py-4 text-xs text-[#78859a]">
                          {item.due_at
                            ? new Date(
                                item.due_at,
                              ).toLocaleDateString()
                            : "—"}
                        </td>

                        <td className="px-2 py-4 text-right text-xs font-semibold text-[#2e3a51]">
                          {formatCurrency(
                            item.net_amount_cents,
                            item.currency,
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.section>
      </section>
    </div>
  );
}
