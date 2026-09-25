import {
  ArrowUpRight,
  ExternalLink,
  Loader2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCommunity,
  type CommunityResponse,
} from "@/lib/dashboard";

export default function Community() {
  const [data, setData] =
    useState<CommunityResponse["data"] | null>(
      null,
    );
  const [loading, setLoading] =
    useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void getCommunity()
      .then(({ data: response }) =>
        setData(response),
      )
      .catch((value) =>
        setError(
          value instanceof Error
            ? value.message
            : "Unable to load community.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2864f0]">
        Creator network
      </p>

      <h1 className="mt-2 text-[38px] font-semibold tracking-[-1.8px] text-[#141a29]">
        Community
      </h1>

      <p className="mt-1 max-w-[720px] text-[17px] text-[#74819a]">
        Discover public creator activity and
        open public cards.
      </p>

      {error && (
        <div className="mt-5 rounded-xl border border-[#f1c7c7] bg-[#fff7f7] px-4 py-3 text-sm text-[#9b3e3e]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-7 flex items-center justify-center rounded-[22px] border border-[#e0e6ee] bg-white py-24">
          <Loader2 className="h-5 w-5 animate-spin text-[#71809a]" />
        </div>
      ) : (
        <>
          <section className="mt-7 rounded-[22px] border border-[#dfe5ed] bg-white">
            <div className="flex items-center justify-between border-b border-[#e6eaf0] px-6 py-5">
              <div>
                <h2 className="text-base font-semibold text-[#182239]">
                  Community leaderboard
                </h2>

                <p className="mt-1 text-xs text-[#8b97aa]">
                  Public profile metrics across the
                  creator network.
                </p>
              </div>

              <Users className="h-5 w-5 text-[#6f7c92]" />
            </div>

            {data?.leaderboard.length ? (
              data.leaderboard.map(
                (creator, index) => (
                  <div
                    key={creator.id}
                    className="flex flex-col gap-4 border-b border-[#edf0f4] px-6 py-5 last:border-b-0 md:flex-row md:items-center"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-sm font-semibold text-[#2864f0]">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-[#27344b]">
                        {creator.name}
                      </h3>

                      <p className="mt-1 truncate text-xs text-[#8a96aa]">
                        {creator.headline ||
                          "Creator"}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Mini
                        label="Followers"
                        value={creator.followers}
                      />
                      <Mini
                        label="Impressions"
                        value={creator.impressions}
                      />
                      <Mini
                        label="Posts"
                        value={creator.post_count}
                      />
                    </div>

                    {creator.slug && (
                      <Link
                        to={
                          "/creator/" +
                          creator.slug
                        }
                        className="inline-flex cursor-pointer items-center rounded-lg border border-[#dce3ec] px-3 py-2 text-xs font-semibold text-[#59667e]"
                      >
                        View card
                        <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                ),
              )
            ) : (
              <div className="px-6 py-20 text-center">
                <p className="text-sm text-[#7d899f]">
                  No creator data available yet.
                </p>
              </div>
            )}
          </section>

          <section className="mt-5 rounded-[22px] border border-[#dce5ef] bg-[#f7faff] p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#2864f0]">
                <ExternalLink className="h-4 w-4" />
              </span>

              <div>
                <h2 className="text-sm font-semibold text-[#253047]">
                  Public creator cards
                </h2>

                <p className="mt-1 text-xs leading-5 text-[#74819a]">
                  Each published creator card has a
                  public URL that can be opened without
                  signing in.
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function Mini({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="min-w-[84px] rounded-lg bg-[#f7f9fc] px-3 py-2 text-center">
      <p className="text-[9px] uppercase tracking-[0.08em] text-[#9aa5b5]">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-[#344059]">
        {value.toLocaleString()}
      </p>
    </div>
  );
}
