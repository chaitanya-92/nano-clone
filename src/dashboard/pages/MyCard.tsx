import {
  ArrowLeft,
  Copy,
  ExternalLink,
  ImagePlus,
  Loader2,
  Pencil,
  Save,
  Share2,
  Upload,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";
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
  type CreatorProfile,
} from "@/lib/dashboard";

function fileToDataUrl(
  file: File,
): Promise<string> {
  return new Promise(
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
              "Unable to read the selected image.",
            ),
          );

          return;
        }

        resolve(reader.result);
      };

      reader.onerror = () => {
        reject(
          new Error(
            "Unable to read the selected image.",
          ),
        );
      };

      reader.readAsDataURL(file);
    },
  );
}

function parseIndustries(
  value: string | null | undefined,
) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    return Array.isArray(parsed)
      ? parsed.filter(
          (
            item,
          ): item is string =>
            typeof item ===
            "string",
        )
      : [];
  } catch {
    return [];
  }
}

function initials(
  name: string | null | undefined,
) {
  return (
    name
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(
        (value) => value[0],
      )
      .slice(0, 2)
      .join("")
      .toUpperCase() ||
    "N"
  );
}

function formatCurrency(
  cents: number,
  currency: string,
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency:
        currency || "EUR",
      maximumFractionDigits: 0,
    },
  ).format(cents / 100);
}

function formatRate(
  value: number,
) {
  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return "—";
  }

  return (
    value.toFixed(1) +
    "%"
  );
}

export default function MyCard() {
  const [profile, setProfile] =
    useState<CreatorProfile | null>(
      null,
    );
  const [showDetails, setShowDetails] =
    useState(false);
  const [hovered, setHovered] =
    useState(false);
  const [showEdit, setShowEdit] =
    useState(false);
  const [showPhoto, setShowPhoto] =
    useState(false);
  const [copied, setCopied] =
    useState(false);
  const [draft, setDraft] =
    useState({
      headline: "",
      category: "",
      bio: "",
    });
  const [photoFile, setPhotoFile] =
    useState<File | null>(null);
  const [photoPreview, setPhotoPreview] =
    useState("");
  const [loading, setLoading] =
    useState(true);
  const [saving, setSaving] =
    useState(false);
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
        setDraft({
          headline:
            data.headline ?? "",
          category:
            data.category ?? "",
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

  const publicUrl = useMemo(
    () =>
      profile?.slug
        ? getPublicCardUrl(
            profile.slug,
          )
        : "",
    [profile?.slug],
  );

  const industries = useMemo(
    () =>
      parseIndustries(
        profile?.industries,
      ),
    [profile?.industries],
  );

  const followers = Number(
    profile?.followers ?? 0,
  );
  const impressions = Number(
    profile?.impressions ?? 0,
  );
  const posts = Number(
    profile?.post_count ?? 0,
  );
  const engagements = Number(
    profile?.engagement_count ?? 0,
  );

  const reactionsPerPost =
    posts > 0
      ? engagements / posts
      : 0;

  const impressionsPerPost =
    posts > 0
      ? impressions / posts
      : 0;

  const engagementRate =
    impressions > 0
      ? (engagements / impressions) *
        100
      : 0;

  const copyLink = async () => {
    if (!publicUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        publicUrl,
      );

      setCopied(true);

      toast.add({
        title: "Card link copied",
        description:
          "Your public creator card link is ready to share.",
        type: "success",
        timeout: 2200,
      });

      window.setTimeout(
        () => setCopied(false),
        1600,
      );
    } catch {
      toast.add({
        title: "Copy failed",
        description:
          "Your browser did not allow clipboard access.",
        type: "error",
        timeout: 2600,
      });
    }
  };

  const shareCard = async () => {
    if (!publicUrl) {
      return;
    }

    try {
      if (
        typeof navigator.share ===
        "function"
      ) {
        await navigator.share({
          title:
            (profile?.name ??
              "Creator") +
            " on Naano",
          url: publicUrl,
        });

        return;
      }

      await copyLink();
    } catch {
      return;
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    setError("");

    try {
      const { data } =
        await updateCreatorProfile(
          draft,
        );

      setProfile(data);
      setDraft({
        headline:
          data.headline ?? "",
        category:
          data.category ?? "",
        bio: data.bio ?? "",
      });
      setShowEdit(false);

      toast.add({
        title: "Card updated",
        description:
          "Your creator card has been saved.",
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

  const savePhoto = async () => {
    if (!photoFile) {
      return;
    }

    if (
      !photoFile.type.startsWith(
        "image/",
      )
    ) {
      toast.add({
        title: "Invalid image",
        description:
          "Choose a PNG, JPEG or WebP image.",
        type: "error",
        timeout: 2500,
      });

      return;
    }

    if (
      photoFile.size >
      3 * 1024 * 1024
    ) {
      toast.add({
        title: "Image is too large",
        description:
          "Choose an image smaller than 3 MB.",
        type: "error",
        timeout: 2500,
      });

      return;
    }

    setSaving(true);
    setError("");

    try {
      const profilePhotoUrl =
        await fileToDataUrl(
          photoFile,
        );

      const { data } =
        await updateCreatorProfile({
          profilePhotoUrl,
        });

      setProfile(data);
      setPhotoFile(null);
      setPhotoPreview("");
      setShowPhoto(false);

      toast.add({
        title:
          "Profile photo updated",
        description:
          "Your creator card now uses the new photo.",
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
      setSaving(false);
    }
  };

  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0] ??
      null;

    if (!file) {
      return;
    }

    setPhotoFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      setPhotoPreview(
        typeof reader.result ===
          "string"
          ? reader.result
          : "",
      );
    };

    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="overflow-hidden rounded-[28px] border border-[#dce4ef] bg-white">
            <Skeleton className="h-[180px] rounded-none" />

            <div className="space-y-4 px-8 pb-9 pt-20">
              <Skeleton className="mx-auto h-8 w-48" />
              <Skeleton className="mx-auto h-4 w-32" />
              <Skeleton className="mx-auto h-20 w-full" />
            </div>
          </div>

          <div className="rounded-[24px] border border-[#dfe5ed] bg-white p-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-4 h-16 w-full rounded-xl" />
            <Skeleton className="mt-3 h-10 w-full rounded-lg" />
            <Skeleton className="mt-2 h-10 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="rounded-xl border border-[#f1c7c7] bg-[#fff7f7] px-4 py-3 text-sm text-[#9b3e3e]">
          {error ||
            "Unable to load your creator card."}
        </div>
      </div>
    );
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
            Review exactly what brands can discover
            from your Naano card.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setShowEdit(true)
            }
            className="cursor-pointer"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>

          <a
            href={publicUrl || "#"}
            target={
              publicUrl
                ? "_blank"
                : undefined
            }
            rel="noreferrer"
            onClick={(event) => {
              if (!publicUrl) {
                event.preventDefault();
              }
            }}
            className="inline-flex cursor-pointer items-center rounded-md border border-[#dce3ec] px-4 text-sm font-medium text-[#59667e] transition hover:bg-[#f8fafc]"
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

      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div
          className="relative min-h-[720px] [perspective:1600px]"
          onMouseEnter={() =>
            setHovered(true)
          }
          onMouseLeave={() =>
            setHovered(false)
          }
        >
          <motion.div
            initial={false}
            animate={{
              rotateY: showDetails
                ? 180
                : 0,
            }}
            transition={{
              duration: 0.72,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="relative min-h-[720px] w-full [transform-style:preserve-3d]"
          >
            <div
              className={
                "absolute inset-0 overflow-visible rounded-[32px] border border-[#cdd9ee] bg-white shadow-[0_24px_80px_rgba(34,60,100,0.11)] [backface-visibility:hidden] " +
                (showDetails
                  ? "pointer-events-none"
                  : "pointer-events-auto")
              }
            >
              <div className="relative h-[180px] overflow-hidden rounded-t-[32px] bg-gradient-to-br from-[#2159df] via-[#316df0] to-[#6f91f3]">
                <motion.div
                  animate={{
                    scale:
                      hovered
                        ? 1.035
                        : 1,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  className="absolute inset-0"
                >
                  <div className="absolute -left-16 -top-20 h-52 w-52 rounded-full border border-white/10" />
                  <div className="absolute -right-20 top-8 h-56 w-56 rounded-full border border-white/10" />
                </motion.div>

                <div className="absolute left-8 top-7 text-2xl font-bold text-white">
                  naano
                </div>

                <div className="absolute right-8 top-7 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-[#2864f0]">
                  {profile.country ||
                    "Global"}
                </div>

                <motion.button
                  type="button"
                  onClick={() =>
                    setShowPhoto(true)
                  }
                  whileHover={{
                    scale: 1.04,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="group absolute -bottom-14 left-1/2 flex h-28 w-28 -translate-x-1/2 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-[#316df0] bg-[#6572cc] text-4xl text-white shadow-[0_8px_30px_rgba(24,69,165,0.25)]"
                  aria-label="Change profile photo"
                >
                  {profile.profile_photo_url ? (
                    <img
                      src={
                        profile.profile_photo_url
                      }
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials(
                      profile.name,
                    )
                  )}

                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition duration-200 group-hover:bg-black/35 group-hover:opacity-100">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#28344b] shadow-lg">
                      <Pencil className="h-4 w-4" />
                    </span>
                  </span>
                </motion.button>
              </div>

              <div className="px-8 pb-10 pt-20 text-center">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#8a97aa]">
                  {profile.category ||
                    "Creator"}
                </p>

                <h2 className="mt-2 text-[34px] font-semibold tracking-[-1.4px] text-[#141a29]">
                  {profile.name ||
                    "Creator"}
                </h2>

                <p className="mx-auto mt-2 max-w-[620px] text-[16px] leading-7 text-[#66748a]">
                  {profile.headline ||
                    profile.bio ||
                    "Build a clear creator profile for brands to discover."}
                </p>

                {industries.length >
                  0 && (
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {industries
                      .slice(0, 6)
                      .map(
                        (industry) => (
                          <span
                            key={
                              industry
                            }
                            className="rounded-full border border-[#e0e6ef] bg-[#fafbfd] px-3 py-1.5 text-xs font-medium text-[#617089]"
                          >
                            {industry}
                          </span>
                        ),
                      )}
                  </div>
                )}

                <div className="mt-9 grid grid-cols-3 border-y border-[#e8ecf2] py-6">
                  <CardStat
                    label="Followers"
                    value={followers}
                  />

                  <CardStat
                    label="Est. impressions"
                    value={
                      impressions
                    }
                  />

                  <div className="border-l border-[#e8ecf2]">
                    <p className="text-2xl font-semibold text-[#182239]">
                      {formatCurrency(
                        profile.price_cents ??
                          0,
                        profile.currency ??
                          "EUR",
                      )}
                    </p>

                    <p className="mt-1 text-xs text-[#8794aa]">
                      Chosen cost
                    </p>
                  </div>
                </div>
              </div>

              <motion.button
                type="button"
                onClick={() =>
                  setShowDetails(true)
                }
                initial={false}
                animate={{
                  opacity:
                    hovered
                      ? 1
                      : 0,
                  y:
                    hovered
                      ? 0
                      : 12,
                }}
                transition={{
                  duration: 0.22,
                  ease: "easeOut",
                }}
                className="absolute bottom-[-18px] left-1/2 z-20 inline-flex -translate-x-1/2 cursor-pointer items-center gap-2 rounded-full border border-[#bfd0f4] bg-white px-5 py-2.5 text-sm font-semibold text-[#3c4a62] shadow-[0_10px_28px_rgba(39,73,140,0.14)]"
              >
                More details

                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2864f0] text-white">
                  <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
                </span>
              </motion.button>
            </div>

            <div
              className={
                "absolute inset-0 overflow-hidden rounded-[32px] border border-[#cdd9ee] bg-white shadow-[0_24px_80px_rgba(34,60,100,0.11)] [backface-visibility:hidden] " +
                (showDetails
                  ? "pointer-events-auto"
                  : "pointer-events-none")
              }
              style={{
                transform:
                  "rotateY(180deg)",
              }}
            >
              <div className="relative h-[160px] overflow-hidden rounded-t-[32px] bg-gradient-to-br from-[#2159df] via-[#316df0] to-[#6f91f3]">
                <div className="absolute left-8 top-7 text-2xl font-bold text-white">
                  naano
                </div>

                <div className="absolute right-8 top-7 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-[#2864f0]">
                  {profile.country ||
                    "Global"}
                </div>

                <div className="absolute -bottom-12 left-1/2 flex h-24 w-24 -translate-x-1/2 items-center justify-center overflow-hidden rounded-full border-4 border-[#316df0] bg-[#6572cc] text-3xl text-white">
                  {profile.profile_photo_url ? (
                    <img
                      src={
                        profile.profile_photo_url
                      }
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials(
                      profile.name,
                    )
                  )}
                </div>
              </div>

              <div className="h-[560px] overflow-y-auto px-7 pb-24 pt-16">
                <div className="text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8795aa]">
                    PERFORMANCE & ICP
                  </p>

                  <h2 className="mt-2 text-[28px] font-semibold tracking-[-1px] text-[#172033]">
                    {profile.name ||
                      "Creator"}
                  </h2>

                  <p className="mt-2 text-sm text-[#7c899f]">
                    Public profile performance and
                    audience signals.
                  </p>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <DetailStat
                    label="Followers"
                    value={
                      followers > 0
                        ? followers.toLocaleString()
                        : "—"
                    }
                  />

                  <DetailStat
                    label="Reactions / post"
                    value={
                      reactionsPerPost >
                      0
                        ? Math.round(
                            reactionsPerPost,
                          ).toLocaleString()
                        : "—"
                    }
                  />

                  <DetailStat
                    label="Typical impressions"
                    value={
                      impressionsPerPost >
                      0
                        ? Math.round(
                            impressionsPerPost,
                          ).toLocaleString()
                        : "—"
                    }
                  />

                  <DetailStat
                    label="Posts"
                    value={
                      posts > 0
                        ? posts.toLocaleString()
                        : "—"
                    }
                  />

                  <DetailStat
                    label="Engagement rate"
                    value={formatRate(
                      engagementRate,
                    )}
                  />

                  <DetailStat
                    label="Public reach"
                    value={
                      impressions > 0
                        ? impressions.toLocaleString()
                        : "—"
                    }
                  />
                </div>

                <section className="mt-5 rounded-2xl border border-[#e1e7f0] p-5">
                  <h3 className="text-sm font-semibold text-[#243047]">
                    About
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#71809a]">
                    {profile.bio ||
                      profile.headline ||
                      "No public bio is available yet."}
                  </p>
                </section>

                <section className="mt-4 rounded-2xl border border-[#e1e7f0] p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eef4ff] text-[#2864f0]">
                      <Share2 className="h-4 w-4" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-[#243047]">
                        Who you target
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-[#7e8ba0]">
                        Based on your selected
                        industries and public
                        profile positioning.
                      </p>
                    </div>
                  </div>

                  {industries.length >
                  0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {industries.map(
                        (industry) => (
                          <span
                            key={
                              industry
                            }
                            className="rounded-full border border-[#dfe6ef] bg-[#fafbfd] px-3 py-1.5 text-xs font-medium text-[#5e6d85]"
                          >
                            {industry}
                          </span>
                        ),
                      )}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-xl border border-dashed border-[#d9e1ed] bg-[#fafbfd] px-4 py-5 text-center">
                      <p className="text-sm font-semibold text-[#69778d]">
                        Target pending
                      </p>

                      <p className="mt-1 text-xs text-[#929eb0]">
                        Add industries to your
                        creator profile to make
                        your audience positioning
                        visible.
                      </p>
                    </div>
                  )}
                </section>
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <motion.button
                  type="button"
                  onClick={() =>
                    setShowDetails(false)
                  }
                  whileHover={{
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#bfd0f4] bg-white px-5 py-2.5 text-sm font-semibold text-[#3c4a62] shadow-[0_10px_28px_rgba(39,73,140,0.14)]"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2864f0] text-white">
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </span>

                  View profile
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

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
              disabled={!publicUrl}
              className="cursor-pointer justify-start"
            >
              <Copy className="mr-2 h-4 w-4" />
              {copied
                ? "Copied"
                : "Copy link"}
            </Button>

            <Button
              type="button"
              onClick={() =>
                void shareCard()
              }
              disabled={!publicUrl}
              className="cursor-pointer justify-start bg-[#2864f0] hover:bg-[#1f58dc]"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share card
            </Button>

            <Link
              to="/dashboard/analytics"
              className="inline-flex cursor-pointer items-center justify-start rounded-md border border-[#dce3ec] px-4 py-2 text-sm font-medium text-[#59667e] transition hover:bg-[#f8fafc]"
            >
              View analytics
            </Link>
          </div>
        </aside>
      </section>

      <Dialog
        open={showPhoto}
        onOpenChange={(open) => {
          setShowPhoto(open);

          if (!open) {
            setPhotoFile(null);
            setPhotoPreview("");
          }
        }}
      >
        <DialogContent className="max-w-[520px]">
          <DialogHeader>
            <DialogTitle>
              Update profile photo
            </DialogTitle>
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
                    src={
                      profile.profile_photo_url
                    }
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials(
                    profile.name,
                  )
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
                onClick={() =>
                  void savePhoto()
                }
                disabled={
                  saving ||
                  !photoFile
                }
                className="cursor-pointer bg-[#171d2b] hover:bg-[#111827]"
              >
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}

                {saving
                  ? "Uploading…"
                  : "Save photo"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showEdit}
        onOpenChange={setShowEdit}
      >
        <DialogContent className="max-w-[620px]">
          <DialogHeader>
            <DialogTitle>
              Edit creator card
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            <Field
              label="Headline"
              value={draft.headline}
              onChange={(value) =>
                setDraft(
                  (current) => ({
                    ...current,
                    headline: value,
                  }),
                )
              }
            />

            <Field
              label="Category"
              value={draft.category}
              onChange={(value) =>
                setDraft(
                  (current) => ({
                    ...current,
                    category: value,
                  }),
                )
              }
            />

            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-[#626a78]">
                About
              </span>

              <textarea
                value={draft.bio}
                onChange={(event) =>
                  setDraft(
                    (current) => ({
                      ...current,
                      bio: event.target.value,
                    }),
                  )
                }
                rows={6}
                className="auth-input resize-none"
              />
            </label>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() =>
                  void saveProfile()
                }
                disabled={saving}
                className="cursor-pointer bg-[#171d2b] hover:bg-[#111827]"
              >
                {saving && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}

                <Save className="mr-2 h-4 w-4" />

                {saving
                  ? "Saving…"
                  : "Save changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-[#626a78]">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="auth-input"
      />
    </label>
  );
}

function CardStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <p className="text-2xl font-semibold text-[#182239]">
        {value > 0 ? (
          <AnimatedNumber
            value={value}
          />
        ) : (
          "—"
        )}
      </p>

      <p className="mt-1 text-xs text-[#8794aa]">
        {label}
      </p>
    </div>
  );
}

function DetailStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e1e7f0] bg-[#fcfdff] p-4 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#929eb0]">
        {label}
      </p>

      <p className="mt-3 text-xl font-semibold text-[#1d2a41]">
        {value}
      </p>
    </div>
  );
}
