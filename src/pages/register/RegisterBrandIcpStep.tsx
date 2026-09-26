import { FieldError } from "@/auth/components/FieldError";
import { countries, industries } from "@/data/creatorOptions";
import { Input } from "./RegisterFields";
import { useRegistrationForm } from "./registerContext";
import type { RegistrationValues } from "./registerTypes";

export function RegisterBrandIcpStep() {
  const {
  formik,
  } = useRegistrationForm();

  return (
  <div className="space-y-5">
    <div>
      <label className="mb-2 block text-xs font-semibold text-[#626a78]">
        Company name
      </label>
      <input
        name="companyName"
        value={formik.values.companyName}
        onChange={formik.handleChange}
        className="auth-input"
      />
    </div>
    <div>
      <label className="mb-2 block text-xs font-semibold text-[#626a78]">
        Description
      </label>
      <textarea
        name="description"
        value={formik.values.description}
        onChange={formik.handleChange}
        rows={3}
        className="w-full rounded-xl border border-[#d5d9df] p-4 outline-none focus:border-[#2864f0]"
      />
    </div>
    <div>
      <label className="mb-2 block text-xs font-semibold text-[#626a78]">
        Value proposition
      </label>
      <textarea
        name="valueProposition"
        value={formik.values.valueProposition}
        onChange={formik.handleChange}
        rows={4}
        className="w-full rounded-xl border border-[#d5d9df] p-4 outline-none focus:border-[#2864f0]"
      />
    </div>
    <Input
      name="country"
      label="Country"
      placeholder="India"
      formik={formik}
    />
    <div>
      <p className="mb-2 text-xs font-semibold text-[#626a78]">
        Industries
      </p>
      <div className="flex flex-wrap gap-2">
        {industries.map((item) => {
          const selected =
            formik.values.industries.includes(item);
          return (
            <button
              key={item}
              type="button"
              onClick={() =>
                formik.setFieldValue(
                  "industries",
                  selected
                    ? formik.values.industries.filter(
                        (x: string) => x !== item,
                      )
                    : formik.values.industries.length < 3
                      ? [...formik.values.industries, item]
                      : formik.values.industries,
                )
              }
              className={`rounded-full border px-3 py-2 text-xs font-medium ${selected ? "border-[#2864f0] bg-[#eef4ff] text-[#245bdc]" : "border-[#dfe3e9] text-[#737c8d]"}`}
            >
              {item}
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
    <div className="grid gap-4 md:grid-cols-3">
      {formik.values.icps.map((item: RegistrationValues["icps"][number], index: number) => (
        <div
          key={index}
          className="rounded-2xl border border-[#e3e7ed] p-4"
        >
          <input
            value={item.title}
            onChange={(e) => {
              const next = [...formik.values.icps];
              next[index] = {
                ...next[index],
                title: e.target.value,
              };
              formik.setFieldValue("icps", next);
            }}
            placeholder={`ICP ${index + 1}`}
            className="w-full border-0 p-1 font-semibold outline-none"
          />
          <textarea
            value={item.description}
            onChange={(e) => {
              const next = [...formik.values.icps];
              next[index] = {
                ...next[index],
                description: e.target.value,
              };
              formik.setFieldValue("icps", next);
            }}
            placeholder="Who are they?"
            rows={3}
            className="mt-2 w-full resize-none border-0 p-1 text-sm outline-none"
          />
        </div>
      ))}
    </div>
  </div>
)}
  );
}
