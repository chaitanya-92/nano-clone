import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  ImagePlus,
  Loader2,
  Pencil,
  Save,
  Globe,
  Share2,
  Upload,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";
import { AnimatedNumber } from "@/components/dashboard/AnimatedNumber";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getCreatorProfile,
  getPublicCardUrl,
  updateCreatorProfile,
  publishCreatorCard,
  unpublishCreatorCard,
  type CreatorProfile,
} from "@/lib/dashboard";
import { PublicCardActions } from "@/dashboard/components/shared/PublicCardActions";
import { Logo } from "@/components/layout/Logo";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Unable to read the image."));
        return;
      }

      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(new Error("Unable to read the image."));
    };

    reader.readAsDataURL(file);
  });
}

function creatorInitials(name: string | null | undefined) {
  return (
    name
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "N"
  );
}

function parseIndustries(value: string | null | undefined) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export default function MyCard() {
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    headline: "",
    category: "",
    bio: "",
  });
  const [photoOpen, setPhotoOpen] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoSaving, setPhotoSaving] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [cardFlipped, setCardFlipped] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void getCreatorProfile()
      .then(({ data }) => {
        if (cancelled) {
          return;
        }

        setProfile(data);
        setDraft({
          headline: data.headline ?? "",
          category: data.category ?? "",
          bio: data.bio ?? "",
        });
      })
      .catch((value) => {
        if (cancelled) {
          return;
        }

        setError(
          value instanceof Error
            ? value.message
            : "Unable to load your creator card.",
        );
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const publicUrl =
    profile?.card_status === "published" && profile.slug
      ? getPublicCardUrl(profile.slug)
      : "";

  const savePhoto = async () => {
    if (!photoFile) {
      return;
    }

    if (!photoFile.type.startsWith("image/")) {
      toast.add({
        title: "Invalid image",
        description: "Choose a PNG, JPEG or WebP image.",
        type: "error",
        timeout: 2500,
      });
      return;
    }

    if (photoFile.size > 3 * 1024 * 1024) {
      toast.add({
        title: "Image is too large",
        description: "Choose an image smaller than 3 MB.",
        type: "error",
        timeout: 2500,
      });
      return;
    }

    setPhotoSaving(true);
    setError("");

    try {
      const photoData = await fileToDataUrl(photoFile);

      const { data } = await updateCreatorProfile({
        profilePhotoUrl: photoData,
      });

      setProfile(data);
      setPhotoFile(null);
      setPhotoPreview("");
      setPhotoOpen(false);

      toast.add({
        title: "Profile photo updated",
        description: "Your creator card now uses the new photo.",
        type: "success",
        timeout: 2200,
      });
    } catch (value) {
      setError(
        value instanceof Error
          ? value.message
          : "Unable to update your profile photo.",
      );
    } finally {
      setPhotoSaving(false);
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    setPhotoFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      setPhotoPreview(typeof reader.result === "string" ? reader.result : "");
    };

    reader.readAsDataURL(file);
  };

  const togglePublish = async () => {
    try {
      const { data } =
        profile.card_status === "published"
          ? await unpublishCreatorCard()
          : await publishCreatorCard();
      setProfile(data);
      toast.add({
        title:
          data.card_status === "published"
            ? "Card published"
            : "Card unpublished",
        description:
          data.card_status === "published"
            ? "Your public card link is now active."
            : "Your public card is no longer publicly accessible.",
        type: "success",
        timeout: 2200,
      });
    } catch (value) {
      setError(
        value instanceof Error
          ? value.message
          : "Unable to update card status.",
      );
    }
  };

  const save = async () => {
    setSaving(true);
    setError("");

    try {
      const { data } = await updateCreatorProfile(draft);

      setProfile(data);
      setDraft({
        headline: data.headline ?? "",
        category: data.category ?? "",
        bio: data.bio ?? "",
      });
      setOpen(false);

      toast.add({
        title: "Creator card updated",
        description: "Your public card has been updated.",
        type: "success",
        timeout: 2200,
      });
    } catch (value) {
      setError(
        value instanceof Error
          ? value.message
          : "Unable to save your creator card.",
      );
    } finally {
      setSaving(false);
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
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="overflow-hidden rounded-[28px] border border-[#dce4ef] bg-white">
              <Skeleton className="h-[170px] rounded-none" />

              <div className="space-y-4 px-8 pb-9 pt-20">
                <Skeleton className="mx-auto h-8 w-48" />
                <Skeleton className="mx-auto h-4 w-28" />
                <Skeleton className="mx-auto h-16 w-full max-w-xl" />
              </div>
            </div>

            <div className="rounded-[24px] border border-[#dfe5ed] bg-white p-6">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-4 h-14 w-full rounded-xl" />
              <Skeleton className="mt-4 h-10 w-full rounded-lg" />
              <Skeleton className="mt-2 h-10 w-full rounded-lg" />
            </div>
          </div>
        )}
      </div>
    );
  }

  const industries = parseIndustries(profile.industries);

  return (
    <div className="mx-auto w-full max-w-[1240px] pb-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2864f0]">
            Creator card
          </p>

          <h1 className="mt-2 text-[36px] font-semibold leading-tight tracking-[-1.6px] text-[#151b2a] sm:text-[40px]">
            Your public profile
          </h1>

          <p className="mt-2 max-w-[680px] text-[15px] leading-6 text-[#78869e] sm:text-[16px]">
            Review exactly what brands can discover from your Naano card.
          </p>
        </div>

        <div className="flex w-full flex-wrap items-center justify-start gap-2 md:w-auto md:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(true)}
            className="h-11 min-w-[92px] cursor-pointer rounded-xl px-4"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>

          <Button
            type="button"
            onClick={() => void togglePublish()}
            className="h-11 min-w-[138px] cursor-pointer rounded-xl bg-[#2864f0] px-4 text-white shadow-[0_4px_12px_rgba(40,100,240,0.18)] hover:bg-[#2056d4]"
          >
            <Globe className="mr-2 h-4 w-4" />
            {profile.card_status === "published" ? "Unpublish" : "Publish card"}
          </Button>

          <a
            href={publicUrl || "#"}
            target={publicUrl ? "_blank" : undefined}
            rel="noreferrer"
            onClick={(event) => {
              if (!publicUrl) {
                event.preventDefault();
              }
            }}
            className="inline-flex h-11 min-w-[100px] cursor-pointer items-center justify-center rounded-xl border border-[#dce3ec] bg-white px-4 text-sm font-medium text-[#59667e] shadow-[0_1px_2px_rgba(20,30,50,0.03)] transition hover:bg-[#f8fafc] hover:text-[#202938]"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Preview
          </a>
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-[#f1c7c7] bg-[#fff7f7] px-4 py-3 text-sm text-[#9b3e3e]">
          {error}
        </div>
      )}

      <section className="mt-9 grid items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="overflow-visible"
        >
          <div
            className="group [perspective:1400px]"
            onClick={() => setCardFlipped((current) => !current)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setCardFlipped((current) => !current);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={cardFlipped ? "Show creator card" : "Show creator details"}
          >
            <motion.div
              animate={{ rotateY: cardFlipped ? 180 : 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-[620px] w-full [transform-style:preserve-3d]"
            >
              <div className="absolute inset-0 overflow-hidden rounded-[28px] border border-[#dce4ef] bg-white shadow-[0_20px_60px_rgba(34,60,100,0.08)] transition-shadow duration-300 group-hover:shadow-[0_24px_70px_rgba(34,60,100,0.13)] [backface-visibility:hidden]">
                <div className="relative h-[170px] bg-gradient-to-br from-[#2159df] via-[#316df0] to-[#6f91f3]">
                  <Logo
                    compact={false}
                    href="/dashboard"
                    className="absolute left-7 top-6 text-white [filter:brightness(0)_invert(1)] [&>span:last-child]:text-[1.5rem]"
                  />

                  <div className="absolute right-7 top-6 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-[#2864f0]">
                    {profile.country || "Global"}
                  </div>

                  <motion.button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setPhotoOpen(true);
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="absolute -bottom-14 left-1/2 flex h-28 w-28 -translate-x-1/2 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-[#316df0] bg-[#6572cc] text-4xl text-white"
                    aria-label="Change profile photo"
                  >
                    {profile.profile_photo_url ? (
                      <img src={profile.profile_photo_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      creatorInitials(profile.name)
                    )}
                  </motion.button>
                </div>

                <div className="px-8 pb-9 pt-20 text-center">
                  <h2 className="text-[32px] font-semibold tracking-[-1.2px] text-[#141a29]">
                    {profile.name || "Creator"}
                  </h2>

                  <p className="mt-2 text-[16px] text-[#7b879d]">
                    {profile.category || profile.headline || "Creator"}
                  </p>

                  <p className="mx-auto mt-6 max-w-[640px] text-[15px] leading-7 text-[#64728a]">
                    {profile.bio || profile.headline || "Complete your card profile."}
                  </p>

                  {industries.length > 0 && (
                    <div className="mt-7 flex flex-wrap justify-center gap-2">
                      {industries.map((industry) => (
                        <span key={industry} className="rounded-full border border-[#dfe5ed] bg-[#fafbfc] px-3 py-1.5 text-xs font-medium text-[#60708a]">
                          {industry}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-8 grid grid-cols-3 border-y border-[#e8ecf2] py-6">
                    <CardMetric label="Followers" value={profile.followers} />
                    <CardMetric label="Impressions" value={profile.impressions} bordered />
                    <CardMetric label="Posts" value={profile.post_count} />
                  </div>

                  <div className="mt-7 flex justify-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#dce4ef] bg-white px-5 py-2.5 text-xs font-semibold text-[#52617b] shadow-[0_4px_12px_rgba(30,55,100,0.06)] transition-transform duration-200 group-hover:-translate-y-0.5">
                      More details
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 overflow-hidden rounded-[28px] border border-[#dce4ef] bg-white p-7 shadow-[0_20px_60px_rgba(34,60,100,0.08)] [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2864f0]">
                      Creator insights
                    </p>
                    <h2 className="mt-2 text-[30px] font-semibold tracking-[-1px] text-[#141a29]">
                      Performance & ICP
                    </h2>
                    <p className="mt-2 text-sm text-[#7b879d]">
                      A quick view of your audience and public profile signals.
                    </p>
                  </div>

                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef4ff] text-[#2864f0]">
                    <Share2 className="h-5 w-5" />
                  </span>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  {[
                    ["Followers", profile.followers],
                    ["Impressions", profile.impressions],
                    ["Posts", profile.post_count],
                    ["Industries", industries.length],
                  ].map(([label, value]) => (
                    <div key={String(label)} className="rounded-2xl border border-[#e2e8f0] bg-[#fbfcfe] p-5 text-center">
                      <p className="text-xs font-medium text-[#8794aa]">{label}</p>
                      <p className="mt-3 text-2xl font-semibold text-[#172033]">
                        {Number(value) ? Number(value).toLocaleString() : "—"}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-[#e2e8f0] bg-white p-5">
                  <p className="text-sm font-semibold text-[#27344b]">About</p>
                  <p className="mt-2 text-sm leading-6 text-[#7d899f]">
                    {profile.bio || profile.headline || "No creator bio available yet."}
                  </p>
                </div>

                <div className="mt-6 flex justify-center">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#dce4ef] bg-white px-5 py-2.5 text-xs font-semibold text-[#52617b]">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to card
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <aside className="h-full min-h-[620px] rounded-[24px] border border-[#dfe5ed] bg-white p-6 shadow-[0_4px_16px_rgba(32,52,82,0.035)]">
          <div className="flex h-full flex-col">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a96aa]">
            Public link
          </p>

          <p className="mt-4 min-h-[72px] break-all rounded-xl border border-[#e4e8ee] bg-[#f8fafc] px-4 py-3.5 text-[13px] leading-5 text-[#52617b]">
            {publicUrl || "Publish your card to create a public link."}
          </p>

          <div className="mt-4">
            <PublicCardActions
              url={publicUrl}
              title={(profile.name || "Creator") + " on Naano"}
            />
          </div>
          </div>
        </aside>
      </section>

      <Dialog
        open={photoOpen}
        onOpenChange={(value) => {
          setPhotoOpen(value);

          if (!value) {
            setPhotoFile(null);
            setPhotoPreview("");
          }
        }}
      >
        <DialogContent className="max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Update profile photo</DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            <div className="flex items-center justify-center">
              <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-[#dfe6f0] bg-[#6572cc] text-4xl text-white">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : profile.profile_photo_url ? (
                  <img
                    src={profile.profile_photo_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  creatorInitials(profile.name)
                )}
              </div>
            </div>

            <label
              htmlFor="profile-photo-upload"
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#d8e0eb] bg-[#fafbfd] px-6 py-8 text-center transition hover:bg-[#f7f9fc]"
            >
              <ImagePlus className="h-7 w-7 text-[#66758d]" />

              <span className="mt-3 text-sm font-semibold text-[#344059]">
                Choose a new photo
              </span>

              <span className="mt-1 text-xs text-[#8995aa]">
                PNG, JPEG or WebP · Max 3 MB
              </span>

              <input
                id="profile-photo-upload"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handlePhotoChange}
                className="sr-only"
              />
            </label>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => void savePhoto()}
                disabled={photoSaving || !photoFile}
                className="cursor-pointer bg-[#171d2b] hover:bg-[#111827]"
              >
                {photoSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                {photoSaving ? "Uploading…" : "Save photo"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[620px]">
          <DialogHeader>
            <DialogTitle>Edit creator card</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {(
              [
                ["headline", "Headline"],
                ["category", "Category"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block">
                <span className="mb-2 block text-xs font-semibold text-[#626a78]">
                  {label}
                </span>

                <input
                  value={draft[key]}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      [key]: event.target.value,
                    })
                  }
                  className="auth-input"
                />
              </label>
            ))}

            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-[#626a78]">
                About
              </span>

              <textarea
                value={draft.bio}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    bio: event.target.value,
                  })
                }
                rows={6}
                className="auth-input resize-none"
              />
            </label>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => void save()}
                disabled={saving}
                className="cursor-pointer bg-[#171d2b] hover:bg-[#111827]"
              >
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CardMetric({
  label,
  value,
  bordered = false,
}: {
  label: string;
  value: number | null | undefined;
  bordered?: boolean;
}) {
  return (
    <div className={bordered ? "border-x border-[#e8ecf2]" : ""}>
      <p className="text-2xl font-semibold text-[#182239]">
        <AnimatedNumber value={Number(value ?? 0)} />
      </p>

      <p className="mt-1 text-xs text-[#8794aa]">{label}</p>
    </div>
  );
}
