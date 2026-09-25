import {
  AlertTriangle,
  Check,
  CreditCard,
  ExternalLink,
  Link2,
  Loader2,
  RefreshCw,
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
  getCurrentUser,
  getPayoutMethods,
  getSocialAccounts,
  updateCreatorProfile,
  type CreatorProfile,
  type PayoutMethod,
} from "@/lib/dashboard";
import { connectSocial } from "@/lib/onboarding";
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

type SocialProvider = "linkedin" | "x";

type SocialState = {
  url: string;
  status: "idle" | "checking" | "valid" | "invalid";
  message: string;
};

function isValidSocialUrl(provider: SocialProvider, value: string) {
  try {
    const url = new URL(value.trim());

    if (url.protocol !== "https:") {
      return false;
    }

    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");

    if (provider === "linkedin") {
      return (
        hostname === "linkedin.com" &&
        /^\/in\/[A-Za-z0-9][A-Za-z0-9._-]*\/?$/.test(url.pathname)
      );
    }

    return (
      (hostname === "x.com" || hostname === "twitter.com") &&
      /^\/[A-Za-z0-9_]{1,15}\/?$/.test(url.pathname)
    );
  } catch {
    return false;
  }
}

export default function Settings() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("profile");
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [methods, setMethods] = useState<PayoutMethod[]>([]);
  const [name, setName] = useState("");
  const [linkedin, setLinkedin] = useState<SocialState>({
    url: "",
    status: "idle",
    message: "",
  });
  const [xProfile, setXProfile] = useState<SocialState>({
    url: "",
    status: "idle",
    message: "",
  });
  const [methodLabel, setMethodLabel] = useState("");
  const [showMethod, setShowMethod] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const loadSettings = async () => {
    setError("");

    try {
      const { user: currentUser } = await getCurrentUser();

      if (!currentUser) {
        setError("Your session has expired. Please sign in again.");
        return;
      }

      if (currentUser.role !== "creator") {
        setError("Creator settings are only available for creator accounts.");
        return;
      }

      const [profileResult, payoutResult, socialResult] = await Promise.all([
        getCreatorProfile(),
        getPayoutMethods(),
        getSocialAccounts(),
      ]);

      const creator = profileResult.data;

      setProfile(creator);
      setName(creator.name ?? "");
      setMethods(payoutResult.data);

      const linkedInAccount = socialResult.data.find(
        (item) => item.provider === "linkedin",
      );

      const xAccount = socialResult.data.find((item) => item.provider === "x");

      setLinkedin({
        url: linkedInAccount?.profile_url ?? creator.linkedin_url ?? "",
        status: linkedInAccount?.status === "connected" ? "valid" : "idle",
        message:
          linkedInAccount?.status === "connected" ? "Profile connected." : "",
      });

      setXProfile({
        url: xAccount?.profile_url ?? creator.x_profile_url ?? "",
        status: xAccount?.status === "connected" ? "valid" : "idle",
        message: xAccount?.status === "connected" ? "Profile connected." : "",
      });
    } catch (value) {
      setError(
        value instanceof Error ? value.message : "Unable to load settings.",
      );
    }
  };

  useEffect(() => {
    void loadSettings();
  }, [user?.id, user?.role]);

  const saveName = async () => {
    const value = name.trim();

    if (!value) {
      setError("Display name is required.");
      return;
    }

    setBusy(true);
    setError("");
    setSaved(false);

    try {
      const { data } = await updateCreatorProfile({
        name: value,
      });

      setProfile(data);
      setName(data.name ?? value);
      setSaved(true);

      window.setTimeout(() => setSaved(false), 1800);
    } catch (value) {
      setError(
        value instanceof Error
          ? value.message
          : "Unable to save the display name.",
      );
    } finally {
      setBusy(false);
    }
  };

  const validateSocial = async (provider: SocialProvider) => {
    const state = provider === "linkedin" ? linkedin : xProfile;

    const value = state.url.trim();

    if (!isValidSocialUrl(provider, value)) {
      const message =
        provider === "linkedin"
          ? "Enter a valid HTTPS LinkedIn profile URL."
          : "Enter a valid HTTPS X profile URL.";

      if (provider === "linkedin") {
        setLinkedin({
          ...state,
          status: "invalid",
          message,
        });
      } else {
        setXProfile({
          ...state,
          status: "invalid",
          message,
        });
      }

      return;
    }

    if (provider === "linkedin") {
      setLinkedin({
        ...state,
        status: "checking",
        message: "Checking public profile…",
      });
    } else {
      setXProfile({
        ...state,
        status: "checking",
        message: "Checking public profile…",
      });
    }

    try {
      const response = await connectSocial(provider, value);

      const message = "Profile verified and saved.";

      if (provider === "linkedin") {
        setLinkedin({
          url: response?.data?.profileUrl ?? value,
          status: "valid",
          message,
        });
      } else {
        setXProfile({
          url: response?.data?.profileUrl ?? value,
          status: "valid",
          message,
        });
      }

      const { data } = await getCreatorProfile();

      setProfile(data);

      if (provider === "linkedin") {
        setName(data.name ?? "");
      }
    } catch (value) {
      const message =
        value instanceof Error
          ? value.message
          : "The profile could not be verified.";

      if (provider === "linkedin") {
        setLinkedin({
          ...state,
          status: "invalid",
          message,
        });
      } else {
        setXProfile({
          ...state,
          status: "invalid",
          message,
        });
      }
    }
  };

  const saveSocialLinks = async () => {
    if (linkedin.url && linkedin.status !== "valid") {
      await validateSocial("linkedin");
    }

    if (xProfile.url && xProfile.status !== "valid") {
      await validateSocial("x");
    }
  };

  const saveMethod = async () => {
    const value = methodLabel.trim();

    if (!value) {
      setError("Enter a name for the payout method.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const { data } = await addPayoutMethod({
        type: "stripe",
        label: value,
      });

      setMethods((current) => [data, ...current]);
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
      await logout().catch(() => undefined);
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
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2864f0]">
            Workspace
          </p>
          <h1 className="mt-2 text-[38px] font-semibold tracking-[-1.8px] text-[#141a29]">
            Settings
          </h1>
        </section>

        <div className="mt-6 rounded-xl border border-[#f1c7c7] bg-[#fff7f7] px-4 py-3 text-sm text-[#9b3e3e]">
          {error || "Unable to load settings."}
        </div>
      </div>
    );
  }

  const socialRows = [
    {
      provider: "linkedin" as const,
      label: "LinkedIn",
      icon: Link2,
      state: linkedin,
      setState: setLinkedin,
    },
    {
      provider: "x" as const,
      label: "X",
      icon: ExternalLink,
      state: xProfile,
      setState: setXProfile,
    },
  ];

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
                onClick={() => setTab(item.id)}
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
                  Manage the public profile information connected to your
                  creator card.
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

                  <div className="mt-2 flex gap-2">
                    <input
                      id="display-name"
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value);
                        setSaved(false);
                      }}
                      className="auth-input flex-1"
                    />

                    <Button
                      type="button"
                      onClick={() => void saveName()}
                      disabled={busy || !name.trim()}
                      className="cursor-pointer bg-[#171d2b] hover:bg-[#111827]"
                    >
                      {busy ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      {saved ? "Saved" : "Save name"}
                    </Button>
                  </div>
                </div>

                <div className="border-t border-[#e8ecf2] pt-7">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-[#6d7a91]" />
                    <h3 className="text-base font-semibold text-[#182239]">
                      Social links
                    </h3>
                  </div>

                  <p className="mt-1 text-sm text-[#7d899f]">
                    Validate each public profile before saving it to your
                    workspace.
                  </p>

                  <div className="mt-5 space-y-5">
                    {socialRows.map(({ provider, label, state, setState }) => (
                      <div key={provider} className="space-y-2">
                        <label
                          htmlFor={provider + "-url"}
                          className="text-xs font-semibold text-[#626a78]"
                        >
                          {label}
                        </label>

                        <div className="flex flex-col gap-2 sm:flex-row">
                          <input
                            id={provider + "-url"}
                            value={state.url}
                            onChange={(event) =>
                              setState({
                                url: event.target.value,
                                status: "idle",
                                message: "",
                              })
                            }
                            className="auth-input flex-1"
                            placeholder={
                              provider === "linkedin"
                                ? "https://linkedin.com/in/your-profile"
                                : "https://x.com/your-handle"
                            }
                          />

                          {state.url && (
                            <Button
                              type="button"
                              variant="outline"
                              disabled={!isValidSocialUrl(provider, state.url)}
                              onClick={() =>
                                window.open(
                                  state.url,
                                  "_blank",
                                  "noopener,noreferrer",
                                )
                              }
                              className="cursor-pointer"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Open
                            </Button>
                          )}

                          <Button
                            type="button"
                            variant={
                              state.status === "valid" ? "outline" : "default"
                            }
                            onClick={() => void validateSocial(provider)}
                            disabled={
                              state.status === "checking" || !state.url.trim()
                            }
                            className="cursor-pointer sm:min-w-[150px]"
                          >
                            {state.status === "checking" ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : state.status === "valid" ? (
                              <Check className="mr-2 h-4 w-4" />
                            ) : (
                              <RefreshCw className="mr-2 h-4 w-4" />
                            )}
                            {state.status === "checking"
                              ? "Checking..."
                              : state.status === "valid"
                                ? "Verified"
                                : "Validate profile"}
                          </Button>
                        </div>

                        {state.message && (
                          <p
                            className={
                              state.status === "valid"
                                ? "text-xs text-[#188b56]"
                                : state.status === "invalid"
                                  ? "text-xs text-[#bd4b4b]"
                                  : "text-xs text-[#7b879a]"
                            }
                          >
                            {state.message}
                          </p>
                        )}
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => void saveSocialLinks()}
                      disabled={
                        busy ||
                        Boolean(linkedin.url && linkedin.status !== "valid") ||
                        Boolean(xProfile.url && xProfile.status !== "valid")
                      }
                      className="cursor-pointer"
                    >
                      <Link2 className="mr-2 h-4 w-4" />
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
                  Payouts
                </h2>
                <p className="mt-1 text-sm text-[#7d899f]">
                  Manage payout methods used for creator earnings.
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
                        Saved payout destinations for withdrawals.
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowMethod((value) => !value)}
                      className="cursor-pointer"
                    >
                      {showMethod ? "Cancel" : "Add method"}
                    </Button>
                  </div>

                  {showMethod && (
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <input
                        value={methodLabel}
                        onChange={(event) => setMethodLabel(event.target.value)}
                        className="auth-input flex-1"
                        placeholder="Primary payout account"
                      />

                      <Button
                        type="button"
                        onClick={() => void saveMethod()}
                        disabled={busy || !methodLabel.trim()}
                        className="cursor-pointer bg-[#171d2b] hover:bg-[#111827]"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save method
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
                              {method.type} · {method.status}
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
                      Permanently delete your account and associated workspace
                      data. This action cannot be undone.
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDelete(true)}
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
              This permanently deletes your Naano account and its associated
              workspace data.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-[#f1d7d7] bg-[#fff8f8] p-4">
            <p className="text-xs leading-5 text-[#8a5d5d]">
              There is no undo after deletion. Make sure you have saved anything
              you need before continuing.
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
              onChange={(event) => setDeleteConfirmation(event.target.value)}
              autoComplete="off"
              className="auth-input"
              placeholder="DELETE"
            />
          </div>

          <DialogFooter className="border-0 bg-transparent p-0 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDelete(false)}
              disabled={busy}
              className="cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={() => void handleDelete()}
              disabled={busy || deleteConfirmation !== "DELETE"}
              className="cursor-pointer"
            >
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {busy ? "Deleting..." : "Delete account permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
