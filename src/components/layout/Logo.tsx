import { cn } from "../../lib/utils";

type LogoProps = {
  compact?: boolean;
  className?: string;
};

export function Logo({ compact = false, className }: LogoProps) {
  return (
    <a
      href="#top"
      aria-label="Naano home"
      className={cn(
        "group inline-flex items-center gap-2.5 font-black tracking-normal text-[hsl(var(--naano-ink))]",
        className,
      )}
    >
      <span className="relative h-7 w-10 shrink-0" aria-hidden="true">
        <span className="absolute left-0 top-1 h-3.5 w-6 rounded-[999px_999px_999px_0] bg-[hsl(var(--naano-ink))] transition-transform duration-300 group-hover:-translate-y-0.5" />
        <span className="absolute bottom-1 right-1 h-3.5 w-7 rounded-[999px_0_999px_999px] bg-[hsl(var(--naano-ink))] transition-transform duration-300 group-hover:translate-y-0.5" />
        <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-[hsl(var(--naano-blue))]" />
      </span>
      {!compact && <span className="text-[1.72rem] leading-none">naano</span>}
    </a>
  );
}
