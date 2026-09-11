import { motion } from "framer-motion";
import { BarChart3, CheckCircle2, FileText, UsersRound, WalletCards } from "lucide-react";
import { workflowSteps } from "../../data/data";

const icons = { users: UsersRound, file: FileText, clipboard: CheckCircle2, chart: BarChart3, wallet: WalletCards };

export function Workflow() {
  return <section id="how-it-works" className="section-space bg-white"><div className="naano-shell"><div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end"><div><p className="eyebrow"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-sky-400" />One platform, from brief to results</p><h2 className="section-title mt-6 max-w-2xl">Run creator campaigns from one place.</h2></div><p className="section-copy max-w-xl">Find the right voices, launch faster, and connect every post to measurable business results.</p></div><div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{workflowSteps.map((step, index) => { const Icon = icons[step.icon as keyof typeof icons]; return <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06, duration: 0.4 }} className="workflow-card" key={step.number}><span className="step-number">{step.number}</span><div className="grid h-36 place-items-center"><div className="grid h-20 w-20 place-items-center rounded-2xl border border-sky-100 bg-sky-50/70 shadow-sm"><Icon className="h-8 w-8 text-blue-600" /></div></div><h3 className="text-lg font-extrabold leading-6">{step.title}</h3></motion.article>;})}</div></div></section>;
}
