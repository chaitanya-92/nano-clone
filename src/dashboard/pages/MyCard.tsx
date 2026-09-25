import {
  Check,
  Copy,
  ExternalLink,
  ImagePlus,
  Pencil,
  Save,
  Share2,
  Upload,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import {
  getCreatorProfile,
  getPublicCardUrl,
  updateCreatorProfile,
  type CreatorProfile,
} from "@/lib/dashboard";

const MAX_IMAGE_SIZE = 1.5 * 1024 * 1024;

export default function MyCard() {
  const [profile, setProfile] =
    useState<CreatorProfile | null>(
      null,
    );
  const [open, setOpen] =
    useState(false);
  const [imageOpen, setImageOpen] =
    useState(false);
  const [uploading, setUploading] =
    useState(false);
  const [imagePreview, setImagePreview] =
    useState("");
  const imageInputRef =
    useRef<HTMLInputElement>(null);

  const [draft, setDraft] =
    useState({
      headline: "",
      category: "",
      bio: "",
    });

  const [error, setError] =
    useState("");

  useEffect(() => {
    void getCreatorProfile()
      .then(({ data }) => {
        setProfile(data);

        setDraft({
          headline:
            data.headline ?? "",
          category:
            data.category ?? "",
          bio: data.bio ?? "",
        });
      })
      .catch((value) => {
        setError(
          value instanceof Error
            ? value.message
            : "Unable to load your creator card.",
        );
      });
  }, []);

  const publicUrl = useMemo(
    () =>
      profile?.slug
        ? getPublicCardUrl(
            profile.slug,
          )
        : "",
    [profile?.slug],
  );

  const save = async () => {
    try {
      const { data } =
        await updateCreatorProfile(
          draft,
        );

      setProfile(data);
      setOpen(false);

      toast.add({
        title: "Card updated",
        description:
          "Your creator card changes were saved.",
        type: "success",
        timeout: 2500,
      });
    } catch (value) {
      const message =
        value instanceof Error
          ? value.message
          : "Unable to save your card.";

      setError(message);

      toast.add({
        title: "Unable to save card",
        description: message,
        type: "error",
        timeout: 3500,
      });
    }
  };

  const copyLink = async () => {
    if (!publicUrl) {
      toast.add({
        title: "Card link unavailable",
        description:
          "Publish your creator card before copying the link.",
        type: "warning",
        timeout: 3000,
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(
        publicUrl,
      );

      toast.add({
        title: "Card link copied",
        description:
          "The public creator card URL is on your clipboard.",
        type: "success",
        timeout: 2500,
      });
    } catch {
      toast.add({
        title: "Copy failed",
        description:
          "Your browser blocked clipboard access.",
        type: "error",
        timeout: 3500,
      });
    }
  };

  const share = async () => {
    if (!publicUrl) {
      toast.add({
        title: "Card link unavailable",
        description:
          "Publish your creator card before sharing it.",
        type: "warning",
        timeout: 3000,
      });
      return;
    }

    if (
      navigator.share
    ) {
      try {
        await navigator.share({
          title:
            (profile?.name ??
              "Creator") +
            " on Naano",
          url: publicUrl,
        });

        toast.add({
          title: "Card shared",
          description:
            "Your creator card was shared successfully.",
          type: "success",
          timeout: 2500,
        });
      } catch {
        return;
      }

      return;
    }

    await copyLink();
  };

  const openImagePicker = () => {
    imageInputRef.current?.click();
  };

  const handleImage = async (
    file: File | undefined,
  ) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.add({
        title: "Image required",
        description:
          "Choose a PNG, JPG, WEBP or another supported image file.",
        type: "error",
        timeout: 3500,
      });
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.add({
        title: "Image is too large",
        description:
          "Choose an image smaller than 1.5 MB.",
        type: "error",
        timeout: 3500,
      });
      return;
    }

    setUploading(true);

    try {
      const dataUrl =
        await readFileAsDataUrl(
          file,
        );

      setImagePreview(dataUrl);

      const { data } =
        await updateCreatorProfile({
          profilePhotoUrl: dataUrl,
        });

      setProfile(data);
      setImageOpen(false);

      toast.add({
        title: "Profile photo updated",
        description:
          "Your creator card now uses the new profile photo.",
        type: "success",
        timeout: 2500,
      });
    } catch (value) {
      const message =
        value instanceof Error
          ? value.message
          : "Unable to upload your image.";

      toast.add({
        title: "Upload failed",
        description: message,
        type: "error",
        timeout: 4000,
      });
    } finally {
      setUploading(false);

      if (imageInputRef.current) {
        imageInputRef.current.value =
          "";
      }
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
          <div className="rounded-[22px] border border-[#e0e6ef] bg-white p-8 text-sm text-[#7d899f]">
            Loading your creator card…
          </div>
        )}
      </div>
    );
  }

  let industries: string[] = [];

  try {
    industries = JSON.parse(
      profile.industries ||
        "[]",
    );
  } catch {
    industries = [];
  }

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2864f0]">
            Creator card
          </p>

          <h1 className="mt-2 text-[38px] font-semibold tracking-[-1.8px] text-[#151b2a]">
            Your public profile
          </h1>

          <p className="mt-2 max-w-[680px] text-[16px] leading-7 text-[#78869e]">
            Review exactly what brands can discover from your Naano card.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setOpen(true)
            }
            className="h-10 min-w-[104px] cursor-pointer rounded-lg px-4"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (!publicUrl) {
                toast.add({
                  title:
                    "Preview unavailable",
                  description:
                    "Publish your creator card before previewing it.",
                  type: "warning",
                  timeout: 3000,
                });
                return;
              }

              window.open(
                publicUrl,
                "_blank",
                "noopener,noreferrer",
              );
            }}
            className="h-10 min-w-[112px] cursor-pointer rounded-lg px-4"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-[#f1c7c7] bg-[#fff7f7] px-4 py-3 text-sm text-[#9b3e3e]">
          {error}
        </div>
      )}

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          whileHover={{
            y: -4,
            boxShadow:
              "0 28px 80px rgba(34,60,100,0.13)",
          }}
          className="group/card overflow-hidden rounded-[28px] border border-[#dce4ef] bg-white shadow-[0_20px_60px_rgba(34,60,100,0.08)]"
        >
          <div className="relative h-[170px] bg-gradient-to-br from-[#2159df] via-[#316df0] to-[#6f91f3]">
            <div className="absolute left-7 top-6 text-2xl font-bold text-white">
              naano
            </div>

            <div className="absolute right-7 top-6 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-[#2864f0]">
              {profile.country ||
                "Global"}
            </div>

            <motion.div
              initial={{
                scale: 0.72,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 18,
                delay: 0.12,
              }}
              className="absolute -bottom-14 left-1/2 -translate-x-1/2"
            >
              <button
                type="button"
                onClick={() =>
                  setImageOpen(true)
                }
                aria-label="Change profile photo"
                className="group relative flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-[#316df0] bg-[#6572cc] text-4xl text-white outline-none"
              >
                {profile.profile_photo_url ? (
                  <img
                    src={
                      profile.profile_photo_url
                    }
                    alt={
                      profile.name
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  profile.name
                    ?.trim()
                    .split(/\s+/)
                    .filter(Boolean)
                    .map(
                      (value) =>
                        value[0],
                    )
                    .slice(0, 2)
                    .join("")
                    .toUpperCase() ||
                  "N"
                )}

                <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <span className="flex flex-col items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.08em]">
                    <ImagePlus className="h-5 w-5" />
                    Edit
                  </span>
                </span>
              </button>
            </motion.div>
          </div>

          <div className="px-8 pb-9 pt-20 text-center">
            <h2 className="text-[32px] font-semibold tracking-[-1.2px] text-[#141a29]">
              {profile.name ||
                "Creator"}
            </h2>

            <p className="mt-2 text-[16px] text-[#7b879d]">
              {profile.category ||
                profile.headline ||
                "Creator"}
            </p>

            <p className="mx-auto mt-6 max-w-[640px] text-[15px] leading-7 text-[#64728a]">
              {profile.bio ||
                profile.headline ||
                "Complete your card profile."}
            </p>

            {industries.length >
              0 && (
              <div className="mt-7 flex flex-wrap justify-center gap-2">
                {industries.map(
                  (industry) => (
                    <span
                      key={industry}
                      className="rounded-full border border-[#dfe5ed] bg-[#fafbfc] px-3 py-1.5 text-xs font-medium text-[#60708a]"
                    >
                      {industry}
                    </span>
                  ),
                )}
              </div>
            )}

            <div className="mt-8 grid grid-cols-3 border-y border-[#e8ecf2] py-6">
              <div>
                <p className="text-2xl font-semibold text-[#182239]">
                  {Number(
                    profile.followers ??
                      0,
                  ).toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-[#8794aa]">
                  Followers
                </p>
              </div>

              <div className="border-x border-[#e8ecf2]">
                <p className="text-2xl font-semibold text-[#182239]">
                  {Number(
                    profile.impressions ??
                      0,
                  ).toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-[#8794aa]">
                  Impressions
                </p>
              </div>

              <div>
                <p className="text-2xl font-semibold text-[#182239]">
                  {Number(
                    profile.post_count ??
                      0,
                  ).toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-[#8794aa]">
                  Posts
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <aside className="rounded-[24px] border border-[#dfe5ed] bg-white p-6 shadow-[0_4px_16px_rgba(32,52,82,0.035)]">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a96aa]">
            Public link
          </p>

          <p className="mt-3 break-all rounded-xl border border-[#e4e8ee] bg-[#f8fafc] px-4 py-3 text-sm text-[#52617b]">
            {publicUrl ||
              "Publish your card to create a public link."}
          </p>

          <div className="mt-4 grid gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                void copyLink()
              }
              className="h-10 w-full cursor-pointer justify-start rounded-lg px-4"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy link
            </Button>

            <Button
              type="button"
              onClick={() =>
                void share()
              }
              className="h-10 w-full cursor-pointer justify-start rounded-lg bg-[#2864f0] px-4 text-white hover:bg-[#1f58dc]"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share card
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigateToAnalytics()
              }
              className="h-10 w-full cursor-pointer justify-start rounded-lg px-4"
            >
              View analytics
            </Button>
          </div>
        </aside>
      </section>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) =>
          void handleImage(
            event.target.files?.[0],
          )
        }
      />

      <Dialog
        open={imageOpen}
        onOpenChange={(openValue) => {
          setImageOpen(
            openValue,
          );

          if (!openValue) {
            setImagePreview("");
          }
        }}
      >
        <DialogContent className="max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              Update profile photo
            </DialogTitle>

            <DialogDescription>
              Upload a clear profile photo. The same image will appear on your creator card and public profile.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="flex justify-center">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-[#e8edf5] bg-[#eef2f8] text-3xl font-semibold text-[#5f6f89]">
                {imagePreview ||
                profile.profile_photo_url ? (
                  <img
                    src={
                      imagePreview ||
                      profile.profile_photo_url ||
                      ""
                    }
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  profile.name
                    ?.trim()
                    .split(/\s+/)
                    .filter(Boolean)
                    .map(
                      (value) =>
                        value[0],
                    )
                    .slice(0, 2)
                    .join("")
                    .toUpperCase() ||
                  "N"
                )}
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-[#d6deea] bg-[#fafbfd] p-5 text-center">
              <Upload className="mx-auto h-6 w-6 text-[#8794aa]" />

              <p className="mt-3 text-sm font-semibold text-[#46536a]">
                Choose a new image
              </p>

              <p className="mt-1 text-xs text-[#8b97aa]">
                PNG, JPG or WEBP · maximum 1.5 MB
              </p>

              <Button
                type="button"
                variant="outline"
                onClick={
                  openImagePicker
                }
                disabled={uploading}
                className="mt-4 h-10 cursor-pointer rounded-lg px-4"
              >
                {uploading
                  ? "Uploading…"
                  : "Choose image"}
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setImageOpen(false)
              }
              disabled={uploading}
              className="h-10 cursor-pointer rounded-lg px-4"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={open}
        onOpenChange={
          setOpen
        }
      >
        <DialogContent className="max-w-[620px]">
          <DialogHeader>
            <DialogTitle>
              Edit creator card
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {[
              [
                "headline",
                "Headline",
              ],
              [
                "category",
                "Category",
              ],
            ].map(
              ([key, label]) => (
                <label
                  key={key}
                  className="block"
                >
                  <span className="mb-2 block text-xs font-semibold text-[#626a78]">
                    {label}
                  </span>

                  <input
                    value={
                      draft[
                        key as keyof typeof draft
                      ]
                    }
                    onChange={(
                      event,
                    ) =>
                      setDraft({
                        ...draft,
                        [key]:
                          event
                            .target
                            .value,
                      })
                    }
                    className="auth-input"
                  />
                </label>
              ),
            )}

            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-[#626a78]">
                About
              </span>

              <textarea
                value={
                  draft.bio
                }
                onChange={(
                  event,
                ) =>
                  setDraft({
                    ...draft,
                    bio: event
                      .target
                      .value,
                  })
                }
                rows={6}
                className="auth-input resize-none"
              />
            </label>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() =>
                  void save()
                }
                className="h-10 min-w-[132px] cursor-pointer rounded-lg bg-[#171d2b] px-4 hover:bg-[#111827]"
              >
                <Save className="mr-2 h-4 w-4" />
                Save changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function navigateToAnalytics() {
  window.location.assign(
    "/dashboard/analytics",
  );
}

function readFileAsDataUrl(
  file: File,
) {
  return new Promise<string>(
    (resolve, reject) => {
      const reader =
        new FileReader();

      reader.onload = () => {
        if (
          typeof reader.result !==
          "string"
        ) {
          reject(
            new Error(
              "The selected image could not be read.",
            ),
          );
          return;
        }

        resolve(
          reader.result,
        );
      };

      reader.onerror = () =>
        reject(
          new Error(
            "The selected image could not be read.",
          ),
        );

      reader.readAsDataURL(file);
    },
  );
}
