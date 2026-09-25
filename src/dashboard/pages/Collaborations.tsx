import { ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getCollaborations,
  updateCollaboration,
  type Collaboration,
} from "@/lib/dashboard";

const tabs = [
  { id: "all", label: "All" },
  {
    id: "application_accepted",
    label: "Accepted",
  },
  {
    id: "content_submitted",
    label: "Content submitted",
  },
  {
    id: "content_approved",
    label: "Approved",
  },
  {
    id: "completed",
    label: "Completed",
  },
] as const;

function labelStatus(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function Collaborations() {
  const [items, setItems] = useState<Collaboration[]>([]);
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("all");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);

    try {
      const { data } = await getCollaborations();
      setItems(data);
    } catch (value) {
      setError(
        value instanceof Error
          ? value.message
          : "Unable to load collaborations.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(
    () => (tab === "all" ? items : items.filter((item) => item.status === tab)),
    [items, tab],
  );

  const advance = async (item: Collaboration) => {
    const transitions: Record<string, string | undefined> = {
      application_accepted: "content_submitted",
      content_submitted: "content_approved",
      content_approved: "completed",
    };

    const next = transitions[item.status];

    if (!next) {
      return;
    }

    setBusyId(item.id);

    try {
      await updateCollaboration(
        item.id,
        {
          status: next,
          publishedUrl: item.published_url,
        },
      );

      await load();
    } catch (value) {
      setError(
        value instanceof Error
          ? value.message
          : "Unable to update collaboration.",
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2864f0]">
        Delivery
      </p>

      <h1 className="mt-2 text-[38px] font-semibold tracking-[-1.8px] text-[#141a29]">
        Collaborations
      </h1>

      <p className="mt-1 text-[17px] text-[#74819a]">
        Track accepted work through each delivery state.
      </p>

      {error && (
        <div className="mt-5 rounded-xl border border-[#f1c7c7] bg-[#fff7f7] px-4 py-3 text-sm text-[#9b3e3e]">
          {error}
        </div>
      )}

      <div className="mt-7 flex flex-wrap gap-2 border-b border-[#e3e7ee] pb-3">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={
              tab === item.id
                ? "cursor-pointer rounded-full bg-[#171d2b] px-4 py-2 text-xs font-semibold text-white"
                : "cursor-pointer rounded-full border border-[#dce3ec] px-4 py-2 text-xs font-semibold text-[#68758b] hover:bg-[#f8fafc]"
            }
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-6 flex items-center justify-center rounded-[22px] border border-[#e0e6ee] bg-white py-24">
          <Loader2 className="h-5 w-5 animate-spin text-[#71809a]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-6 rounded-[22px] border border-[#e0e6ee] bg-white px-8 py-20 text-center">
          <h2 className="text-lg font-semibold text-[#27344b]">
            No collaborations here
          </h2>

          <p className="mt-2 text-sm text-[#7d899f]">
            Accepted campaign work will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="rounded-[20px] border border-[#dfe5ed] bg-white p-5"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b97ab]">
                    {item.brand_name}
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-[#1b2437]">
                    {item.campaign_title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#74819a]">
                    {item.brief || "No additional brief has been added."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <Metric label="Status" value={labelStatus(item.status)} />
                  <Metric
                    label="Impressions"
                    value={item.impressions.toLocaleString()}
                  />
                  <Metric
                    label="Engagements"
                    value={item.engagements.toLocaleString()}
                  />
                  <Metric
                    label="Earned"
                    value={"€" + (item.net_amount_cents / 100).toLocaleString()}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.published_url && (
                    <a
                      href={item.published_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex cursor-pointer items-center rounded-lg border border-[#dce3ec] px-3 py-2 text-xs font-semibold text-[#59667e]"
                    >
                      <ExternalLink className="mr-2 h-3.5 w-3.5" />
                      Post
                    </a>
                  )}

                  {item.status !== "completed" && (
                    <Button
                      type="button"
                      onClick={() => void advance(item)}
                      disabled={busyId === item.id}
                      className="cursor-pointer bg-[#171d2b] hover:bg-[#111827]"
                    >
                      {busyId === item.id
                        ? "Saving…"
                        : item.status === "application_accepted"
                          ? "Mark submitted"
                          : item.status === "content_submitted"
                            ? "Approve"
                            : "Complete"}
                    </Button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#f7f9fc] px-3 py-2 text-center">
      <p className="text-[9px] uppercase tracking-[0.08em] text-[#98a2b3]">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-[#2a354b]">{value}</p>
    </div>
  );
}
