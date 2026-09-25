import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
      const reachedEnd =
        element.scrollTop + element.clientHeight >= element.scrollHeight - 16;

      setHasReachedEnd(reachedEnd);
    };

    updateReadState();
    element.addEventListener("scroll", updateReadState);

    return () => {
      element.removeEventListener("scroll", updateReadState);
    };
  }, [open]);

  function handleComplete() {
    if (!hasReachedEnd) {
      return;
    }

    onReadComplete();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="max-w-[720px] border-[#e2e7ee] bg-white p-0"
      >
        <DialogHeader className="border-b border-[#edf0f4] px-6 py-5">
          <DialogTitle className="text-xl font-semibold tracking-[-0.02em] text-[#171d2b]">
            {title}
          </DialogTitle>

          <DialogDescription className="text-sm leading-6 text-[#737c8d]">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div ref={scrollRef} className="max-h-[52vh] overflow-y-auto px-6 py-5">
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
              checkbox will become available after you reach the end.
            </div>
          </div>
        </div>

        <DialogFooter className="items-center justify-between border-[#edf0f4] bg-white">
          <span className="text-xs font-medium text-[#8a92a0]">
            {hasReachedEnd
              ? "You have reached the end."
              : "Scroll to the end to continue."}
          </span>

          <button
            type="button"
            disabled={!hasReachedEnd}
            onClick={handleComplete}
            className="cursor-pointer rounded-xl bg-[#171d2b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#111827] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Done reading
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
