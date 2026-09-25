import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Stepper } from "./Stepper";
interface Props { title:string; description:string; steps:string[]; current:number; children:ReactNode; canBack:boolean; canNext:boolean; nextLabel?:string; onBack:()=>void; onNext:()=>void; saving?:boolean; }
export function OnboardingShell({title,description,steps,current,children,canBack,canNext,nextLabel="Continue",onBack,onNext,saving}:Props){
 return <div className="min-h-screen bg-[#f5f7fb] text-[#151923]">
  <div className="mx-auto flex min-h-screen max-w-[1540px]">
   <aside className="relative hidden w-[39%] overflow-hidden bg-[#0c1220] px-10 py-10 text-white lg:flex lg:flex-col xl:px-14">
    <div className="absolute -left-28 top-24 h-72 w-72 rounded-full bg-[#2864f0]/30 blur-3xl"/>
    <div className="absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-[#63b8ff]/20 blur-3xl"/>
    <div className="relative flex items-center gap-2 text-2xl font-bold tracking-[-.05em]">naano<span className="text-[#63b8ff]">.</span></div>
    <div className="relative mt-auto max-w-md pb-10">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.06] px-3 py-1.5 text-xs font-semibold text-[#bcd8ff]"><Sparkles className="h-3.5 w-3.5"/>Build your presence once</div>
      <h2 className="text-[clamp(2.6rem,4vw,4.5rem)] font-semibold leading-[.98] tracking-[-.06em]">Turn your profile into your next opportunity.</h2>
      <p className="mt-6 max-w-sm text-[15px] leading-7 text-white/55">Set up your identity, positioning and marketplace details. Everything stays connected to your workspace.</p>
      <div className="mt-10 grid grid-cols-2 gap-3">
       {[["01","Identity"],["02","Positioning"],["03","Proof"],["04","Launch"]].map(([num,label])=><div key={num} className="rounded-2xl border border-white/10 bg-white/[.045] p-4"><span className="text-[11px] font-bold text-[#63b8ff]">{num}</span><p className="mt-5 text-sm font-medium text-white/75">{label}</p></div>)}
      </div>
    </div>
    <div className="relative flex items-center justify-between border-t border-white/10 pt-5 text-xs text-white/35"><span>Creator & brand marketplace</span><span>Secure onboarding</span></div>
   </aside>
   <main className="flex min-w-0 flex-1 flex-col bg-white">
    <header className="flex items-center justify-between border-b border-[#edf0f4] px-6 py-5 md:px-10">
      <div className="text-xl font-bold tracking-[-.05em] lg:hidden">naano<span className="text-[#2864f0]">.</span></div>
      <div className="ml-auto flex items-center gap-4 text-xs font-medium text-[#8992a2]"><span>Step {current+1} of {steps.length}</span><span className="h-1 w-1 rounded-full bg-[#cbd1da]"/><span>English</span></div>
    </header>
    <div className="border-b border-[#edf0f4] bg-[#fbfcfe] px-6 py-5 md:px-10"><div className="mx-auto max-w-4xl"><Stepper steps={steps} current={current}/></div></div>
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-9 md:px-10 md:py-12">
      <div className="max-w-2xl"><p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#2864f0]">{steps[current]}</p><h1 className="mt-3 text-[34px] font-semibold leading-tight tracking-[-.045em] text-[#171d2b] md:text-[42px]">{title}</h1><p className="mt-3 max-w-xl text-[15px] leading-7 text-[#737c8d]">{description}</p></div>
      <motion.div key={current} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.22}} className="mt-9 flex-1">{children}</motion.div>
      <div className="mt-10 flex items-center justify-between border-t border-[#edf0f4] pt-5">
       <button type="button" disabled={!canBack||saving} onClick={onBack} className="inline-flex items-center gap-2 rounded-xl px-2 py-3 text-sm font-semibold text-[#737c8d] hover:text-[#202635] disabled:pointer-events-none disabled:opacity-25"><ArrowLeft className="h-4 w-4"/>Back</button>
       <button type="button" disabled={!canNext||saving} onClick={onNext} className="group inline-flex min-w-[150px] items-center justify-center gap-2 rounded-xl bg-[#171d2b] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(23,29,43,.15)] transition hover:-translate-y-0.5 hover:bg-[#2864f0] disabled:cursor-not-allowed disabled:opacity-45">{saving?"Saving…":nextLabel}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5"/></button>
      </div>
    </div>
   </main>
  </div>
 </div>
}