import { Activity, BarChart3, Eye, FileText, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAnalytics, type AnalyticsResponse } from "@/lib/dashboard";

type AnalyticsRange = "all" | "30d" | "90d";

const RANGE_OPTIONS: Array<{ value: AnalyticsRange; label: string }> = [
  { value: "all", label: "All time" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

const metrics = [
  { key: "posts", label: "Posts", icon: FileText },
  { key: "reach", label: "Reach", icon: Eye },
  { key: "engagements", label: "Engagements", icon: Activity },
  { key: "followers", label: "Followers", icon: Users },
] as const;

function parseRange(value: string | null): AnalyticsRange {
  return value === "30d" || value === "90d" ? value : "all";
}

export default function Analytics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [range, setRange] = useState<AnalyticsRange>(() =>
    parseRange(searchParams.get("range")),
  );
  const [data, setData] = useState<AnalyticsResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError("");

    void getAnalytics(range)
      .then(({ data: response }) => {
        if (!cancelled) {
          setData(response);
        }
      })
      .catch((value: unknown) => {
        if (!cancelled) {
          setError(
            value instanceof Error
              ? value.message
              : "Unable to load analytics.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [range]);

  const values = useMemo(
    () => ({
      posts: data?.summary.posts ?? 0,
      reach: data?.summary.reach ?? 0,
      engagements: data?.summary.engagements ?? 0,
      followers: data?.profile.followers ?? 0,
    }),
    [data],
  );

  const updateRange = (value: AnalyticsRange) => {
    setRange(value);

    const next = new URLSearchParams(searchParams);
    next.set("range", value);
    setSearchParams(next);
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
            Live performance from your connected profile data.
          </p>
        </div>

        <select
          value={range}
          onChange={(event) => updateRange(parseRange(event.target.value))}
          className="h-11 cursor-pointer rounded-xl border border-[#dce3ec] bg-white px-4 text-sm font-medium text-[#59667e] outline-none"
        >
          {RANGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-[#f1c7c7] bg-[#fff7f7] px-4 py-3 text-sm text-[#9b3e3e]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-7 flex items-center justify-center rounded-[22px] border border-[#e0e6ee] bg-white py-24">
          Loading analytics…
        </div>
      ) : (
        <>
          <section className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <div
                  key={metric.key}
                  className="rounded-[18px] border border-[#dfe5ed] bg-white p-5"
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
                    {values[metric.key].toLocaleString()}
                  </p>
                </div>
              );
            })}
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
                    className="rounded-xl border border-[#e5e9ef] p-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <p className="max-w-[700px] text-sm leading-6 text-[#334057]">
                        {post.text || "Published LinkedIn post"}
                      </p>

                      <span className="shrink-0 text-[11px] text-[#8d99ac]">
                        {new Date(post.published_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-5">
                      <Mini label="Impressions" value={post.impressions} />
                      <Mini label="Reach" value={post.reach} />
                      <Mini label="Likes" value={post.likes} />
                      <Mini label="Comments" value={post.comments} />
                      <Mini label="Reposts" value={post.reposts} />
                    </div>

                    {post.url && (
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex cursor-pointer text-xs font-semibold text-[#2864f0]"
                      >
                        Open post
                      </a>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[280px] items-center justify-center text-center">
                <div>
                  <BarChart3 className="mx-auto h-8 w-8 text-[#9aa6b8]" />
                  <p className="mt-4 text-sm font-semibold text-[#5d6a80]">
                    No post data yet
                  </p>
                  <p className="mt-1 max-w-md text-xs leading-5 text-[#8b97aa]">
                    Connected public post metrics will populate this section.
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
