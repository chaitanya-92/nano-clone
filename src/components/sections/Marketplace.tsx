import { motion } from "framer-motion";
import { ArrowRight, Bookmark, Grid2X2, Star } from "lucide-react";
import { marketplaceCreators } from "../../data/data";

function CreatorCard({ creator, index }: { creator: (typeof marketplaceCreators)[number]; index: number }) {
  return <motion.article initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.05, duration: 0.42 }} className="rounded-[1.4rem] border border-sky-100 bg-white p-3 shadow-[0_18px_38px_hsl(var(--naano-shadow)/0.1)]">
    <div className="h-20 rounded-[1rem] bg-[linear-gradient(135deg,#d7f2ff,#f8fcff_55%,#e3edff)] p-3">
      <div className="flex items-start justify-between"><span className="rounded-full bg-white/85 px-2 py-1 text-[0.62rem] font-bold text-slate-500">{index + 1}</span><span className="rounded-full bg-white px-2 py-1 text-[0.62rem] font-bold">Book</span></div>
    </div>
    <div className="-mt-7 text-center"><div className={`mx-auto grid h-12 w-12 place-items-center rounded-full border-4 border-white text-xs font-black text-slate-700 ${creator.tone}`}>{creator.initials}</div><h3 className="mt-2 text-sm font-extrabold">{creator.name}</h3><p className="text-[0.68rem] text-muted-foreground">{creator.specialty}</p><span className="mt-2 inline-block rounded-full bg-slate-50 px-2 py-1 text-[0.6rem] text-slate-500">{creator.country}</span></div>
    <p className="mt-3 line-clamp-2 text-center text-[0.63rem] leading-3 text-slate-400">Building intelligent systems that turn ideas into impactful outcomes for modern B2B teams.</p>
    <div className="mt-3 flex items-center justify-between text-[0.62rem] font-bold text-slate-500"><span>● MATCHING</span><span>{creator.score}</span></div><div className="mt-1 h-1.5 rounded-full bg-sky-100"><div className="h-full w-[90%] rounded-full bg-blue-600" /></div>
    <div className="mt-3 grid grid-cols-3 border-t border-slate-100 pt-2 text-center text-[0.62rem]"><span><b className="block text-sm text-slate-800">14.1K</b>FOLLOWERS</span><span><b className="block text-sm text-slate-800">18.7K</b>VIEWS</span><span><b className="block text-sm text-slate-800">{creator.value}</b>POST</span></div>
  </motion.article>;
}

export function Marketplace() {
  return <section id="companies" className="section-space cloud-wash"><div className="naano-shell">
    <div className="mx-auto max-w-3xl text-center"><p className="eyebrow"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-sky-400" />The Naano creator marketplace</p><h2 className="section-title mt-6">Work with all the<br />best creators.</h2><p className="section-copy mx-auto mt-6">Find the right B2B voices, compare their audience fit, and book every collaboration from one place.</p></div>
    <div className="marketplace-window mt-14 overflow-hidden p-4 sm:p-8"><div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-4 text-slate-400"><span className="h-3 w-3 rounded-full bg-slate-200" /><span className="h-3 w-3 rounded-full bg-sky-200" /><span className="h-3 w-3 rounded-full bg-sky-300" /><div className="mx-auto hidden rounded-lg border border-slate-100 px-20 py-2 text-xs font-medium sm:block">naano.co/marketplace</div></div><div className="flex gap-4"><aside className="hidden w-12 flex-col items-center gap-5 border-r border-slate-100 pr-4 pt-2 text-slate-400 sm:flex"><Grid2X2 className="h-4 w-4" /><Bookmark className="h-4 w-4" /><Star className="h-4 w-4" /></aside><div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{marketplaceCreators.map((creator, i) => <CreatorCard creator={creator} index={i} key={creator.name} />)}</div></div></div>
    <div className="mt-10 grid gap-4 md:grid-cols-3">{[["3,000+ vetted creators", "Specialist B2B voices, ready to collaborate."], ["Across 100 countries", "Local expertise with genuinely global reach."], ["Matched to your buyers", "Audience fit comes before follower count."]].map(([title, text]) => <div className="hairline-card rounded-[1.5rem] p-6" key={title}><div className="mb-14 flex -space-x-2"><span className="avatar bg-sky-200" /><span className="avatar bg-violet-200" /><span className="avatar bg-amber-200" /></div><h3 className="text-xl font-extrabold">{title}</h3><p className="mt-2 text-muted-foreground">{text}</p></div>)}</div>
  </div></section>;
}
