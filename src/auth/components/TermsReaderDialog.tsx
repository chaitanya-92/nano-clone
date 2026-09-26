import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TermsReaderDialogProps {
  open: boolean;
  title: string;
  description: string;
  sections: {
    heading: string;
    body: string;
  }[];
  onOpenChange: (open: boolean) => void;
  onReadComplete: () => void;
}

export function TermsReaderDialog({
  open,
  title,
  description,
  sections,
  onOpenChange,
  onReadComplete,
}: TermsReaderDialogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);

  useEffect(() => {
    if (!open) {
      setHasReachedEnd(false);
      return;
    }

    const element = scrollRef.current;

    if (!element) {
      return;
    }

    const updateReadState = () => {
      const hasOverflow = element.scrollHeight > element.clientHeight + 2;

      const reachedEnd =
        !hasOverflow ||
        element.scrollTop + element.clientHeight >= element.scrollHeight - 4;

      setHasReachedEnd(reachedEnd);
    };

    const handleScroll = () => {
      updateReadState();
    };

    updateReadState();

    element.addEventListener("scroll", handleScroll, { passive: true });

    const resizeObserver = new ResizeObserver(updateReadState);

    resizeObserver.observe(element);

    const content = element.firstElementChild;

    if (content) {
      resizeObserver.observe(content);
    }

    window.requestAnimationFrame(updateReadState);

    return () => {
      element.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [open, sections]);

  const handleComplete = () => {
    if (!hasReachedEnd) {
      return;
    }

    onReadComplete();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="!w-[calc(100vw-32px)] !max-w-[720px] !gap-0 !overflow-hidden rounded-2xl border-[#dfe5ed] bg-white p-0 shadow-[0_28px_90px_rgba(18,28,46,0.22)]"
      >
        <DialogHeader className="shrink-0 border-b border-[#edf0f4] bg-white px-6 py-5">
          <DialogTitle className="pr-10 text-xl font-semibold tracking-[-0.02em] text-[#171d2b]">
            {title}
          </DialogTitle>

          <DialogDescription className="pr-8 text-sm leading-6 text-[#737c8d]">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div
          ref={scrollRef}
          className="min-h-0 max-h-[55vh] overflow-y-auto overscroll-contain px-6 py-6"
          onWheel={(event) => {
            event.stopPropagation();
          }}
        >
          <div className="space-y-7 pr-2">
            {sections.map((section) => (
              <section key={section.heading}>
                <h3 className="text-sm font-semibold text-[#252a34]">
                  {section.heading}
                </h3>

                <p className="mt-2 text-sm leading-7 text-[#687386]">
                  {section.body}
                </p>
              </section>
            ))}

            <div className="rounded-xl border border-[#e4e8ee] bg-[#f8fafc] p-4 text-xs leading-6 text-[#687386]">
              Please read through the complete text above. The acknowledgement
              checkbox becomes available after you reach the end.
            </div>
          </div>
        </div>

        <DialogFooter className="shrink-0 border-t border-[#edf0f4] bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs font-medium text-[#8a92a0]">
            {hasReachedEnd
              ? "You have reached the end."
              : "Scroll to the end to continue."}
          </span>

          <Button
            type="button"
            disabled={!hasReachedEnd}
            onClick={handleComplete}
            className="cursor-pointer rounded-xl bg-[#171d2b] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#111827] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Done reading
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
