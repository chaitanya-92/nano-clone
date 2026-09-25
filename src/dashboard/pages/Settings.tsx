import {
  AlertTriangle,
  Check,
  CircleAlert,
  CreditCard,
  Link2,
  Loader2,
  RefreshCw,
  Save,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
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
  connectSocial,
  deleteAccount,
  getCreatorProfile,
  getPayoutMethods,
  updateCreatorProfile,
  type CreatorProfile,
  type PayoutMethod,
} from "@/lib/dashboard";
import {
  getCurrentUser,
  logout,
} from "@/lib/auth";
import { signOut } from "@/features/authSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "@/store/hooks";

type Tab =
  | "profile"
  | "payments"
  | "account";

type SocialProvider =
  | "linkedin"
  | "x";

type SocialStatus =
  | "idle"
  | "valid"
  | "verifying"
  | "verified"
  | "invalid";

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

function validateSocialUrl(
  provider: SocialProvider,
  value: string,
) {
  const normalized = value.trim();

  if (!normalized) {
    return "";
  }

  let url: URL;

  try {
    url = new URL(normalized);
  } catch {
    return "Enter a valid profile URL.";
  }

  const hostname = url.hostname
    .toLowerCase()
    .replace(/^www\./, "");

  if (url.protocol !== "https:") {
    return "Use an HTTPS profile URL.";
  }

  if (provider === "linkedin") {
    const validHost =
      hostname === "linkedin.com";
    const validPath =
      /^\/in\/[A-Za-z0-9][A-Za-z0-9._-]*$/.test(
        url.pathname.replace(/\/$/, ""),
      );

    if (!validHost || !validPath) {
      return "Enter a valid LinkedIn profile URL.";
    }
  }

  if (provider === "x") {
    const validHost = [
      "x.com",
      "twitter.com",
    ].includes(hostname);
    const validPath =
      /^\/[A-Za-z0-9_]{1,15}$/.test(
        url.pathname.replace(/\/$/, ""),
      );

    if (!validHost || !validPath) {
      return "Enter a valid X profile URL.";
    }
  }

  return "";
}

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

  const [initialLinkedinUrl, setInitialLinkedinUrl] =
    useState("");

  const [initialXProfileUrl, setInitialXProfileUrl] =
    useState("");

  const [methodLabel, setMethodLabel] =
    useState("");

  const [showMethod, setShowMethod] =
    useState(false);

  const [showDelete, setShowDelete] =
    useState(false);

  const [deleteConfirmation, setDeleteConfirmation] =
    useState("");

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

  const [socialStatus, setSocialStatus] =
    useState<
      Record<
        SocialProvider,
        SocialStatus
      >
    >({
      linkedin: "idle",
      x: "idle",
    });

  const [socialError, setSocialError] =
    useState<
      Record<
        SocialProvider,
        string
      >
    >({
      linkedin: "",
      x: "",
    });

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    void Promise.all([
      getCurrentUser(),
      getCreatorProfile(),
    ])
      .then(
        ([
          userResult,
          profileResult,
        ]) => {
          if (cancelled) {
            return;
          }

          const creator =
            profileResult.data;

          setProfile(creator);
          setName(
            creator.name ?? "",
          );
          setLinkedinUrl(
            creator.linkedin_url ??
              "",
          );
          setXProfileUrl(
            creator.x_profile_url ??
              "",
          );
          setInitialLinkedinUrl(
            creator.linkedin_url ??
              "",
          );
          setInitialXProfileUrl(
            creator.x_profile_url ??
              "",
          );

          if (
            creator.linkedin_url
          ) {
            setSocialStatus(
              (current) => ({
                ...current,
                linkedin:
                  validateSocialUrl(
                    "linkedin",
                    creator.linkedin_url,
                  )
                    ? "invalid"
                    : "valid",
              }),
            );
          }

          if (
            creator.x_profile_url
          ) {
            setSocialStatus(
              (current) => ({
                ...current,
                x: validateSocialUrl(
                  "x",
                  creator.x_profile_url,
                )
                  ? "invalid"
                  : "valid",
              }),
            );
          }

          setError(
            userResult.user?.role ===
              "creator"
              ? ""
              : "These settings are configured for creator accounts.",
          );
        },
      )
      .catch((value) => {
        if (cancelled) {
          return;
        }

        setError(
          value instanceof Error
            ? value.message
            : "Unable to load settings.",
        );
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
      paymentsLoaded ||
      loadingPayments
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
    loadingPayments,
  ]);

  const saveChanges = async () => {
    const trimmedName =
      name.trim();
    const trimmedLinkedin =
      linkedinUrl.trim();
    const trimmedX =
      xProfileUrl.trim();

    if (!trimmedName) {
      setError(
        "Display name is required.",
      );
      return;
    }

    const linkedinValidation =
      validateSocialUrl(
        "linkedin",
        trimmedLinkedin,
      );

    const xValidation =
      validateSocialUrl(
        "x",
        trimmedX,
      );

    if (
      linkedinValidation ||
      xValidation
    ) {
      setSocialError({
        linkedin:
          linkedinValidation,
        x: xValidation,
      });

      if (linkedinValidation) {
        setSocialStatus(
          (current) => ({
            ...current,
            linkedin: "invalid",
          }),
        );
      }

      if (xValidation) {
        setSocialStatus(
          (current) => ({
            ...current,
            x: "invalid",
          }),
        );
      }

      setError(
        "Please fix the highlighted social link before saving.",
      );
      return;
    }

    setBusy(true);
    setSaved(false);
    setError("");

    try {
      const { data } =
        await updateCreatorProfile({
          name: trimmedName,
          linkedinUrl:
            trimmedLinkedin,
          xProfileUrl:
            trimmedX,
        });

      setProfile(data);
      setName(
        data.name ?? trimmedName,
      );
      setLinkedinUrl(
        data.linkedin_url ??
          trimmedLinkedin,
      );
      setXProfileUrl(
        data.x_profile_url ??
          trimmedX,
      );
      setInitialLinkedinUrl(
        data.linkedin_url ??
          trimmedLinkedin,
      );
      setInitialXProfileUrl(
        data.x_profile_url ??
          trimmedX,
      );

      setSocialError({
        linkedin: "",
        x: "",
      });

      setSocialStatus({
        linkedin:
          data.linkedin_url
            ? "valid"
            : "idle",
        x: data.x_profile_url
          ? "valid"
          : "idle",
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
          : "Unable to save settings.",
      );
    } finally {
      setBusy(false);
    }
  };

  const verifySocial = async (
    provider: SocialProvider,
  ) => {
    const value =
      provider === "linkedin"
        ? linkedinUrl
        : xProfileUrl;

    const validationError =
      validateSocialUrl(
        provider,
        value,
      );

    if (validationError) {
      setSocialStatus(
        (current) => ({
          ...current,
          [provider]: "invalid",
        }),
      );
      setSocialError(
        (current) => ({
          ...current,
          [provider]:
            validationError,
        }),
      );
      return;
    }

    if (!value.trim()) {
      return;
    }

    setBusy(true);
    setSocialStatus(
      (current) => ({
        ...current,
        [provider]:
          "verifying",
      }),
    );
    setSocialError(
      (current) => ({
        ...current,
        [provider]: "",
      }),
    );
    setError("");

    try {
      await connectSocial(
        provider,
        value.trim(),
      );

      const { data } =
        await getCreatorProfile();

      setProfile(data);
      setName(
        data.name ?? "",
      );
      setLinkedinUrl(
        data.linkedin_url ?? "",
      );
      setXProfileUrl(
        data.x_profile_url ?? "",
      );
      setInitialLinkedinUrl(
        data.linkedin_url ?? "",
      );
      setInitialXProfileUrl(
        data.x_profile_url ?? "",
      );

      setSocialStatus(
        (current) => ({
          ...current,
          [provider]:
            "verified",
        }),
      );
    } catch (value) {
      setSocialStatus(
        (current) => ({
          ...current,
          [provider]: "invalid",
        }),
      );

      setSocialError(
        (current) => ({
          ...current,
          [provider]:
            value instanceof Error
              ? value.message
              : "The public profile could not be refreshed.",
        }),
      );
    } finally {
      setBusy(false);
    }
  };

  const savePayoutMethod =
    async () => {
      const label =
        methodLabel.trim();

      if (!label) {
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
            label,
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
            : "Unable to add payout method.",
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
        <div className="rounded-[22px] border border-[#f1c7c7] bg-[#fff7f7] px-5 py-4 text-sm text-[#9b3e3e]">
          {error ||
            "Creator settings are unavailable."}
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
          Manage your profile,
          payments and account.
        </p>
      </section>

      {authUser &&
        authUser.role !==
          "creator" && (
          <div className="mt-5 rounded-xl border border-[#f0d7a6] bg-[#fffaf0] px-4 py-3 text-sm text-[#8a6a2d]">
            These settings are currently configured for creator accounts.
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
                    : "flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-[#64728a] transition hover:bg-[#f5f7fa]"
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
                  Manage the public profile information connected to your creator card.
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
                    onChange={(event) =>
                      setName(
                        event.target
                          .value,
                      )
                    }
                    className="auth-input mt-2"
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
                    Save the links separately from profile refresh. A refresh may fail when a platform blocks automated public-page access.
                  </p>

                  <div className="mt-5 space-y-5">
                    <SocialField
                      label="LinkedIn"
                      provider="linkedin"
                      value={linkedinUrl}
                      status={socialStatus.linkedin}
                      error={socialError.linkedin}
                      busy={busy}
                      placeholder="https://linkedin.com/in/your-profile"
                      onChange={(value) =>
                        setLinkedinUrl(
                          value,
                        )
                      }
                      onVerify={() =>
                        void verifySocial(
                          "linkedin",
                        )
                      }
                    />

                    <SocialField
                      label="X"
                      provider="x"
                      value={xProfileUrl}
                      status={socialStatus.x}
                      error={socialError.x}
                      busy={busy}
                      placeholder="https://x.com/your-handle"
                      onChange={(value) =>
                        setXProfileUrl(
                          value,
                        )
                      }
                      onVerify={() =>
                        void verifySocial(
                          "x",
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end border-t border-[#e8ecf2] pt-5">
                <Button
                  type="button"
                  onClick={() =>
                    void saveChanges()
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
                    : "Save changes"}
                </Button>
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
                            (current) =>
                              !current,
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
                      <div className="mt-4 flex gap-2">
                        <input
                          value={methodLabel}
                          onChange={(event) =>
                            setMethodLabel(
                              event.target
                                .value,
                            )
                          }
                          className="auth-input flex-1"
                          placeholder="Primary payout account"
                        />

                        <Button
                          type="button"
                          onClick={() =>
                            void savePayoutMethod()
                          }
                          disabled={
                            busy ||
                            !methodLabel.trim()
                          }
                          className="cursor-pointer bg-[#171d2b] hover:bg-[#111827]"
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Save method
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
                                  {method.type} ·{" "}
                                  {
                                    method.status
                                  }
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
                      Permanently delete your account and associated workspace data. This action cannot be undone.
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
            setDeleteConfirmation(
              "",
            );
          }
        }}
      >
        <DialogContent className="max-w-[520px]">
          <DialogHeader>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1f1] text-[#d23838]">
              <Trash2 className="h-5 w-5" />
            </div>

            <DialogTitle className="text-xl">
              Delete your account?
            </DialogTitle>

            <DialogDescription className="text-sm leading-6 text-[#6f7c92]">
              This permanently deletes your Naano account and associated workspace data. There is no undo.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-[#f1d7d7] bg-[#fff8f8] p-4">
            <p className="text-xs leading-5 text-[#8a5d5d]">
              Type DELETE below to enable the permanent deletion action.
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
              value={deleteConfirmation}
              onChange={(event) =>
                setDeleteConfirmation(
                  event.target
                    .value,
                )
              }
              autoComplete="off"
              className="auth-input"
              placeholder="DELETE"
            />
          </div>

          <DialogFooter className="border-0 bg-transparent p-0">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setShowDelete(
                  false,
                )
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
              className="cursor-pointer"
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
  status,
  error,
  busy,
  placeholder,
  onChange,
  onVerify,
}: {
  label: string;
  provider: SocialProvider;
  value: string;
  status: SocialStatus;
  error: string;
  busy: boolean;
  placeholder: string;
  onChange: (value: string) => void;
  onVerify: () => void;
}) {
  const validationError =
    validateSocialUrl(
      provider,
      value,
    );

  const statusLabel =
    status === "verifying"
      ? "Verifying…"
      : status === "verified"
        ? "Verified"
        : status === "invalid"
          ? "Invalid"
          : status === "valid"
            ? "Valid"
            : "";

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label className="text-xs font-semibold text-[#626a78]">
          {label}
        </label>

        {statusLabel && (
          <span
            className={
              status ===
              "verified"
                ? "text-[11px] font-semibold text-[#18945a]"
                : status ===
                    "invalid"
                  ? "text-[11px] font-semibold text-[#c24d4d]"
                  : "text-[11px] font-medium text-[#7d899f]"
            }
          >
            {statusLabel}
          </span>
        )}
      </div>

      <div className="mt-2 flex gap-2">
        <div className="relative flex-1">
          <input
            value={value}
            onChange={(event) => {
              onChange(
                event.target
                  .value,
              );
            }}
            className={
              "auth-input pr-10 " +
              (validationError ||
              error
                ? "border-[#df6b6b] focus:border-[#df6b6b]"
                : "")
            }
            placeholder={placeholder}
          />

          {status ===
            "verified" && (
            <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#18945a]" />
          )}

          {status ===
            "invalid" && (
            <X className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d34a4a]" />
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onVerify}
          disabled={
            busy ||
            !value.trim() ||
            Boolean(validationError)
          }
          className="cursor-pointer whitespace-nowrap"
        >
          {status ===
          "verifying" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Verify & refresh
        </Button>
      </div>

      {(validationError ||
        error) && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-[#c24d4d]">
          <CircleAlert className="h-3.5 w-3.5" />
          {error ||
            validationError}
        </p>
      )}
    </div>
  );
}
