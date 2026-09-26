import { analyzeCompanyWebsite } from "@/lib/onboarding";
import { Input } from "./RegisterFields";
import { useRegistrationForm } from "./registerContext";

export function RegisterBrandCompanyStep() {
  const {
  formik,
  analysis,
  setAnalysis,
  saving,
  setError,
  } = useRegistrationForm();

  return (
  <div className="space-y-5">
    <Input
      name="website"
      label="Company website"
      placeholder="https://yourcompany.com"
      formik={formik}
    />
    <button
      type="button"
      onClick={async () => {
        setError("");
        try {
          const result = await analyzeCompanyWebsite(
            formik.values.website,
          );
          setAnalysis(result.data);
          if (result.data?.company_name)
            formik.setFieldValue(
              "companyName",
              result.data.company_name,
            );
          if (result.data?.description)
            formik.setFieldValue(
              "description",
              result.data.description,
            );
        } catch (e) {
          setError(
            e instanceof Error
              ? e.message
              : "Unable to analyze the website.",
          );
        }
      }}
      disabled={!formik.values.website || saving}
      className="rounded-xl bg-[#2864f0] px-5 py-3 text-sm font-semibold text-white"
    >
      Analyze company website
    </button>
    {analysis && (
      <div className="rounded-2xl border border-[#dbe7ff] bg-[#f5f8ff] p-5">
        <p className="text-xs font-bold uppercase tracking-[.14em] text-[#2864f0]">
          Website analysis complete
        </p>
        <p className="mt-2 font-semibold">
          {analysis.company_name || "Company detected"}
        </p>
        <p className="mt-1 text-sm leading-6 text-[#687386]">
          {analysis.description ||
            "Review the extracted company information in the next step."}
        </p>
      </div>
    )}
  </div>
)}
  );
}
