import { Check, Copy, ExternalLink, Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { copyText, shareContent } from "@/dashboard/utils/share";

interface PublicCardActionsProps {
  url: string;
  title: string;
  compact?: boolean;
}

export function PublicCardActions({
  url,
  title,
  compact = false,
}: PublicCardActionsProps) {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handleCopy = async () => {
    if (!url) return;

    const success = await copyText(url);

    if (!success) {
      toast.add({
        title: "Copy failed",
        description: "Your browser did not allow clipboard access.",
        type: "error",
        timeout: 2600,
      });
      return;
    }

    setCopied(true);
    toast.add({
      title: "Card link copied",
      description: "Your public creator card link is ready to share.",
      type: "success",
      timeout: 2200,
    });

    window.setTimeout(() => setCopied(false), 1800);
  };

  const handleShare = async () => {
    if (!url || sharing) return;

    setSharing(true);

    try {
      const shared = await shareContent({
        url,
        title,
      });

      if (!shared) {
        toast.add({
          title: "Share unavailable",
          description: "Your browser could not open sharing.",
          type: "error",
          timeout: 2600,
        });
        return;
      }

      toast.add({
        title:
          typeof navigator.share === "function"
            ? "Card shared"
            : "Card link copied",
        description:
          typeof navigator.share === "function"
            ? "Your public creator card was shared."
            : "Sharing is unavailable here, so the public link was copied.",
        type: "success",
        timeout: 2200,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      toast.add({
        title: "Share failed",
        description: "The card could not be shared right now.",
        type: "error",
        timeout: 2600,
      });
    } finally {
      setSharing(false);
    }
  };

  const size = compact ? "sm" : "default";
  const baseClass =
    "cursor-pointer border-[#dce3ec] bg-white text-[#52617b] hover:bg-[#f7f9fc] hover:text-[#263247]";

  return (
    <div className={compact ? "grid gap-2" : "grid gap-2.5 sm:grid-cols-2"}>
      <Button
        type="button"
        variant="outline"
        size={size}
        onClick={() => void handleCopy()}
        disabled={!url}
        className={baseClass}
      >
        {copied ? (
          <Check className="mr-2 h-4 w-4 text-[#18945a]" />
        ) : (
          <Copy className="mr-2 h-4 w-4" />
        )}
        {copied ? "Copied" : "Copy link"}
      </Button>

      <Button
        type="button"
        size={size}
        onClick={() => void handleShare()}
        disabled={!url || sharing}
        className="cursor-pointer bg-[#171d2b] text-white hover:bg-[#111827]"
      >
        <Share2 className="mr-2 h-4 w-4" />
        {sharing ? "Sharing…" : "Share card"}
      </Button>

      <Button
        type="button"
        variant="outline"
        size={size}
        render={<a href={url || undefined} target="_blank" rel="noreferrer" />}
        disabled={!url}
        className={compact ? baseClass : `${baseClass} sm:col-span-2`}
      >
        <ExternalLink className="mr-2 h-4 w-4" />
        Open public card
      </Button>
    </div>
  );
}
