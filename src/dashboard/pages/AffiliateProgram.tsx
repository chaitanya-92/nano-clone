import { Copy, Link2, Loader2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  createReferral,
  getAffiliate,
  type AffiliateResponse,
} from "@/lib/dashboard";

function referralUrl(code: string) {
  return window.location.origin + "/register?ref=" + code;
}

export default function AffiliateProgram() {
  const [data, setData] = useState<AffiliateResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const { data: response } = await getAffiliate();
      setData(response);
    } catch (value) {
      setError(
        value instanceof Error
          ? value.message
          : "Unable to load affiliate data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const createLink = async (type: "creator" | "brand") => {
    setBusy(true);

    try {
      await createReferral(type);
      await load();
    } catch (value) {
      setError(
        value instanceof Error
          ? value.message
          : "Unable to create referral link.",
      );
    } finally {
      setBusy(false);
    }
  };

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(referralUrl(code));

      setCopied(code);

      toast.add({
        title: "Referral link copied",
        description: "Your referral link is ready to share.",
        type: "success",
        timeout: 2200,
      });

      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      toast.add({
        title: "Copy failed",
        description: "Your browser did not allow clipboard access.",
        type: "error",
        timeout: 2600,
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2864f0]">
        Growth
      </p>

      <h1 className="mt-2 text-[38px] font-semibold tracking-[-1.8px] text-[#141a29]">
        Affiliate program
      </h1>

      <p className="mt-1 text-[17px] text-[#74819a]">
        Create referral links and track the introductions connected to your
        account.
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
          <section className="mt-7 grid gap-5 md:grid-cols-2">
            <InviteCard
              icon={Users}
              title="Invite creators"
              description="Create a referral URL for a creator."
              onClick={() => void createLink("creator")}
              busy={busy}
            />

            <InviteCard
              icon={Link2}
              title="Invite brands"
              description="Create a referral URL for a company."
              onClick={() => void createLink("brand")}
              busy={busy}
            />
          </section>

          <section className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="rounded-[22px] border border-[#dfe5ed] bg-white p-6">
              <h2 className="text-base font-semibold text-[#182239]">
                Referral links
              </h2>

              <div className="mt-4 space-y-2">
                {data?.referrals.length ? (
                  data.referrals.map((referral) => {
                    const code = String(referral.code ?? "");

                    return (
                      <div
                        key={String(referral.id)}
                        className="rounded-xl border border-[#e6eaf0] p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-[#334057]">
                              {String(referral.type)} referral
                            </p>

                            <p className="mt-1 text-xs text-[#8b97aa]">
                              {code}
                            </p>
                          </div>

                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => void copy(code)}
                            className="cursor-pointer"
                          >
                            <Copy className="mr-2 h-3.5 w-3.5" />
                            {copied === code ? "Copied" : "Copy"}
                          </Button>
                        </div>

                        <p className="mt-3 break-all rounded-lg bg-[#f7f9fc] px-3 py-2 text-[11px] text-[#63728a]">
                          {referralUrl(code)}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="py-12 text-center text-sm text-[#8b97aa]">
                    No referral links yet.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-[22px] border border-[#dfe5ed] bg-white p-6">
              <h2 className="text-base font-semibold text-[#182239]">
                Rewards
              </h2>

              <div className="mt-4 space-y-2">
                {data?.rewards.length ? (
                  data.rewards.map((reward) => (
                    <div
                      key={String(reward.id)}
                      className="flex items-center justify-between rounded-xl border border-[#e6eaf0] px-4 py-3"
                    >
                      <span className="text-sm text-[#56647b]">
                        {String(reward.status ?? "pending")}
                      </span>

                      <span className="text-sm font-semibold text-[#1a8b57]">
                        €{" "}
                        {(
                          Number(reward.amount_cents ?? 0) / 100
                        ).toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="py-12 text-center text-sm text-[#8b97aa]">
                    No rewards yet.
                  </p>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function InviteCard({
  icon: Icon,
  title,
  description,
  onClick,
  busy,
}: {
  icon: typeof Users;
  title: string;
  description: string;
  onClick: () => void;
  busy: boolean;
}) {
  return (
    <div className="rounded-[22px] border border-[#dfe5ed] bg-white p-6">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef4ff] text-[#2864f0]">
        <Icon className="h-5 w-5" />
      </span>

      <h2 className="mt-5 text-lg font-semibold text-[#182239]">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-[#77839a]">{description}</p>

      <Button
        type="button"
        onClick={onClick}
        disabled={busy}
        className="mt-5 cursor-pointer bg-[#171d2b] hover:bg-[#111827]"
      >
        Create link
      </Button>
    </div>
  );
}
