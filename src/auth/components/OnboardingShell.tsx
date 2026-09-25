import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, Sparkles, X } from "lucide-react";
import { motion } from "framer-motion";
import { Stepper } from "./Stepper";

interface Props {
  title: string;
  description: string;
  steps: string[];
  current: number;
  children: ReactNode;
  canBack: boolean;
  canNext: boolean;
  nextLabel?: string;
  onBack: () => void;
  onNext: () => void;
  saving?: boolean;
  modal?: boolean;
  onClose?: () => void;
  statusLabel?: string;
}

export function OnboardingShell({
  title,
  description,
  steps,
  current,
  children,
  canBack,
  canNext,
  nextLabel = "Continue",
  onBack,
  onNext,
  saving,
  modal = false,
  onClose,
  statusLabel,
}: Props) {
  return (
    <div className={modal ? "fixed inset-0 z-50 flex items-center justify-center bg-[#0b1020]/55 p-3 backdrop-blur-md md:p-6" : "min-h-screen bg-[#f5f7fb] text-[#151923]"}>
      <div className={modal ? "relative flex h-[calc(100vh-24px)] max-h-[920px] w-full max-w-[1180px] min-h-0 overflow-hidden rounded-[28px] bg-white shadow-[0_40px_120px_rgba(8,15,30,.28)]" : "mx-auto flex min-h-screen max-w-[1540px]"}>
        <aside className="relative hidden w-[39%] shrink-0 overflow-hidden bg-[#2864f0] px-10 py-10 text-white lg:flex lg:flex-col xl:px-14">
          <div className="relative flex items-center justify-between gap-2 text-2xl font-bold tracking-[-.05em]">
            <span>naano<span className="text-[#63b8ff]">.</span></span>
            {modal && onClose && <button type="button" onClick={onClose} aria-label="Close onboarding" className="cursor-pointer rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white lg:hidden"><X className="h-5 w-5" /></button>}
          </div>
          <div className="relative mt-auto max-w-md pb-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white"><Sparkles className="h-3.5 w-3.5" />Build your presence once</div>
            <h2 className="text-[clamp(2.6rem,4vw,4.5rem)] font-semibold leading-[.98] tracking-[-.06em]">Turn your profile into your next opportunity.</h2>
            <p className="mt-6 max-w-sm text-[15px] leading-7 text-white/55">Set up your identity, positioning and marketplace details. Everything stays connected to your workspace.</p>
            <div className="mt-10 grid grid-cols-2 gap-3">
              {[["01", "Identity"], ["02", "Positioning"], ["03", "Proof"], ["04", "Launch"]].map(([num, label]) => <div key={num} className="rounded-2xl border border-white/20 bg-white/10 p-4"><span className="text-[11px] font-bold text-white/90">{num}</span><p className="mt-5 text-sm font-medium text-white/75">{label}</p></div>)}
            </div>
          </div>
          <div className="relative flex items-center justify-between border-t border-white/20 pt-5 text-xs text-white/65"><span>Creator & brand marketplace</span><span>Secure onboarding</span></div>
        </aside>
        <main className="flex min-h-0 min-w-0 flex-1 flex-col bg-white">
          <header className="relative z-10 flex shrink-0 items-center justify-between border-b border-[#edf0f4] bg-white px-6 py-5 md:px-10">
            <div className="text-xl font-bold tracking-[-.05em] lg:hidden">naano<span className="text-[#2864f0]">.</span></div>
            <div className="ml-auto flex items-center gap-3 text-xs font-medium text-[#8992a2]">
              {statusLabel && (
                <span className="inline-flex items-center gap-2 rounded-full border border-[#dfe5ee] bg-[#f8fafc] px-3 py-1.5 font-semibold text-[#4f5969]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2864f0]" />
                  {statusLabel}
                </span>
              )}
              <span>Step {current + 1} of {steps.length}</span>
              <span className="h-1 w-1 rounded-full bg-[#cbd1da]" />
              <span>English</span>
              {modal && onClose && <button type="button" onClick={onClose} aria-label="Close onboarding" className="cursor-pointer rounded-lg p-2 text-[#8a92a0] transition hover:bg-[#f3f4f6] hover:text-[#252a34]"><X className="h-5 w-5" /></button>}
            </div>
          </header>
          <div className="relative z-10 shrink-0 border-b border-[#edf0f4] bg-[#fbfcfe] px-6 py-5 md:px-10">
            <div className="mx-auto max-w-4xl"><Stepper steps={steps} current={current} /></div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="mx-auto flex w-full max-w-4xl flex-col px-6 py-9 md:px-10 md:py-12">
              <div className="max-w-2xl">
                <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#2864f0]">{steps[current]}</p>
                <h1 className="mt-3 text-[34px] font-semibold leading-tight tracking-[-.045em] text-[#171d2b] md:text-[42px]">{title}</h1>
                <p className="mt-3 max-w-xl text-[15px] leading-7 text-[#737c8d]">{description}</p>
              </div>
              <motion.div key={current} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .22 }} className="mt-9">{children}</motion.div>
              <div className="mt-10 flex items-center justify-between border-t border-[#edf0f4] pt-5">
                <button type="button" disabled={!canBack || saving} onClick={onBack} className="inline-flex items-center gap-2 rounded-xl px-2 py-3 text-sm font-semibold text-[#737c8d] hover:text-[#202635] disabled:pointer-events-none disabled:opacity-25"><ArrowLeft className="h-4 w-4" />Back</button>
                <button type="button" disabled={!canNext || saving} onClick={onNext} className="group inline-flex min-w-[150px] items-center justify-center gap-2 rounded-xl bg-[#171d2b] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(23,29,43,.15)] transition hover:-translate-y-0.5 hover:bg-[#111827] disabled:cursor-not-allowed disabled:opacity-45">{saving ? "Saving…" : nextLabel}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
