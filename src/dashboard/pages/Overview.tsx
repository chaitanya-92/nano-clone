import {
  ArrowUpRight,
  Check,
  Copy,
  ExternalLink,
  Share2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import {
  getDashboard,
  getPublicCardUrl,
  type DashboardResponse,
} from "@/lib/dashboard";

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

export default function Overview() {
  const navigate = useNavigate();
  const user = useAppSelector(
    (state) => state.auth.user,
  );
  const [dashboard, setDashboard] =
    useState<DashboardResponse["data"] | null>(
      null,
    );
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    void getDashboard()
      .then(({ data }) => setDashboard(data))
      .catch((value) =>
        setError(
          value instanceof Error
            ? value.message
            : "Unable to load your dashboard.",
        ),
      );
  }, []);

  const profile = dashboard?.profile;

  const cardUrl = useMemo(
    () =>
      profile?.slug
        ? getPublicCardUrl(profile.slug)
        : "",
    [profile?.slug],
  );

  const copyLink = async () => {
    if (!cardUrl) {
      return;
    }

    await navigator.clipboard.writeText(
      cardUrl,
    );
    setCopied(true);

    window.setTimeout(
      () => setCopied(false),
      1800,
    );
  };

  const shareCard = async () => {
    if (!cardUrl) {
      return;
    }

    if (navigator.share) {
      await navigator
        .share({
          title:
            (profile?.name ?? "Creator") +
            " on Naano",
          url: cardUrl,
        })
        .catch(() => undefined);

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
          {profile?.name ?? user?.name ?? "there"}
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
        {stats.map((stat) => {
          const value =
            dashboard?.metrics?.[stat.key] ?? 0;

          return (
            <button
              key={stat.key}
              type="button"
              onClick={() =>
                navigate(
                  "/dashboard/analytics?metric=" +
                    stat.key,
                )
              }
              className="cursor-pointer rounded-[18px] border border-[#e1e6ee] bg-white px-5 py-5 text-left shadow-[0_3px_12px_rgba(20,35,60,0.025)] transition hover:-translate-y-0.5 hover:border-[#cfd7e3]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b9bb3]">
                {stat.label}
              </p>

              <p className="mt-5 text-[29px] font-semibold tracking-[-1px] text-[#172033]">
                {stat.key === "impressions" &&
                value === 0
                  ? "—"
                  : value.toLocaleString()}
              </p>

              <p className="mt-1 text-[12px] text-[#8794aa]">
                {stat.description}
              </p>
            </button>
          );
        })}
      </section>

      <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[410px_1fr]">
        <div className="overflow-hidden rounded-[22px] border border-[#e1e6ee] bg-white shadow-[0_2px_8px_rgba(20,35,60,0.03)]">
          <div className="flex items-start justify-between gap-4 p-6">
            <div>
              <h2 className="text-[18px] font-semibold text-[#111827]">
                Your creator card
              </h2>

              <p className="mt-1 max-w-[190px] text-[13px] leading-5 text-[#8490a5]">
                This is how brands discover
                your positioning.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                to="/dashboard/my-card"
                className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#dce3ec] px-3 text-[12px] text-[#60708a] transition hover:bg-[#f8fafc]"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open card
              </Link>

              <Button
                type="button"
                variant="outline"
                onClick={() => void copyLink()}
                disabled={!cardUrl}
                className="h-9 cursor-pointer rounded-lg border-[#dce3ec] px-3 text-[12px] text-[#60708a]"
              >
                <Copy className="h-3.5 w-3.5" />
                {copied
                  ? "Copied"
                  : "Copy card link"}
              </Button>

              <Button
                type="button"
                onClick={() => void shareCard()}
                disabled={!cardUrl}
                className="h-9 cursor-pointer rounded-lg bg-[#2864f0] px-3 text-[12px] text-white hover:bg-[#1f58dc]"
              >
                <Share2 className="h-3.5 w-3.5" />
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
                {profile?.country === "India"
                  ? "🇮🇳"
                  : "🌐"}
              </span>

              <span className="absolute -bottom-10 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center overflow-hidden rounded-full border-4 border-[#2864f0] bg-[#6572cc] text-[34px] text-white">
                {profile?.profile_photo_url ? (
                  <img
                    src={profile.profile_photo_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  profile?.name
                    ?.split(" ")
                    .map(
                      (value) =>
                        value[0],
                    )
                    .slice(0, 1)
                    .join("") ?? "N"
                )}
              </span>
            </div>

            <div className="px-5 pb-6 pt-14 text-center">
              <h3 className="text-[23px] font-semibold text-[#111827]">
                {profile?.name ?? "Creator"}
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
        </div>

        <div className="rounded-[22px] border border-[#e1e6ee] bg-white shadow-[0_2px_8px_rgba(20,35,60,0.03)]">
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

              <Link
                to="/dashboard/my-card"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#dce3ec] text-[#65738a]"
              >
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
