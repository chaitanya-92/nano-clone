import {
  Activity,
  BarChart3,
  CheckCircle2,
  Eye,
  FileText,
  RefreshCw,
  TriangleAlert,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getAnalytics, type AnalyticsResponse } from "@/lib/dashboard";
import { useSearchParams } from "react-router-dom";

const metrics = [
  { key: "posts", label: "Posts", icon: FileText },
  { key: "reach", label: "Reach", icon: Eye },
  { key: "engagements", label: "Engagements", icon: Activity },
  { key: "followers", label: "Followers", icon: Users },
] as const;

const providerLabels = {
  linkedin: "LinkedIn",
  x: "X",
} as const;

export default function Analytics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [range, setRange] = useState<"all" | "30d" | "90d">(
    searchParams.get("range") === "30d"
      ? "30d"
      : searchParams.get("range") === "90d"
        ? "90d"
        : "all",
  );
  const [data, setData] = useState<AnalyticsResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");

  const load = async (nextRange = range) => {
    setError("");
    try {
      const result = await getAnalytics(nextRange);
      setData(result.data);
    } catch (value) {
      setError(
        value instanceof Error ? value.message : "Unable to load analytics.",
      );
    }
  };

  useEffect(() => {
    setLoading(true);
    void load().finally(() => setLoading(false));
    // The range is the only external dependency for this request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const values = useMemo(
    () => ({
      posts: data?.summary.posts ?? 0,
      reach: data?.summary.reach ?? 0,
      engagements: data?.summary.engagements ?? 0,
      followers:
        data?.platforms.reduce(
          (total, platform) => total + platform.followers_count,
          0,
        ) ?? data?.profile.followers ?? 0,
    }),
    [data],
  );

  const updateRange = (value: "all" | "30d" | "90d") => {
    setRange(value);
    const next = new URLSearchParams(searchParams);
    next.set("range", value);
    setSearchParams(next);
  };

  const refresh = async () => {
    setSyncing(true);
    await load();
    setSyncing(false);
  };

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2864f0]">
            Performance
          </p>
          <h1 className="mt-2 text-[38px] font-semibold tracking-[-1.8px] text-[#141a29]">
            Analytics
          </h1>
          <p className="mt-1 text-[17px] text-[#74819a]">
            Live metrics pulled from your connected social accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={range}
            onChange={(event) =>
              updateRange(event.target.value as "all" | "30d" | "90d")
            }
            className="h-11 cursor-pointer rounded-xl border border-[#dce3ec] bg-white px-4 text-sm font-medium text-[#59667e] outline-none"
          >
            <option value="all">All time</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>

          <button
            type="button"
            onClick={() => void refresh()}
            disabled={syncing || loading}
            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-[#dce3ec] bg-white px-4 text-sm font-semibold text-[#59667e] transition hover:bg-[#f7f9fc] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
            Sync
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-[#f1c7c7] bg-[#fff7f7] px-4 py-3 text-sm text-[#9b3e3e]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-7 flex items-center justify-center rounded-[22px] border border-[#e0e6ee] bg-white py-24 text-sm text-[#7d899f]">
          Loading live analytics…
        </div>
      ) : (
        <>
          <section className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              const value = values[metric.key as keyof typeof values];

              return (
                <div
                  key={metric.key}
                  className="rounded-[18px] border border-[#dfe5ed] bg-white p-5 shadow-[0_3px_12px_rgba(20,35,60,0.025)]"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-[#77839a]">
                      {metric.label}
                    </p>
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eef4ff] text-[#2864f0]">
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-5 text-[28px] font-semibold tracking-[-1px] text-[#172033]">
                    {value.toLocaleString()}
                  </p>
                </div>
              );
            })}
          </section>

          <section className="mt-5 rounded-[22px] border border-[#dfe5ed] bg-white p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-[#182239]">
                  Connected platforms
                </h2>
                <p className="mt-1 text-xs text-[#8794aa]">
                  Each number below comes from the provider API, not an estimate.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              {(data?.platforms ?? []).map((platform) => {
                const status = data?.syncStatuses.find(
                  (item) => item.provider === platform.provider,
                );
                const synced = status?.status === "synced";

                return (
                  <div
                    key={platform.provider}
                    className="rounded-2xl border border-[#e4e9f0] bg-[#fbfcfe] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#1b2436]">
                          {providerLabels[platform.provider]}
                        </p>
                        <p className="mt-1 text-[11px] text-[#8794aa]">
                          {platform.last_synced_at
                            ? `Last synced ${new Date(platform.last_synced_at).toLocaleString()}`
                            : "Not synced yet"}
                        </p>
                      </div>
                      {synced ? (
                        <CheckCircle2 className="h-4 w-4 text-[#22a06b]" />
                      ) : (
                        <TriangleAlert className="h-4 w-4 text-[#c28a17]" />
                      )}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      <ProviderMetric label="Followers" value={platform.followers_count} />
                      <ProviderMetric label="Posts" value={platform.posts_count} />
                      <ProviderMetric label="Impressions" value={platform.impressions} />
                      <ProviderMetric label="Engagements" value={platform.engagements} />
                    </div>

                    {!synced && status?.message && (
                      <p className="mt-3 text-xs leading-5 text-[#8b6d2e]">
                        {status.message}
                      </p>
                    )}
                  </div>
                );
              })}

              {!data?.platforms.length && (
                <div className="rounded-2xl border border-dashed border-[#dfe5ed] p-6 text-sm text-[#7d899f] md:col-span-2">
                  Connect LinkedIn or X from Settings to start receiving provider analytics.
                </div>
              )}
            </div>
          </section>

          <section className="mt-5 rounded-[22px] border border-[#dfe5ed] bg-white p-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#2864f0]" />
              <h2 className="text-base font-semibold text-[#182239]">
                Recent posts
              </h2>
            </div>

            {data?.posts.length ? (
              <div className="mt-5 space-y-3">
                {data.posts.map((post) => (
                  <article
                    key={post.id}
                    className="rounded-xl border border-[#e5e9ef] p-4 transition hover:border-[#cfd8e6] hover:shadow-[0_5px_20px_rgba(20,35,60,0.04)]"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="rounded-full bg-[#eef4ff] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#2864f0]">
                          {post.platform}
                        </span>
                        <p className="truncate text-xs text-[#8b97aa]">
                          {new Date(post.published_at).toLocaleDateString()}
                        </p>
                      </div>
                      {post.url && (
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 text-xs font-semibold text-[#2864f0] hover:underline"
                        >
                          Open post
                        </a>
                      )}
                    </div>

                    <p className="mt-3 max-w-[850px] text-sm leading-6 text-[#334057]">
                      {post.text || `Published ${post.platform} post`}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-5">
                      <Mini label="Impressions" value={post.impressions} />
                      <Mini label="Reach" value={post.reach} />
                      <Mini label="Likes" value={post.likes} />
                      <Mini label="Comments" value={post.comments} />
                      <Mini label="Reposts" value={post.reposts} />
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[280px] items-center justify-center text-center">
                <div>
                  <BarChart3 className="mx-auto h-8 w-8 text-[#9aa6b8]" />
                  <p className="mt-4 text-sm font-semibold text-[#5d6a80]">
                    No provider post data available
                  </p>
                  <p className="mt-1 max-w-md text-xs leading-5 text-[#8b97aa]">
                    The page no longer treats missing provider data as zero. Connect the account and grant the required API access to populate real metrics.
                  </p>
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-[#f7f9fc] px-3 py-2">
      <p className="text-[9px] uppercase tracking-[0.08em] text-[#9aa5b5]">
        {label}
      </p>
      <p className="mt-1 text-xs font-semibold text-[#344059]">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function ProviderMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-white px-3 py-2">
      <p className="text-[9px] uppercase tracking-[0.08em] text-[#9aa5b5]">
        {label}
      </p>
      <p className="mt-1 text-xs font-semibold text-[#344059]">
        {value.toLocaleString()}
      </p>
    </div>
  );
}
