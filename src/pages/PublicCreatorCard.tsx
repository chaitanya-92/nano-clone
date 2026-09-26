import { ArrowLeft, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPublicCreatorCard } from "@/lib/dashboard";

export default function PublicCreatorCard() {
  const { slug = "" } = useParams();
  const [card, setCard] = useState<
    Awaited<ReturnType<typeof getPublicCreatorCard>>["data"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) {
      setError("Creator card not found.");
      setLoading(false);
      return;
    }

    void getPublicCreatorCard(slug)
      .then(({ data }) => setCard(data))
      .catch((value) =>
        setError(
          value instanceof Error ? value.message : "Creator card not found.",
        ),
      )
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8fc]">
        <p className="text-sm text-[#7d899f]">Loading creator card…</p>
      </main>
    );
  }

  if (!card) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8fc] px-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#171d2b]">
            Creator card not found
          </h1>
          <p className="mt-2 text-sm text-[#7d899f]">
            {error || "This public card is unavailable."}
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#171d2b] px-5 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Naano
          </Link>
        </div>
      </main>
    );
  }

  const industries = (() => {
    try {
      const value = JSON.parse(card.industries || "[]");

      return Array.isArray(value)
        ? value.filter((item): item is string => typeof item === "string")
        : [];
    } catch {
      return [];
    }
  })();

  const name = card.name || "Creator";
  const initials =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((value) => value[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "N";

  return (
    <main className="min-h-screen bg-[#f6f8fc] px-6 py-12">
      <div className="mx-auto max-w-[720px]">
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
            scale: 0.985,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.55,
            ease: "easeOut",
          }}
          whileHover={{
            y: -4,
          }}
          className="overflow-hidden rounded-[32px] border border-[#dce4ef] bg-white shadow-[0_24px_80px_rgba(30,55,95,0.10)]"
        >
          <div className="relative h-[170px] bg-gradient-to-br from-[#2159df] via-[#316df0] to-[#6f91f3]">
            <div className="absolute left-8 top-7 text-2xl font-bold text-white">
              naano
            </div>

            <div className="absolute right-8 top-7 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-[#2864f0]">
              {card.country || "Global"}
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
                stiffness: 240,
                damping: 19,
                delay: 0.1,
              }}
              className="absolute -bottom-14 left-1/2 flex h-28 w-28 -translate-x-1/2 items-center justify-center overflow-hidden rounded-full border-4 border-[#316df0] bg-[#6572cc] text-4xl font-medium text-white"
            >
              {card.profile_photo_url ? (
                <img
                  src={card.profile_photo_url}
                  alt={card.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </motion.div>
          </div>

          <div className="px-8 pb-10 pt-20 text-center">
            <h1 className="text-[32px] font-semibold tracking-[-1.2px] text-[#141a29]">
              {name}
            </h1>

            <p className="mt-2 text-[16px] text-[#7b879d]">
              {card.category || card.headline || "Creator"}
            </p>

            <p className="mx-auto mt-6 max-w-[560px] text-[15px] leading-7 text-[#617089]">
              {card.bio || card.headline || "Creator on Naano."}
            </p>

            {industries.length > 0 && (
              <div className="mt-7 flex flex-wrap justify-center gap-2">
                {industries.map((industry) => (
                  <span
                    key={industry}
                    className="rounded-full border border-[#dfe5ed] bg-[#fafbfc] px-3 py-1.5 text-xs font-medium text-[#617089]"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-10 grid grid-cols-3 border-y border-[#e8ecf2] py-6">
              <div>
                <p className="text-2xl font-semibold text-[#182239]">
                  {Number(card.followers ?? 0).toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-[#8794aa]">Followers</p>
              </div>

              <div className="border-x border-[#e8ecf2]">
                <p className="text-2xl font-semibold text-[#182239]">
                  {Number(card.impressions ?? 0).toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-[#8794aa]">Impressions</p>
              </div>

              <div>
                <p className="text-2xl font-semibold text-[#182239]">
                  {Number(card.post_count ?? 0).toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-[#8794aa]">Posts</p>
              </div>
            </div>

            {card.linkedin_url && (
              <a
                href={card.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#dce3ec] px-5 py-3 text-sm font-semibold text-[#53617a]"
              >
                LinkedIn
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
