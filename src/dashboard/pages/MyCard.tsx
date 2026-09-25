import { Copy, ExternalLink, Pencil, Save, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
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

export default function MyCard() {
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    headline: "",
    category: "",
    bio: "",
  });
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    void getCreatorProfile()
      .then(({ data }) => {
        setProfile(data);
        setDraft({
          headline: data.headline,
          category: data.category,
          bio: data.bio,
        });
      })
      .catch((value) =>
        setError(
          value instanceof Error
            ? value.message
            : "Unable to load your creator card.",
        ),
      );
  }, []);

  const publicUrl = useMemo(
    () => (profile?.slug ? getPublicCardUrl(profile.slug) : ""),
    [profile?.slug],
  );

  const save = async () => {
    try {
      const { data } = await updateCreatorProfile(draft);

      setProfile(data);
      setOpen(false);
    } catch (value) {
      setError(
        value instanceof Error ? value.message : "Unable to save your card.",
      );
    }
  };

  const copyLink = async () => {
    if (!publicUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        publicUrl,
      );
    } catch {
      const textarea =
        document.createElement("textarea");

      textarea.value = publicUrl;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }

    setCopied(true);

    window.setTimeout(
      () => setCopied(false),
      1600,
    );
  };

  const share = async () => {
    if (!publicUrl) {
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title:
            (profile?.name ??
              "Creator") +
            " on Naano",
          url: publicUrl,
        });

        return;
      } catch {
        return;
      }
    }

    await copyLink();
  };

  const preview = () => {
    if (!publicUrl) {
      navigate("/dashboard/my-card");
      return;
    }

    window.open(
      publicUrl,
      "_blank",
      "noopener,noreferrer",
    );
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
    industries = JSON.parse(profile.industries || "[]");
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
            onClick={() => setOpen(true)}
            className="cursor-pointer"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={preview}
            className="cursor-pointer"
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
            y: 18,
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
          }}
          className="overflow-hidden rounded-[28px] border border-[#dce4ef] bg-white shadow-[0_20px_60px_rgba(34,60,100,0.08)]"
        >
          <div className="relative h-[170px] bg-gradient-to-br from-[#2159df] via-[#316df0] to-[#6f91f3]">
            <div className="absolute left-7 top-6 text-2xl font-bold text-white">
              naano
            </div>

            <div className="absolute right-7 top-6 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-[#2864f0]">
              {profile.country || "Global"}
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
              className="absolute -bottom-14 left-1/2 flex h-28 w-28 -translate-x-1/2 items-center justify-center rounded-full border-4 border-[#316df0] bg-[#6572cc] text-4xl text-white"
            >
              {profile.name
                ?.trim()
                .split(/\s+/)
                .filter(Boolean)
                .map((value) => value[0])
                .slice(0, 2)
                .join("")
                .toUpperCase() || "N"}
            </motion.div>
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
                  <span
                    key={industry}
                    className="rounded-full border border-[#dfe5ed] bg-[#fafbfc] px-3 py-1.5 text-xs font-medium text-[#60708a]"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8 grid grid-cols-3 border-y border-[#e8ecf2] py-6">
              <div>
                <p className="text-2xl font-semibold text-[#182239]">
                  {Number(profile.followers ?? 0).toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-[#8794aa]">Followers</p>
              </div>

              <div className="border-x border-[#e8ecf2]">
                <p className="text-2xl font-semibold text-[#182239]">
                  {Number(profile.impressions ?? 0).toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-[#8794aa]">Impressions</p>
              </div>

              <div>
                <p className="text-2xl font-semibold text-[#182239]">
                  {Number(profile.post_count ?? 0).toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-[#8794aa]">Posts</p>
              </div>
            </div>
          </div>
        </motion.div>

        <aside className="rounded-[24px] border border-[#dfe5ed] bg-white p-6 shadow-[0_4px_16px_rgba(32,52,82,0.035)]">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a96aa]">
            Public link
          </p>

          <p className="mt-3 break-all rounded-xl border border-[#e4e8ee] bg-[#f8fafc] px-4 py-3 text-sm text-[#52617b]">
            {publicUrl || "Publish your card to create a public link."}
          </p>

          <div className="mt-4 grid gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => void copyLink()}
              disabled={!publicUrl}
              className="cursor-pointer justify-start"
            >
              <Copy className="mr-2 h-4 w-4" />
              {copied ? "Copied" : "Copy link"}
            </Button>

            <Button
              type="button"
              onClick={() => void share()}
              disabled={!publicUrl}
              className="cursor-pointer justify-start bg-[#2864f0] hover:bg-[#1f58dc]"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share card
            </Button>

            <Link
              to="/dashboard/analytics"
              className="inline-flex cursor-pointer items-center justify-start rounded-md border border-[#dce3ec] px-4 py-2 text-sm font-medium text-[#59667e]"
            >
              View analytics
            </Link>
          </div>
        </aside>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[620px]">
          <DialogHeader>
            <DialogTitle>Edit creator card</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {[
              ["headline", "Headline"],
              ["category", "Category"],
            ].map(([key, label]) => (
              <label key={key} className="block">
                <span className="mb-2 block text-xs font-semibold text-[#626a78]">
                  {label}
                </span>

                <input
                  value={draft[key as keyof typeof draft]}
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
                className="cursor-pointer bg-[#171d2b] hover:bg-[#111827]"
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
