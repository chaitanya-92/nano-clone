import { useRegistrationForm } from "./registerContext";
import type { RegistrationValues } from "./registerTypes";

export function RegisterBrandReviewStep() {
  const { formik } = useRegistrationForm();

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-[#f5f8ff] p-6">
        <p className="text-xs font-bold uppercase tracking-[.15em] text-[#2864f0]">
          Ready to launch
        </p>
        <p className="mt-3 text-2xl font-semibold tracking-[-.03em]">
          {formik.values.companyName || "Your company"}
        </p>
        <p className="mt-2 text-sm leading-6 text-[#687386]">
          {formik.values.valueProposition ||
            "Your value proposition will appear here."}
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {formik.values.icps
          .filter((item: RegistrationValues["icps"][number]) => item.title)
          .map((item: RegistrationValues["icps"][number]) => (
            <div
              key={item.title}
              className="rounded-xl border border-[#e4e8ee] p-4"
            >
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="mt-1 text-xs leading-5 text-[#737c8d]">
                {item.description}
              </p>
            </div>
          ))}
      </div>
      <p className="text-sm text-[#737c8d]">
        Your profile will be saved to your workspace and can be refined later.
      </p>
    </div>
  );
}
