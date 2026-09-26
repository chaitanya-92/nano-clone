import { ArrowRight, Check } from "lucide-react";
import { pricingPlans } from "../../data/data";
import { Button } from "../ui/button";

export function Pricing() {
  return (
    <section id="agencies" className="section-space cloud-wash">
      <div className="naano-shell">
        <h2 className="section-title">Pricing.</h2>
        <h3 className="mt-6 text-2xl font-bold">
          Start free. Upgrade when you want your time back.
        </h3>
        <p className="section-copy mt-4">
          Choose whether you want to run creator campaigns in-house or have
          Naano operate them.
        </p>
        <div className="mt-14 grid gap-7 lg:grid-cols-2">
          {pricingPlans.map((plan, index) => (
            <article
              className="hairline-card flex min-h-[35rem] flex-col rounded-[2rem] p-8 sm:p-12"
              key={plan.title}
            >
              <p className="eyebrow text-[hsl(var(--naano-copy))]">
                {plan.eyebrow}
              </p>
              <h3 className="mt-7 text-4xl font-black">{plan.title}</h3>
              <p className="mt-12 max-w-md text-lg leading-8 text-muted-foreground">
                {plan.copy}
              </p>
              <div className="mt-10 flex items-baseline gap-2">
                <strong className="text-5xl font-black">{plan.price}</strong>
                {plan.priceNote && (
                  <span className="text-lg text-muted-foreground">
                    {plan.priceNote}
                  </span>
                )}
              </div>
              <ul className="mt-10 divide-y divide-sky-100 border-y border-sky-100">
                {plan.features.map((feature) => (
                  <li className="flex gap-3 py-4 text-base" key={feature}>
                    <Check className="mt-0.5 h-5 w-5 text-blue-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-10">
                {index === 0 ? (
                  <a
                    className="inline-flex items-center gap-2 border-b border-slate-900 pb-1 font-bold"
                    href="#top"
                  >
                    {plan.action}
                    <ArrowRight className="h-5 w-5" />
                  </a>
                ) : (
                  <Button size="lg">
                    {plan.action}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
