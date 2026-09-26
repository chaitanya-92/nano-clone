import { Plus } from "lucide-react";
import { FieldError } from "@/auth/components/FieldError";
import {
  countries,
  getIndustrySuggestions,
  industries,
} from "@/data/creatorOptions";
import { Input } from "./RegisterFields";
import { useRegistrationForm } from "./registerContext";

export function RegisterCreatorProfileStep() {
  const {
    formik,
    customIndustries,
    setCustomIndustries,
    customIndustry,
    setCustomIndustry,
    showIndustryInput,
    setShowIndustryInput,
  } = useRegistrationForm();

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Input
          name="headline"
          label="Professional headline"
          placeholder="e.g. AI Engineer, Product Designer or Fintech Creator"
          formik={formik}
        />

        <label className="block">
          <span className="mb-2 block text-xs font-semibold text-[#626a78]">
            Country
          </span>

          <select
            name="country"
            value={formik.values.country}
            onChange={formik.handleChange}
            className="auth-input cursor-pointer"
          >
            <option value="">Select your country</option>
            {countries.map((country) => (
              <option key={country.code} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>

          <FieldError
            error={formik.errors.country}
            touched={formik.touched.country}
          />
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-xs font-semibold text-[#626a78]">
            About you
          </span>

          <textarea
            name="bio"
            value={formik.values.bio}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={4}
            placeholder="Tell brands what you build, who you help and what you can credibly talk about."
            className="w-full resize-none rounded-xl border border-[#d5d9df] p-4 text-[15px] outline-none focus:border-[#2864f0] focus:ring-2 focus:ring-[#2864f0]/10"
          />

          <FieldError error={formik.errors.bio} touched={formik.touched.bio} />
        </label>
      </div>

      <div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#626a78]">
              Industries
              <span className="ml-1 font-normal text-[#9aa1af]">(up to 3)</span>
            </p>

            <p className="mt-1 text-xs text-[#8a92a0]">
              Recommendations update from your professional headline.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowIndustryInput((value) => !value)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-[#4d5665] transition hover:bg-[#f4f5f7] hover:text-[#171d2b]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add industry
          </button>
        </div>

        {showIndustryInput && (
          <div className="mt-3 flex gap-2">
            <input
              value={customIndustry}
              onChange={(event) => setCustomIndustry(event.target.value)}
              onKeyDown={(event) => {
                if (event.key !== "Enter") {
                  return;
                }

                event.preventDefault();

                const value = customIndustry.trim();
                const allIndustries = [...industries, ...customIndustries];

                if (
                  !value ||
                  allIndustries.some(
                    (item) => item.toLowerCase() === value.toLowerCase(),
                  )
                ) {
                  return;
                }

                setCustomIndustries((items) => [...items, value]);
                setCustomIndustry("");
                setShowIndustryInput(false);

                if (formik.values.industries.length < 3) {
                  formik.setFieldValue("industries", [
                    ...formik.values.industries,
                    value,
                  ]);
                }
              }}
              placeholder="Add a custom industry"
              className="auth-input flex-1"
            />

            <button
              type="button"
              onClick={() => {
                const value = customIndustry.trim();
                const allIndustries = [...industries, ...customIndustries];

                if (
                  !value ||
                  allIndustries.some(
                    (item) => item.toLowerCase() === value.toLowerCase(),
                  )
                ) {
                  return;
                }

                setCustomIndustries((items) => [...items, value]);
                setCustomIndustry("");
                setShowIndustryInput(false);

                if (formik.values.industries.length < 3) {
                  formik.setFieldValue("industries", [
                    ...formik.values.industries,
                    value,
                  ]);
                }
              }}
              className="cursor-pointer rounded-xl bg-[#171d2b] px-4 text-xs font-semibold text-white transition hover:bg-[#111827]"
            >
              Add
            </button>
          </div>
        )}

        <div className="mt-4">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[.14em] text-[#2864f0]">
            Suggested for your headline
          </p>

          <div className="flex flex-wrap gap-2">
            {getIndustrySuggestions(formik.values.headline)
              .slice(0, 8)
              .map((industry) => {
                const selected = formik.values.industries.includes(industry);

                return (
                  <button
                    key={industry}
                    type="button"
                    onClick={() =>
                      formik.setFieldValue(
                        "industries",
                        selected
                          ? formik.values.industries.filter(
                              (item: string) => item !== industry,
                            )
                          : formik.values.industries.length < 3
                            ? [...formik.values.industries, industry]
                            : formik.values.industries,
                      )
                    }
                    className={
                      selected
                        ? "cursor-pointer rounded-full border border-[#2864f0] bg-[#eef4ff] px-3 py-2 text-xs font-medium text-[#245bdc]"
                        : "cursor-pointer rounded-full border border-[#dfe3e9] px-3 py-2 text-xs font-medium text-[#737c8d] transition hover:border-[#cbd1da] hover:text-[#374151]"
                    }
                  >
                    {industry}
                  </button>
                );
              })}
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[.14em] text-[#8a92a0]">
            All industries
          </p>

          <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto pr-1">
            {[...industries, ...customIndustries].map((industry) => {
              const selected = formik.values.industries.includes(industry);

              return (
                <button
                  key={industry}
                  type="button"
                  onClick={() =>
                    formik.setFieldValue(
                      "industries",
                      selected
                        ? formik.values.industries.filter(
                            (item: string) => item !== industry,
                          )
                        : formik.values.industries.length < 3
                          ? [...formik.values.industries, industry]
                          : formik.values.industries,
                    )
                  }
                  className={
                    selected
                      ? "cursor-pointer rounded-full border border-[#2864f0] bg-[#eef4ff] px-3 py-2 text-xs font-medium text-[#245bdc]"
                      : "cursor-pointer rounded-full border border-[#dfe3e9] px-3 py-2 text-xs font-medium text-[#737c8d] transition hover:border-[#cbd1da] hover:text-[#374151]"
                  }
                >
                  {industry}
                </button>
              );
            })}
          </div>

          <FieldError
            error={
              typeof formik.errors.industries === "string"
                ? formik.errors.industries
                : undefined
            }
            touched={Boolean(formik.touched.industries)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[#e2e7ef] bg-[#fafbfe] p-5">
        {(() => {
          const selectedCountry = countries.find(
            (country) => country.name === formik.values.country,
          );
          const currencySymbol = selectedCountry?.symbol ?? "¤";

          return (
            <>
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#2864f0]">
                  Price per post
                </p>

                {selectedCountry && (
                  <span className="text-xs font-medium text-[#8a92a0]">
                    {selectedCountry.currency}
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-center gap-3">
                <span className="text-2xl font-medium text-[#7d8491]">
                  {currencySymbol}
                </span>

                <input
                  name="priceCents"
                  type="number"
                  min="0"
                  step="1"
                  value={
                    formik.values.priceCents === undefined
                      ? ""
                      : formik.values.priceCents / 100
                  }
                  onChange={(event) => {
                    const value = event.target.value;

                    formik.setFieldValue(
                      "priceCents",
                      value === ""
                        ? undefined
                        : Math.round(Number(value) * 100),
                    );
                  }}
                  onBlur={() => formik.setFieldTouched("priceCents", true)}
                  placeholder="0"
                  className="w-40 bg-transparent text-3xl font-semibold tracking-[-.04em] outline-none placeholder:text-[#c4c9d1]"
                />
              </div>

              <FieldError
                error={formik.errors.priceCents}
                touched={formik.touched.priceCents}
              />
            </>
          );
        })()}
      </div>
    </div>
  );
}
