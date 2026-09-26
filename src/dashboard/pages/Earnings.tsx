import {
  ArrowDownToLine,
  ArrowUpRight,
  Loader2,
  Plus,
  WalletCards,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  addPayoutMethod,
  getEarnings,
  getPayoutMethods,
  requestWithdrawal,
  type EarningsResponse,
  type PayoutMethod,
} from "@/lib/dashboard";

function money(cents: number, currency = "EUR") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default function Earnings() {
  const [data, setData] = useState<EarningsResponse["data"] | null>(null);
  const [methods, setMethods] = useState<PayoutMethod[]>([]);
  const [amount, setAmount] = useState("");
  const [label, setLabel] = useState("");
  const [showMethod, setShowMethod] = useState(false);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showWithdrawalSuccess, setShowWithdrawalSuccess] = useState(false);

  const load = async () => {
    setLoading(true);

    try {
      const [earningsResult, methodsResult] = await Promise.all([
        getEarnings(),
        getPayoutMethods(),
      ]);

      setData(earningsResult.data);
      setMethods(methodsResult.data);
      setSelectedMethodId(
        (current) => current ?? methodsResult.data[0]?.id ?? null,
      );
    } catch (value) {
      setError(
        value instanceof Error ? value.message : "Unable to load earnings.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const saveMethod = async () => {
    const value = label.trim();

    if (!value) {
      setError("Enter a name for the payout method.");
      return;
    }

    setBusy(true);

    try {
      await addPayoutMethod({
        type: "stripe",
        label: value,
      });

      setLabel("");
      setShowMethod(false);
      await load();
    } catch (value) {
      setError(
        value instanceof Error ? value.message : "Unable to add payout method.",
      );
    } finally {
      setBusy(false);
    }
  };

  const withdraw = async () => {
    const method =
      methods.find((item) => item.id === selectedMethodId) ?? methods[0];
    const value = Number.parseFloat(amount);

    if (!method) {
      setError("Add a payout method before requesting a withdrawal.");
      return;
    }

    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter a valid withdrawal amount.");
      return;
    }

    setBusy(true);

    try {
      await requestWithdrawal({
        payoutMethodId: method.id,
        amountCents: Math.round(value * 100),
      });

      setAmount("");
      setShowWithdrawalSuccess(true);
      await load();
    } catch (value) {
      setError(
        value instanceof Error
          ? value.message
          : "Unable to request withdrawal.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2864f0]">
        Payouts
      </p>

      <h1 className="mt-2 text-[38px] font-semibold tracking-[-1.8px] text-[#141a29]">
        Earnings
      </h1>

      <p className="mt-1 text-[17px] text-[#74819a]">
        Track your balances, activity and payout setup.
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
          <section className="mt-7 grid gap-4 md:grid-cols-3">
            <Summary
              label="Total earned"
              value={money(data?.summary.total_earned ?? 0)}
              icon={ArrowUpRight}
            />
            <Summary
              label="Available"
              value={money(data?.summary.available ?? 0)}
              icon={WalletCards}
            />
            <Summary
              label="Withdrawn"
              value={money(data?.summary.withdrawn ?? 0)}
              icon={ArrowDownToLine}
            />
          </section>

          <section className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_0.85fr]">
            <div className="rounded-[22px] border border-[#dfe5ed] bg-white p-6">
              <h2 className="text-base font-semibold text-[#182239]">
                Earnings activity
              </h2>

              <div className="mt-5 space-y-2">
                {data?.activity.length ? (
                  data.activity.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-2 rounded-xl border border-[#e7ebf0] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#334057]">
                          {item.description || item.type}
                        </p>

                        <p className="mt-1 text-[11px] text-[#8b97aa]">
                          {new Date(item.created_at).toLocaleString()}
                          {" · "}
                          {item.status}
                        </p>
                      </div>

                      <span
                        className={
                          item.amount_cents >= 0
                            ? "text-sm font-semibold text-[#198957]"
                            : "text-sm font-semibold text-[#b65a5a]"
                        }
                      >
                        {money(item.amount_cents, item.currency)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-16 text-center text-sm text-[#7d899f]">
                    No earnings activity yet.
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-[22px] border border-[#dfe5ed] bg-white p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-[#182239]">
                      Payout methods
                    </h2>

                    <p className="mt-1 text-xs text-[#8995aa]">
                      Manage where withdrawals should go.
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowMethod((value) => !value)}
                    className="cursor-pointer"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add UPI ID
                  </Button>
                </div>

                {showMethod && (
                  <div className="mt-4 space-y-3">
                    <input
                      value={label}
                      onChange={(event) => setLabel(event.target.value)}
                      placeholder="Enter UPI ID (e.g. name@upi)"
                      className="auth-input"
                    />

                    <Button
                      type="button"
                      onClick={() => void saveMethod()}
                      disabled={busy}
                      className="cursor-pointer bg-[#171d2b] hover:bg-[#111827]"
                    >
                      {busy ? "Saving…" : "Save UPI ID"}
                    </Button>
                  </div>
                )}

                <div className="mt-4 space-y-2">
                  {methods.map((method) => (
                    <div
                      key={method.id}
                      className="rounded-xl border border-[#e6eaf0] px-4 py-3"
                    >
                      <p className="text-sm font-semibold text-[#334057]">
                        {method.label}
                      </p>

                      <p className="mt-1 text-xs text-[#8b97aa]">
                        {method.type} · {method.status}
                      </p>
                    </div>
                  ))}

                  {!methods.length && !showMethod && (
                    <p className="py-5 text-xs text-[#8b97aa]">
                      No payout method added.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-[22px] border border-[#dfe5ed] bg-white p-6">
                <h2 className="text-base font-semibold text-[#182239]">
                  Request withdrawal
                </h2>

                <p className="mt-1 text-xs text-[#8995aa]">
                  Available: {money(data?.summary.available ?? 0)}
                </p>

                <input
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Amount"
                  className="auth-input mt-4"
                />

                <Button
                  type="button"
                  onClick={() => void withdraw()}
                  disabled={busy}
                  className="mt-3 w-full cursor-pointer bg-[#2864f0] hover:bg-[#1f58dc]"
                >
                  Request withdrawal
                </Button>
              </div>
            </div>
          </section>
        </>
      )}
      {showWithdrawalSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="withdrawal-success-title"
            className="w-full max-w-[430px] rounded-[24px] bg-white p-7 shadow-2xl"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef4ff] text-[#2864f0]">
              <ArrowUpRight className="h-6 w-6" />
            </div>

            <div className="mt-5 text-center">
              <h2
                id="withdrawal-success-title"
                className="text-[24px] font-semibold tracking-[-0.6px] text-[#172033]"
              >
                Withdrawal on the way
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#74819a]">
                Your withdrawal request has been submitted successfully. We’ll
                process it and send the funds to your saved UPI ID.
              </p>
            </div>

            <Button
              type="button"
              onClick={() => setShowWithdrawalSuccess(false)}
              className="mt-6 w-full cursor-pointer bg-[#2864f0] hover:bg-[#1f58dc]"
            >
              Done
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}

function Summary({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof WalletCards;
}) {
  return (
    <div className="rounded-[18px] border border-[#dfe5ed] bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#77839a]">{label}</p>

        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eef4ff] text-[#2864f0]">
          <Icon className="h-4 w-4" />
        </span>
      </div>

      <p className="mt-5 text-[28px] font-semibold tracking-[-1px] text-[#172033]">
        {value}
      </p>
    </div>
  );
}
