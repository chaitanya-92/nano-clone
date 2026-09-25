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
}

export function TermsReaderDialog({
  open,
  title,
  description,
  sections,
  onOpenChange,
}: TermsReaderDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
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

        <div className="max-h-[52vh] overflow-y-auto px-6 py-5">
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
          </div>
        </div>

        <DialogFooter className="border-[#edf0f4] bg-white">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer rounded-lg bg-[#171d2b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#111827]"
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
