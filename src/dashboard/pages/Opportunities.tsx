import { ArrowUpRight, BriefcaseBusiness, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  applyToCampaign,
  getApplications,
  getCampaigns,
  type Campaign,
} from "@/lib/dashboard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function money(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default function Opportunities() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [applications, setApplications] = useState<
    Array<Record<string, unknown>>
  >([]);
  const [selected, setSelected] = useState<Campaign | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const [campaignResult, applicationResult] = await Promise.all([
        getCampaigns(),
        getApplications(),
      ]);

      setCampaigns(campaignResult.data);
      setApplications(applicationResult.data);
    } catch (value) {
      setError(
        value instanceof Error
          ? value.message
          : "Unable to load opportunities.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const submitApplication = async () => {
    if (!selected) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await applyToCampaign(selected.id, {
        message: message.trim(),
        proposedPriceCents: selected.budget_cents,
      });

      setSelected(null);
      setMessage("");
      await load();
    } catch (value) {
      setError(
        value instanceof Error
          ? value.message
          : "Unable to submit application.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2864f0]">
        Marketplace
      </p>

      <h1 className="mt-2 text-[38px] font-semibold tracking-[-1.8px] text-[#141a29]">
        Opportunities
      </h1>

      <p className="mt-1 max-w-[700px] text-[17px] text-[#74819a]">
        Find open campaigns and send applications directly from your workspace.
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
      ) : campaigns.length === 0 ? (
        <div className="mt-7 rounded-[22px] border border-[#e0e6ee] bg-white px-8 py-20 text-center">
          <BriefcaseBusiness className="mx-auto h-8 w-8 text-[#97a2b4]" />
          <h2 className="mt-4 text-lg font-semibold text-[#27344b]">
            No open campaigns
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7d899f]">
            Brands will appear here once they publish a campaign that is open
            for creators.
          </p>
        </div>
      ) : (
        <section className="mt-7 grid gap-4 lg:grid-cols-2">
          {campaigns.map((campaign) => {
            const applied = applications.some(
              (application) => application.campaign_id === campaign.id,
            );

            return (
              <article
                key={campaign.id}
                className="rounded-[22px] border border-[#dfe5ed] bg-white p-6 shadow-[0_4px_14px_rgba(32,52,82,0.035)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a97aa]">
                      {campaign.brand_name || "Brand"}
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-[#172033]">
                      {campaign.title}
                    </h2>
                  </div>

                  <span className="rounded-full bg-[#eef7f1] px-3 py-1.5 text-xs font-semibold text-[#198957]">
                    {campaign.status}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-[#6f7c92]">
                  {campaign.description}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#f7f9fc] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#909bad]">
                      Budget
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#253047]">
                      {money(campaign.budget_cents, campaign.currency)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#f7f9fc] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#909bad]">
                      Followers
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#253047]">
                      {campaign.min_followers.toLocaleString()}+
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-4">
                  <p className="text-xs text-[#8995aa]">
                    {campaign.application_deadline
                      ? "Deadline " +
                        new Date(
                          campaign.application_deadline,
                        ).toLocaleDateString()
                      : "Open until filled"}
                  </p>

                  <Button
                    type="button"
                    disabled={applied}
                    onClick={() => setSelected(campaign)}
                    className="cursor-pointer bg-[#171d2b] hover:bg-[#111827]"
                  >
                    {applied ? "Applied" : "Apply"}
                    {!applied && <ArrowUpRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </article>
            );
          })}
        </section>
      )}

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null);
            setMessage("");
          }
        }}
      >
        <DialogContent className="max-w-[620px]">
          <DialogHeader>
            <DialogTitle>Apply to {selected?.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-xl bg-[#f7f9fc] p-4">
              <p className="text-sm leading-6 text-[#66748a]">
                {selected?.brief || selected?.description}
              </p>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-[#626a78]">
                Message
              </span>

              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={5}
                placeholder="Tell the brand why you are a fit."
                className="auth-input resize-none"
              />
            </label>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => void submitApplication()}
                disabled={submitting}
                className="cursor-pointer bg-[#171d2b] hover:bg-[#111827]"
              >
                {submitting ? "Sending…" : "Send application"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
