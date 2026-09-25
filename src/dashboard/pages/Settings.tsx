import {
  AlertTriangle,
  Check,
  CreditCard,
  Link2,
  Loader2,
  Save,
  Trash2,
  UserRound,
  X,
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

type Tab =
  | "profile"
  | "payments"
  | "account";

type SocialProvider =
  | "linkedin"
  | "x";

function validateSocialUrl(
  provider: SocialProvider,
  value: string,
) {
  const normalized = value.trim();

  if (!normalized) {
    return "";
  }

  try {
    const url = new URL(normalized);
    const hostname = url.hostname
      .toLowerCase()
      .replace(/^www\./, "");
    const pathname = url.pathname
      .replace(/\/$/, "");

    if (url.protocol !== "https:") {
      return "Use an HTTPS profile URL.";
    }

    if (
      provider === "linkedin" &&
      (
        hostname !== "linkedin.com" ||
        !/^\/in\/[A-Za-z0-9][A-Za-z0-9._-]*$/.test(
          pathname,
        )
      )
    ) {
      return "Enter a valid LinkedIn profile URL.";
    }

    if (
      provider === "x" &&
      (
        !["x.com", "twitter.com"].includes(
          hostname,
        ) ||
        !/^\/[A-Za-z0-9_]{1,15}$/.test(
          pathname,
        )
      )
    ) {
      return "Enter a valid X profile URL.";
    }

    return "";
  } catch {
    return "Enter a valid profile URL.";
  }
}

const tabs: Array<{
  id: Tab;
  label: string;
  icon: typeof UserRound;
}> = [
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
];

export default function Settings() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authUser = useAppSelector(
    (state) => state.auth.user,
  );

  const [tab, setTab] =
    useState<Tab>("profile");

  const [profile, setProfile] =
    useState<CreatorProfile | null>(
      null,
    );

  const [methods, setMethods] =
    useState<PayoutMethod[]>([]);

  const [name, setName] =
    useState("");

  const [linkedinUrl, setLinkedinUrl] =
    useState("");

  const [xProfileUrl, setXProfileUrl] =
    useState("");

  const [socialErrors, setSocialErrors] =
    useState({
      linkedin: "",
      x: "",
    });

  const [loadingProfile, setLoadingProfile] =
    useState(true);

  const [loadingPayments, setLoadingPayments] =
    useState(false);

  const [paymentsLoaded, setPaymentsLoaded] =
    useState(false);

  const [busy, setBusy] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [methodLabel, setMethodLabel] =
    useState("");

  const [showMethod, setShowMethod] =
    useState(false);

  const [showDelete, setShowDelete] =
    useState(false);

  const [
    deleteConfirmation,
    setDeleteConfirmation,
  ] = useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    void getCreatorProfile()
      .then(({ data }) => {
        if (cancelled) {
          return;
        }

        setProfile(data);
        setName(data.name ?? "");
        setLinkedinUrl(
          data.linkedin_url ?? "",
        );
        setXProfileUrl(
          data.x_profile_url ?? "",
        );
      })
      .catch((value) => {
        if (!cancelled) {
          setError(
            value instanceof Error
              ? value.message
              : "Unable to load creator settings.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingProfile(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (
      tab !== "payments" ||
      paymentsLoaded
    ) {
      return;
    }

    setLoadingPayments(true);

    void getPayoutMethods()
      .then(({ data }) => {
        setMethods(data);
        setPaymentsLoaded(true);
      })
      .catch((value) => {
        setError(
          value instanceof Error
            ? value.message
            : "Unable to load payout methods.",
        );
      })
      .finally(() => {
        setLoadingPayments(false);
      });
  }, [
    tab,
    paymentsLoaded,
  ]);

  const saveProfileChanges =
    async () => {
      const nameValue =
        name.trim();

      const linkedinValue =
        linkedinUrl.trim();

      const xValue =
        xProfileUrl.trim();

      const linkedinError =
        validateSocialUrl(
          "linkedin",
          linkedinValue,
        );

      const xError =
        validateSocialUrl(
          "x",
          xValue,
        );

      setSocialErrors({
        linkedin:
          linkedinError,
        x: xError,
      });

      if (!nameValue) {
        setError(
          "Display name is required.",
        );
        return;
      }

      if (
        linkedinError ||
        xError
      ) {
        setError(
          "Fix the highlighted profile links before saving.",
        );
        return;
      }

      setBusy(true);
      setError("");
      setSaved(false);

      try {
        const { data } =
          await updateCreatorProfile({
            name: nameValue,
            linkedinUrl:
              linkedinValue,
            xProfileUrl:
              xValue,
          });

        setProfile(data);
        setName(
          data.name ?? nameValue,
        );
        setLinkedinUrl(
          data.linkedin_url ??
            linkedinValue,
        );
        setXProfileUrl(
          data.x_profile_url ??
            xValue,
        );
        setSocialErrors({
          linkedin: "",
          x: "",
        });
        setSaved(true);

        window.setTimeout(
          () => setSaved(false),
          1800,
        );
      } catch (value) {
        setError(
          value instanceof Error
            ? value.message
            : "Unable to save profile changes.",
        );
      } finally {
        setBusy(false);
      }
    };

  const saveMethod =
    async () => {
      const value =
        methodLabel.trim();

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

        setMethods(
          (current) => [
            data,
            ...current,
          ],
        );
        setMethodLabel("");
        setShowMethod(false);
        setPaymentsLoaded(true);
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

  const handleDelete =
    async () => {
      if (
        deleteConfirmation !==
        "DELETE"
      ) {
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

  if (loadingProfile) {
    return (
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="flex items-center gap-2 rounded-[22px] border border-[#e0e6ee] bg-white p-8 text-sm text-[#7d899f]">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading settings…
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="rounded-xl border border-[#f1c7c7] bg-[#fff7f7] px-4 py-3 text-sm text-[#9b3e3e]">
          {error ||
            "Creator settings are unavailable for this account."}
        </div>
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
          Manage your profile, payments and account.
        </p>
      </section>

      {authUser &&
        authUser.role !== "creator" && (
          <div className="mt-5 rounded-xl border border-[#f0d7a6] bg-[#fffaf0] px-4 py-3 text-sm text-[#8a6a2d]">
            These settings are currently configured
            for creator accounts.
          </div>
        )}

      {error && (
        <div className="mt-5 rounded-xl border border-[#f1c7c7] bg-[#fff7f7] px-4 py-3 text-sm text-[#9b3e3e]">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[200px_1fr]">
        <nav className="space-y-1">
          {tabs.map((item) => {
            const Icon =
              item.icon;

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

              <div className="space-y-7 pt-6">
                <div>
                  <label
                    htmlFor="display-name"
                    className="text-xs font-semibold text-[#626a78]"
                  >
                    Display name
                  </label>

                  <input
                    id="display-name"
                    value={name}
                    onChange={(event) => {
                      setName(
                        event.target.value,
                      );
                      setSaved(false);
                    }}
                    className="auth-input mt-2 w-full"
                    placeholder="Your display name"
                  />
                </div>

                <div className="border-t border-[#e8ecf2] pt-6">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-[#6d7a91]" />

                    <h3 className="text-base font-semibold text-[#182239]">
                      Social links
                    </h3>
                  </div>

                  <p className="mt-1 text-sm text-[#7d899f]">
                    Store your public profile links. They
                    remain saved even when a social platform
                    limits server-side profile access.
                  </p>

                  <div className="mt-5 space-y-5">
                    <SocialField
                      label="LinkedIn"
                      provider="linkedin"
                      value={linkedinUrl}
                      error={
                        socialErrors.linkedin
                      }
                      onChange={(value) => {
                        setLinkedinUrl(
                          value,
                        );
                        setSocialErrors(
                          (current) => ({
                            ...current,
                            linkedin:
                              "",
                          }),
                        );
                        setSaved(false);
                      }}
                    />

                    <SocialField
                      label="X"
                      provider="x"
                      value={xProfileUrl}
                      error={
                        socialErrors.x
                      }
                      onChange={(value) => {
                        setXProfileUrl(
                          value,
                        );
                        setSocialErrors(
                          (current) => ({
                            ...current,
                            x: "",
                          }),
                        );
                        setSaved(false);
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-end border-t border-[#e8ecf2] pt-5">
                  <Button
                    type="button"
                    onClick={() =>
                      void saveProfileChanges()
                    }
                    disabled={busy}
                    className="cursor-pointer bg-[#171d2b] px-5 hover:bg-[#111827]"
                  >
                    {busy ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}

                    {saved
                      ? "Saved"
                      : busy
                        ? "Saving…"
                        : "Save changes"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {tab === "payments" && (
            <div>
              <div className="border-b border-[#e8ecf2] pb-5">
                <h2 className="text-xl font-semibold text-[#182239]">
                  Payments
                </h2>

                <p className="mt-1 text-sm text-[#7d899f]">
                  Manage saved payout methods for creator earnings.
                </p>
              </div>

              <div className="pt-6">
                {loadingPayments ? (
                  <div className="flex items-center gap-2 rounded-2xl border border-[#e0e6ef] bg-[#f8fafc] p-5 text-sm text-[#7d899f]">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading payout methods…
                  </div>
                ) : (
                  <div className="rounded-2xl border border-[#e0e6ef] bg-[#f8fafc] p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-base font-semibold text-[#28344b]">
                          Payout methods
                        </h3>

                        <p className="mt-1 text-xs text-[#8794aa]">
                          Saved payout destinations for withdrawals.
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setShowMethod(
                            (value) =>
                              !value,
                          )
                        }
                        className="cursor-pointer"
                      >
                        {showMethod
                          ? "Cancel"
                          : "Add payout method"}
                      </Button>
                    </div>

                    {showMethod && (
                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
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
                          disabled={
                            busy ||
                            !methodLabel.trim()
                          }
                          className="cursor-pointer bg-[#171d2b] hover:bg-[#111827]"
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                      </div>
                    )}

                    <div className="mt-4 space-y-2">
                      {methods.length ? (
                        methods.map(
                          (method) => (
                            <div
                              key={
                                method.id
                              }
                              className="flex items-center justify-between rounded-xl border border-[#e2e8f0] bg-white px-4 py-3"
                            >
                              <div>
                                <p className="text-sm font-semibold text-[#344059]">
                                  {method.label}
                                </p>

                                <p className="mt-1 text-xs text-[#8b97aa]">
                                  {method.type} · {method.status}
                                </p>
                              </div>

                              <Check className="h-4 w-4 text-[#18945a]" />
                            </div>
                          ),
                        )
                      ) : (
                        <div className="rounded-xl border border-[#e2e8f0] bg-white px-4 py-5 text-sm text-[#8b97aa]">
                          No payout method saved.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "account" && (
            <div>
              <div className="rounded-2xl border border-[#efcaca] bg-[#fff8f8] p-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#d34a4a]">
                    <Trash2 className="h-5 w-5" />
                  </span>

                  <div>
                    <h2 className="text-xl font-semibold text-[#cf3737]">
                      Delete your account
                    </h2>

                    <p className="mt-2 max-w-[680px] text-sm leading-6 text-[#8d6262]">
                      Permanently delete your account and
                      associated workspace data. This action
                      cannot be undone.
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() =>
                    setShowDelete(true)
                  }
                  className="mt-5 cursor-pointer bg-[#d83f3f] px-5 text-white hover:bg-[#bd3535]"
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
              account and associated workspace data.
              This cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-[#f1d7d7] bg-[#fff8f8] p-4">
            <p className="text-xs leading-5 text-[#8a5d5d]">
              Type DELETE below to confirm the
              permanent deletion.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="delete-confirmation"
              className="text-xs font-semibold text-[#4f596b]"
            >
              Confirmation
            </label>

            <input
              id="delete-confirmation"
              value={
                deleteConfirmation
              }
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
              onClick={() =>
                void handleDelete()
              }
              disabled={
                busy ||
                deleteConfirmation !==
                  "DELETE"
              }
              className="cursor-pointer bg-[#d83f3f] px-4 text-white hover:bg-[#bd3535]"
            >
              {busy && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              {busy
                ? "Deleting…"
                : "Delete account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SocialField({
  label,
  provider,
  value,
  error,
  onChange,
}: {
  label: string;
  provider: SocialProvider;
  value: string;
  error: string;
  onChange: (value: string) => void;
}) {
  const validationError =
    validateSocialUrl(
      provider,
      value,
    );

  const fieldError =
    error || validationError;

  const hasValidValue =
    Boolean(value.trim()) &&
    !fieldError;

  return (
    <div>
      <div className="flex items-center justify-between">
        <label
          htmlFor={
            provider +
            "-profile-url"
          }
          className="text-xs font-semibold text-[#626a78]"
        >
          {label}
        </label>

        {hasValidValue && (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-[#18945a]">
            <Check className="h-3.5 w-3.5" />
            Valid
          </span>
        )}
      </div>

      <div className="relative mt-2">
        <input
          id={
            provider +
            "-profile-url"
          }
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value,
            )
          }
          className={
            "auth-input pr-10 " +
            (fieldError
              ? "border-[#df6b6b] focus:border-[#df6b6b]"
              : "")
          }
          placeholder={
            provider ===
            "linkedin"
              ? "https://linkedin.com/in/your-profile"
              : "https://x.com/your-handle"
          }
        />

        {fieldError ? (
          <X className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d34a4a]" />
        ) : hasValidValue ? (
          <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#18945a]" />
        ) : null}
      </div>

      {fieldError && (
        <p className="mt-2 text-xs text-[#c24d4d]">
          {fieldError}
        </p>
      )}
    </div>
  );
}
