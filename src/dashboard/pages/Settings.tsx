import {
  AlertTriangle,
  Check,
  CreditCard,
  ExternalLink,
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
  getSocialAccounts,
  updateCreatorProfile,
  type CreatorProfile,
  type PayoutMethod,
  type SocialAccount,
} from "@/lib/dashboard";
import { connectSocial } from "@/lib/onboarding";
import { logout } from "@/lib/auth";
import { signOut } from "@/features/authSlice";
import { useAppDispatch } from "@/store/hooks";

type Tab =
  | "profile"
  | "payments"
  | "account";

type SocialProvider =
  | "linkedin"
  | "x";

type SocialField = {
  url: string;
  status:
    | "idle"
    | "checking"
    | "valid"
    | "invalid";
  message: string;
};

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
  if (!value.trim()) {
    return "";
  }

  try {
    const url = new URL(
      value.trim(),
    );

    if (url.protocol !== "https:") {
      return "Use an HTTPS profile URL.";
    }

    const hostname =
      url.hostname
        .toLowerCase()
        .replace(/^www\./, "");

    const pathname =
      url.pathname.replace(
        /\/+$/,
        "",
      );

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

export default function Settings() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
  const [initialName, setInitialName] =
    useState("");

  const [linkedin, setLinkedin] =
    useState<SocialField>({
      url: "",
      status: "idle",
      message: "",
    });
  const [initialLinkedin, setInitialLinkedin] =
    useState("");

  const [xProfile, setXProfile] =
    useState<SocialField>({
      url: "",
      status: "idle",
      message: "",
    });
  const [initialX, setInitialX] =
    useState("");

  const [loading, setLoading] =
    useState(true);
  const [loadingPayments, setLoadingPayments] =
    useState(false);
  const [paymentsLoaded, setPaymentsLoaded] =
    useState(false);
  const [saving, setSaving] =
    useState(false);
  const [addingMethod, setAddingMethod] =
    useState(false);
  const [methodLabel, setMethodLabel] =
    useState("");

  const [saved, setSaved] =
    useState(false);
  const [error, setError] =
    useState("");

  const [showDelete, setShowDelete] =
    useState(false);
  const [deleteConfirmation, setDeleteConfirmation] =
    useState("");
  const [deleting, setDeleting] =
    useState(false);

  useEffect(() => {
    let cancelled = false;

    void getCreatorProfile()
      .then(({ data }) => {
        if (cancelled) {
          return;
        }

        setProfile(data);
        setName(data.name ?? "");
        setInitialName(data.name ?? "");

        const linkedinUrl =
          data.linkedin_url ?? "";
        const xUrl =
          data.x_profile_url ?? "";

        setLinkedin({
          url: linkedinUrl,
          status: linkedinUrl
            ? "valid"
            : "idle",
          message: linkedinUrl
            ? "Saved profile link."
            : "",
        });
        setInitialLinkedin(
          linkedinUrl,
        );

        setXProfile({
          url: xUrl,
          status: xUrl
            ? "valid"
            : "idle",
          message: xUrl
            ? "Saved profile link."
            : "",
        });
        setInitialX(xUrl);
      })
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
          setLoading(false);
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
  }, [tab, paymentsLoaded]);

  const hasChanges =
    name.trim() !== initialName ||
    linkedin.url.trim() !==
      initialLinkedin ||
    xProfile.url.trim() !==
      initialX;

  const saveChanges = async () => {
    const nextName =
      name.trim();
    const nextLinkedin =
      linkedin.url.trim();
    const nextX =
      xProfile.url.trim();

    if (!nextName) {
      setError(
        "Display name is required.",
      );
      return;
    }

    const linkedinError =
      validateSocialUrl(
        "linkedin",
        nextLinkedin,
      );
    const xError =
      validateSocialUrl(
        "x",
        nextX,
      );

    if (linkedinError) {
      setLinkedin((current) => ({
        ...current,
        status: "invalid",
        message: linkedinError,
      }));
      setError("");
      return;
    }

    if (xError) {
      setXProfile((current) => ({
        ...current,
        status: "invalid",
        message: xError,
      }));
      setError("");
      return;
    }

    setSaving(true);
    setError("");
    setSaved(false);

    try {
      if (
        nextLinkedin !==
        initialLinkedin
      ) {
        setLinkedin((current) => ({
          ...current,
          status: "checking",
          message:
            "Checking public LinkedIn profile…",
        }));

        const result =
          await connectSocial(
            "linkedin",
            nextLinkedin,
          );

        setLinkedin({
          url:
            result.data.profileUrl ??
            nextLinkedin,
          status: "valid",
          message:
            result.data.fetchedProfile
              ? "Profile verified and refreshed."
              : "Profile link saved.",
        });
      }

      if (
        nextX !==
        initialX
      ) {
        setXProfile((current) => ({
          ...current,
          status: "checking",
          message:
            "Checking public X profile…",
        }));

        const result =
          await connectSocial(
            "x",
            nextX,
          );

        setXProfile({
          url:
            result.data.profileUrl ??
            nextX,
          status: "valid",
          message:
            result.data.fetchedProfile
              ? "Profile verified and refreshed."
              : "Profile link saved.",
        });
      }

      const { data } =
        await updateCreatorProfile({
          name: nextName,
          linkedinUrl:
            nextLinkedin,
          xProfileUrl:
            nextX,
        });

      setProfile(data);
      setName(
        data.name ?? nextName,
      );
      setInitialName(
        data.name ?? nextName,
      );

      const savedLinkedin =
        data.linkedin_url ??
        nextLinkedin;
      const savedX =
        data.x_profile_url ??
        nextX;

      setLinkedin({
        url: savedLinkedin,
        status: savedLinkedin
          ? "valid"
          : "idle",
        message: savedLinkedin
          ? "Saved profile link."
          : "",
      });
      setInitialLinkedin(
        savedLinkedin,
      );

      setXProfile({
        url: savedX,
        status: savedX
          ? "valid"
          : "idle",
        message: savedX
          ? "Saved profile link."
          : "",
      });
      setInitialX(savedX);
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

      setLinkedin((current) => ({
        ...current,
        status:
          current.url &&
          current.message.includes(
            "Checking",
          )
            ? "invalid"
            : current.status,
      }));

      setXProfile((current) => ({
        ...current,
        status:
          current.url &&
          current.message.includes(
            "Checking",
          )
            ? "invalid"
            : current.status,
      }));
    } finally {
      setSaving(false);
    }
  };

  const addMethod = async () => {
    const value =
      methodLabel.trim();

    if (!value) {
      setError(
        "Enter a payout method name.",
      );
      return;
    }

    setAddingMethod(true);
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
    } catch (value) {
      setError(
        value instanceof Error
          ? value.message
          : "Unable to add payout method.",
      );
    } finally {
      setAddingMethod(false);
    }
  };

  const handleDelete =
    async () => {
      if (
        deleteConfirmation
          .trim()
          .toUpperCase() !==
        "DELETE"
      ) {
        return;
      }

      setDeleting(true);
      setError("");

      try {
        await deleteAccount();
        await logout().catch(
          () => undefined,
        );
        dispatch(signOut());

        navigate("/login", {
          replace: true,
        });
      } catch (value) {
        setError(
          value instanceof Error
            ? value.message
            : "Unable to delete your account.",
        );
        setDeleting(false);
      }
    };

  if (loading) {
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
          Manage your profile, payments and account.
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
            <>
              <div className="border-b border-[#e8ecf2] pb-5">
                <h2 className="text-xl font-semibold text-[#182239]">
                  Personal profile
                </h2>

                <p className="mt-1 text-sm text-[#7d899f]">
                  Keep your account identity and public
                  social links in sync.
                </p>
              </div>

              <div className="space-y-8 pt-6">
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
                    className="auth-input mt-2"
                  />
                </div>

                <div className="border-t border-[#e8ecf2] pt-7">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-[#6d7a91]" />

                    <h3 className="text-base font-semibold text-[#182239]">
                      Social links
                    </h3>
                  </div>

                  <p className="mt-1 text-sm text-[#7d899f]">
                    Use public profile links. They are
                    validated before the changes are saved.
                  </p>

                  <div className="mt-5 space-y-5">
                    <SocialField
                      id="linkedin-url"
                      label="LinkedIn"
                      provider="linkedin"
                      value={linkedin}
                      onChange={(url) =>
                        setLinkedin({
                          url,
                          status: "idle",
                          message: "",
                        })
                      }
                    />

                    <SocialField
                      id="x-url"
                      label="X"
                      provider="x"
                      value={xProfile}
                      onChange={(url) =>
                        setXProfile({
                          url,
                          status: "idle",
                          message: "",
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end border-t border-[#e8ecf2] pt-6">
                  <Button
                    type="button"
                    onClick={() =>
                      void saveChanges()
                    }
                    disabled={
                      saving ||
                      !hasChanges
                    }
                    className="cursor-pointer bg-[#171d2b] hover:bg-[#111827]"
                  >
                    {saving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : saved ? (
                      <Check className="mr-2 h-4 w-4" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    {saving
                      ? "Saving…"
                      : saved
                        ? "Saved"
                        : "Save changes"}
                  </Button>
                </div>
              </div>
            </>
          )}

          {tab === "payments" && (
            <>
              <div className="border-b border-[#e8ecf2] pb-5">
                <h2 className="text-xl font-semibold text-[#182239]">
                  Payments
                </h2>

                <p className="mt-1 text-sm text-[#7d899f]">
                  Manage your saved payout methods.
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
                          Saved payout destinations for
                          withdrawals.
                        </p>
                      </div>

                      {!methodLabel && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            setMethodLabel(
                              "Primary payout account",
                            )
                          }
                          className="cursor-pointer"
                        >
                          Add method
                        </Button>
                      )}
                    </div>

                    {methodLabel && (
                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <input
                          value={methodLabel}
                          onChange={(event) =>
                            setMethodLabel(
                              event.target.value,
                            )
                          }
                          className="auth-input flex-1"
                          placeholder="Payout account name"
                        />

                        <Button
                          type="button"
                          onClick={() =>
                            void addMethod()
                          }
                          disabled={
                            addingMethod ||
                            !methodLabel.trim()
                          }
                          className="cursor-pointer bg-[#171d2b] hover:bg-[#111827]"
                        >
                          {addingMethod ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="mr-2 h-4 w-4" />
                          )}
                          Save
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            setMethodLabel("")
                          }
                          disabled={addingMethod}
                          className="cursor-pointer"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}

                    <div className="mt-4 space-y-2">
                      {methods.length ? (
                        methods.map(
                          (method) => (
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
            </>
          )}

          {tab === "account" && (
            <>
              <div className="rounded-2xl border border-[#efc7c7] bg-[#fff8f8] p-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#d23838]">
                    <Trash2 className="h-5 w-5" />
                  </span>

                  <div>
                    <h2 className="text-xl font-semibold text-[#d23838]">
                      Delete your account
                    </h2>

                    <p className="mt-2 max-w-[700px] text-sm leading-6 text-[#8d6262]">
                      Permanently delete your Naano
                      account and associated workspace
                      data. This cannot be undone.
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
            </>
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
        <DialogContent className="!max-w-[520px] border-[#ecd1d1] p-6">
          <DialogHeader>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff0f0] text-[#d23838]">
              <Trash2 className="h-5 w-5" />
            </div>

            <DialogTitle>
              Delete your account?
            </DialogTitle>

            <DialogDescription className="leading-6">
              This permanently deletes your account
              and associated workspace data. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-[#f0d4d4] bg-[#fff8f8] px-4 py-3">
            <p className="text-xs leading-5 text-[#8a5d5d]">
              Type DELETE below to enable the
              confirmation button.
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
                  event.target.value,
                )
              }
              className="auth-input"
              placeholder="DELETE"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <DialogFooter className="border-0 bg-transparent p-0">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setShowDelete(false)
              }
              disabled={deleting}
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
                deleting ||
                deleteConfirmation
                  .trim()
                  .toUpperCase() !==
                  "DELETE"
              }
              className="cursor-pointer"
            >
              {deleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              {deleting
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
  id,
  label,
  provider,
  value,
  onChange,
}: {
  id: string;
  label: string;
  provider: SocialProvider;
  value: SocialField;
  onChange: (url: string) => void;
}) {
  const localError =
    validateSocialUrl(
      provider,
      value.url,
    );

  const statusLabel =
    value.status === "checking"
      ? "Checking"
      : value.status === "valid"
        ? "Verified"
        : value.status === "invalid"
          ? "Invalid"
          : "";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor={id}
          className="text-xs font-semibold text-[#626a78]"
        >
          {label}
        </label>

        <span className="text-[11px] font-semibold">
          {value.status ===
          "valid" ? (
            <span className="text-[#188b56]">
              {statusLabel}
            </span>
          ) : value.status ===
            "invalid" ? (
            <span className="text-[#c24d4d]">
              {statusLabel}
            </span>
          ) : (
            <span className="text-[#8b97aa]">
              {statusLabel}
            </span>
          )}
        </span>
      </div>

      <div className="relative">
        <input
          id={id}
          value={value.url}
          onChange={(event) =>
            onChange(
              event.target.value,
            )
          }
          className={
            "auth-input pr-10 " +
            (localError ||
            value.status ===
              "invalid"
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

        {value.status ===
          "valid" && (
          <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#188b56]" />
        )}

        {value.status ===
          "invalid" && (
          <X className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#c24d4d]" />
        )}
      </div>

      {(value.message ||
        localError) && (
        <p
          className={
            value.status ===
              "valid"
              ? "text-xs text-[#188b56]"
              : "text-xs text-[#c24d4d]"
          }
        >
          {value.message ||
            localError}
        </p>
      )}

      {value.url &&
        !localError && (
          <a
            href={value.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex cursor-pointer items-center gap-1.5 text-[11px] font-semibold text-[#59667e]"
          >
            Open profile
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
    </div>
  );
}
