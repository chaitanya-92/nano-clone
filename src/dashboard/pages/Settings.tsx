import {
  AlertTriangle,
  Check,
  CreditCard,
  Link2,
  Loader2,
  Save,
  Trash2,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  addPayoutMethod,
  deleteAccount,
  getCreatorProfile,
  getPayoutMethods,
  updateCreatorProfile,
  type CreatorProfile,
  type PayoutMethod,
} from "@/lib/dashboard";
import { logout } from "@/lib/auth";
import { signOut } from "@/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const tabs = [
  {
    id: "profile",
    label: "Profile",
    icon: UserRound,
  },
  {
    id: "payments",
    label: "Payments",
    icon: CreditCard,
  },
  {
    id: "account",
    label: "Account",
    icon: AlertTriangle,
  },
] as const;

export default function Settings() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(
    (state) => state.auth.user,
  );
  const [tab, setTab] =
    useState<(typeof tabs)[number]["id"]>(
      "profile",
    );
  const [profile, setProfile] =
    useState<CreatorProfile | null>(null);
  const [methods, setMethods] =
    useState<PayoutMethod[]>([]);
  const [name, setName] = useState("");
  const [linkedinUrl, setLinkedinUrl] =
    useState("");
  const [xProfileUrl, setXProfileUrl] =
    useState("");
  const [methodLabel, setMethodLabel] =
    useState("");
  const [showMethod, setShowMethod] =
    useState(false);
  const [showDelete, setShowDelete] =
    useState(false);
  const [deleteConfirmation, setDeleteConfirmation] =
    useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void Promise.all([
      getCreatorProfile(),
      getPayoutMethods(),
    ])
      .then(([profileResult, payoutResult]) => {
        const creator = profileResult.data;

        setProfile(creator);
        setName(creator.name ?? "");
        setLinkedinUrl(
          creator.linkedin_url ?? "",
        );
        setXProfileUrl(
          creator.x_profile_url ?? "",
        );
        setMethods(payoutResult.data);
      })
      .catch((value) =>
        setError(
          value instanceof Error
            ? value.message
            : "Unable to load settings.",
        ),
      );
  }, []);

  const saveProfile = async () => {
    setBusy(true);
    setError("");
    setSaved(false);

    try {
      const { data } =
        await updateCreatorProfile({
          name: name.trim(),
          linkedinUrl:
            linkedinUrl.trim(),
          xProfileUrl:
            xProfileUrl.trim(),
        });

      setProfile(data);
      setName(data.name ?? "");
      setLinkedinUrl(
        data.linkedin_url ?? "",
      );
      setXProfileUrl(
        data.x_profile_url ?? "",
      );
      setSaved(true);

      window.setTimeout(
        () => setSaved(false),
        2000,
      );
    } catch (value) {
      setError(
        value instanceof Error
          ? value.message
          : "Unable to save profile.",
      );
    } finally {
      setBusy(false);
    }
  };

  const saveMethod = async () => {
    const value = methodLabel.trim();

    if (!value) {
      setError(
        "Enter a name for the payout method.",
      );
      return;
    }

    setBusy(true);
    setError("");

    try {
      const { data } =
        await addPayoutMethod({
          type: "stripe",
          label: value,
        });

      setMethods((current) => [
        data,
        ...current,
      ]);
      setMethodLabel("");
      setShowMethod(false);
    } catch (value) {
      setError(
        value instanceof Error
          ? value.message
          : "Unable to save payout method.",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmation !== "DELETE") {
      return;
    }

    setBusy(true);
    setError("");

    try {
      await deleteAccount();
      dispatch(signOut());
      await logout().catch(
        () => undefined,
      );
      navigate("/login", {
        replace: true,
      });
    } catch (value) {
      setError(
        value instanceof Error
          ? value.message
          : "Unable to delete your account.",
      );
      setBusy(false);
    }
  };

  if (!profile) {
    return (
      <div className="mx-auto w-full max-w-[1180px]">
        {error ? (
          <div className="rounded-xl border border-[#f1c7c7] bg-[#fff7f7] px-4 py-3 text-sm text-[#9b3e3e]">
            {error}
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-[22px] border border-[#e0e6ee] bg-white p-8 text-sm text-[#7d899f]">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading settings…
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2864f0]">
          Workspace
        </p>

        <h1 className="mt-2 text-[38px] font-semibold tracking-[-1.8px] text-[#141a29]">
          Settings
        </h1>

        <p className="mt-1 text-[17px] text-[#74819a]">
          Manage your profile, payments and
          account.
        </p>
      </section>

      {error && (
        <div className="mt-5 rounded-xl border border-[#f1c7c7] bg-[#fff7f7] px-4 py-3 text-sm text-[#9b3e3e]">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[200px_1fr]">
        <nav className="space-y-1">
          {tabs.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setTab(item.id)
                }
                className={
                  tab === item.id
                    ? "flex w-full cursor-pointer items-center gap-3 rounded-xl bg-[#eef4ff] px-4 py-3 text-left text-sm font-semibold text-[#2864f0]"
                    : "flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-[#64728a] hover:bg-[#f5f7fa]"
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <section className="rounded-[22px] border border-[#dfe5ed] bg-white p-7">
          {tab === "profile" && (
            <div>
              <div className="border-b border-[#e8ecf2] pb-5">
                <h2 className="text-xl font-semibold text-[#182239]">
                  Personal profile
                </h2>
                <p className="mt-1 text-sm text-[#7d899f]">
                  Manage the public profile information
                  connected to your creator card.
                </p>
              </div>

              <div className="space-y-6 pt-6">
                <div>
                  <label className="text-xs font-semibold text-[#626a78]">
                    Display name
                  </label>

                  <div className="mt-2 flex gap-2">
                    <input
                      value={name}
                      onChange={(event) =>
                        setName(
                          event.target.value,
                        )
                      }
                      className="auth-input flex-1"
                    />

                    <Button
                      type="button"
                      onClick={() =>
                        void saveProfile()
                      }
                      disabled={busy}
                      className="cursor-pointer bg-[#171d2b] hover:bg-[#111827]"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {saved
                        ? "Saved"
                        : "Save name"}
                    </Button>
                  </div>
                </div>

                <div className="border-t border-[#e8ecf2] pt-6">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-[#6d7a91]" />
                    <h3 className="text-base font-semibold text-[#182239]">
                      Social links
                    </h3>
                  </div>

                  <p className="mt-1 text-sm text-[#7d899f]">
                    Keep your public profile links
                    connected to your account.
                  </p>

                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-[#626a78]">
                        LinkedIn
                      </label>

                      <input
                        value={linkedinUrl}
                        onChange={(event) =>
                          setLinkedinUrl(
                            event.target.value,
                          )
                        }
                        className="auth-input mt-2"
                        placeholder="https://linkedin.com/in/your-profile"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#626a78]">
                        X
                      </label>

                      <input
                        value={xProfileUrl}
                        onChange={(event) =>
                          setXProfileUrl(
                            event.target.value,
                          )
                        }
                        className="auth-input mt-2"
                        placeholder="https://x.com/your-handle"
                      />
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        void saveProfile()
                      }
                      disabled={busy}
                      className="cursor-pointer"
                    >
                      Save social links
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "payments" && (
            <div>
              <div className="border-b border-[#e8ecf2] pb-5">
                <h2 className="text-xl font-semibold text-[#182239]">
                  Company and billing
                </h2>

                <p className="mt-1 text-sm text-[#7d899f]">
                  Manage payout methods used for
                  creator earnings.
                </p>
              </div>

              <div className="pt-6">
                <div className="rounded-2xl border border-[#e0e6ef] bg-[#f8fafc] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-[#28344b]">
                        Payout methods
                      </h3>

                      <p className="mt-1 text-xs text-[#8794aa]">
                        Saved payout destinations for
                        withdrawals.
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setShowMethod(
                          (value) => !value,
                        )
                      }
                      className="cursor-pointer"
                    >
                      Add
                    </Button>
                  </div>

                  {showMethod && (
                    <div className="mt-4 flex gap-2">
                      <input
                        value={methodLabel}
                        onChange={(event) =>
                          setMethodLabel(
                            event.target.value,
                          )
                        }
                        className="auth-input flex-1"
                        placeholder="Primary payout account"
                      />

                      <Button
                        type="button"
                        onClick={() =>
                          void saveMethod()
                        }
                        disabled={busy}
                        className="cursor-pointer bg-[#171d2b] hover:bg-[#111827]"
                      >
                        Save
                      </Button>
                    </div>
                  )}

                  <div className="mt-4 space-y-2">
                    {methods.length ? (
                      methods.map((method) => (
                        <div
                          key={method.id}
                          className="flex items-center justify-between rounded-xl border border-[#e2e8f0] bg-white px-4 py-3"
                        >
                          <div>
                            <p className="text-sm font-semibold text-[#344059]">
                              {method.label}
                            </p>

                            <p className="mt-1 text-xs text-[#8b97aa]">
                              {method.type} ·{" "}
                              {method.status}
                            </p>
                          </div>

                          <Check className="h-4 w-4 text-[#18945a]" />
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-[#e2e8f0] bg-white px-4 py-5 text-sm text-[#8b97aa]">
                        No payout method saved.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "account" && (
            <div>
              <div className="rounded-2xl border border-[#f0c9c9] bg-[#fff8f8] p-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#d34a4a]">
                    <Trash2 className="h-5 w-5" />
                  </span>

                  <div>
                    <h2 className="text-xl font-semibold text-[#d23838]">
                      Delete your account
                    </h2>

                    <p className="mt-2 max-w-[680px] text-sm leading-6 text-[#8d6262]">
                      Permanently delete your account
                      and associated workspace data.
                      This action cannot be undone.
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() =>
                    setShowDelete(true)
                  }
                  className="mt-5 cursor-pointer"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete my account
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>

      <Dialog
        open={showDelete}
        onOpenChange={(open) => {
          setShowDelete(open);

          if (!open) {
            setDeleteConfirmation("");
          }
        }}
      >
        <DialogContent className="max-w-[520px] border-[#eed0d0]">
          <DialogHeader>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1f1] text-[#d23838]">
              <Trash2 className="h-5 w-5" />
            </div>

            <DialogTitle className="text-xl text-[#1d2433]">
              Delete your account?
            </DialogTitle>

            <DialogDescription className="text-sm leading-6 text-[#6f7c92]">
              This permanently deletes your Naano
              account, creator profile, social account
              connections, campaigns, applications,
              messages, earnings records and other
              associated workspace data.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-[#f1d7d7] bg-[#fff8f8] p-4">
            <p className="text-xs leading-5 text-[#8a5d5d]">
              There is no undo after deletion. Make
              sure you have saved anything you need
              before continuing.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="delete-confirmation"
              className="text-xs font-semibold text-[#4f596b]"
            >
              Type DELETE to confirm
            </label>

            <input
              id="delete-confirmation"
              value={deleteConfirmation}
              onChange={(event) =>
                setDeleteConfirmation(
                  event.target.value,
                )
              }
              autoComplete="off"
              className="auth-input"
              placeholder="DELETE"
            />
          </div>

          <DialogFooter className="border-0 bg-transparent p-0 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setShowDelete(false)
              }
              disabled={busy}
              className="cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={() => void handleDelete()}
              disabled={
                busy ||
                deleteConfirmation !==
                  "DELETE"
              }
              className="cursor-pointer"
            >
              {busy && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {busy
                ? "Deleting..."
                : "Delete account permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
