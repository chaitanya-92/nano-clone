import { Checkbox } from "@/components/ui/checkbox";
import { FieldError } from "@/auth/components/FieldError";
import { TermsReaderDialog } from "@/auth/components/TermsReaderDialog";
import { countries } from "@/data/creatorOptions";
import { Input } from "./RegisterFields";
import { useRegistrationForm } from "./registerContext";
import type { ProfessionalTerm } from "./registerTypes";

export function RegisterCreatorProfessionalStep() {
  const { formik, readTerms, setReadTerms, activeTerm, setActiveTerm } =
    useRegistrationForm();

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-xs font-semibold text-[#626a78]">
          Registration country
        </span>

        <select
          name="registrationCountry"
          value={formik.values.registrationCountry}
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
          error={formik.errors.registrationCountry}
          touched={formik.touched.registrationCountry}
        />
      </label>

      <Input
        name="legalName"
        label="Legal name"
        placeholder="Your legal name"
        formik={formik}
      />

      <Input
        name="legalAddress"
        label="Legal address"
        placeholder="Your billing address"
        formik={formik}
      />

      <label className="block">
        <span className="mb-2 block text-xs font-semibold text-[#626a78]">
          Legal status
        </span>

        <select
          name="legalStatus"
          value={formik.values.legalStatus}
          onChange={formik.handleChange}
          className="auth-input cursor-pointer"
        >
          <option value="individual">Individual</option>
          <option value="company">Company</option>
          <option value="sole_proprietorship">Sole proprietorship</option>
        </select>
      </label>

      {(
        [
          {
            key: "taxResponsibilityConfirmed",
            label: "I confirm I am responsible for applicable taxes.",
            title: "Tax responsibilities",
            description:
              "Review the tax responsibility acknowledgement before accepting it.",
            sections: [
              {
                heading: "What you are confirming",
                body: "You confirm that you are responsible for determining the taxes that apply to your creator earnings and for meeting the filing or payment obligations that apply to you in your country or jurisdiction.",
              },
              {
                heading: "Your information",
                body: "You are responsible for providing accurate registration, identity and payment information. Update your information when it changes so your account records remain current.",
              },
              {
                heading: "Taxes and deductions",
                body: "Depending on your location and transaction, taxes or deductions may apply to amounts shown in your workspace. Review those amounts with an appropriate tax professional when necessary.",
              },
              {
                heading: "Before accepting",
                body: "Make sure you understand the obligations that apply to you. This acknowledgement does not replace professional tax advice or the rules that apply in your jurisdiction.",
              },
            ],
          },
          {
            key: "selfBillingMandateAccepted",
            label: "I accept the self-billing mandate.",
            title: "Self-billing mandate",
            description:
              "Review the self-billing acknowledgement before accepting it.",
            sections: [
              {
                heading: "What self-billing means",
                body: "Self-billing is an invoicing arrangement where the customer or platform prepares an invoice or related transaction record on the supplier's behalf under agreed terms.",
              },
              {
                heading: "Your responsibilities",
                body: "You confirm that the information you provide for invoicing and payments is accurate and that you will review transaction records promptly.",
              },
              {
                heading: "Keeping records accurate",
                body: "Update your legal name, business details, registration information or tax details when they change so future transaction records can use current information.",
              },
              {
                heading: "Before accepting",
                body: "Review the transaction and invoicing details available to you and make sure the self-billing arrangement is appropriate for your business or individual status.",
              },
            ],
          },
          {
            key: "certificationAccepted",
            label: "I certify this information is accurate.",
            title: "Information certification",
            description:
              "Review the information certification acknowledgement before accepting it.",
            sections: [
              {
                heading: "What you are confirming",
                body: "You confirm that the information submitted during onboarding is complete and accurate to the best of your knowledge.",
              },
              {
                heading: "Updates",
                body: "Update information when material details change, including legal, payment or registration information used by your workspace.",
              },
              {
                heading: "Account records",
                body: "Accurate information helps keep your creator profile, transaction records and payment-related workflows consistent.",
              },
              {
                heading: "Before accepting",
                body: "Review the details you entered above and correct anything that is incomplete or inaccurate before completing onboarding.",
              },
            ],
          },
        ] as ProfessionalTerm[]
      ).map((term) => (
        <div key={term.key} className="rounded-xl border border-[#e4e8ee] p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={Boolean(formik.values[term.key])}
              onCheckedChange={(checked) =>
                formik.setFieldValue(term.key, Boolean(checked))
              }
              disabled={!readTerms[term.key]}
              aria-label={term.label}
              className="mt-0.5"
            />

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#555e6e]">{term.label}</p>

              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setActiveTerm({
                      key: term.key,
                      label: term.label,
                      title: term.title,
                      description: term.description,
                      sections: term.sections,
                    })
                  }
                  className="cursor-pointer text-xs font-semibold text-[#3f4857] underline underline-offset-2 transition hover:text-[#171d2b]"
                >
                  Read more
                </button>

                {!readTerms[term.key] && (
                  <span className="text-[11px] text-[#9aa1ad]">
                    Read to the end to unlock
                  </span>
                )}
              </div>

              <FieldError
                error={formik.errors[term.key]}
                touched={formik.touched[term.key]}
              />
            </div>
          </div>
        </div>
      ))}

      <TermsReaderDialog
        open={Boolean(activeTerm)}
        title={activeTerm?.title ?? ""}
        description={activeTerm?.description ?? ""}
        sections={activeTerm?.sections ?? []}
        onOpenChange={(open) => {
          if (!open) {
            setActiveTerm(null);
          }
        }}
        onReadComplete={() => {
          if (activeTerm) {
            setReadTerms((terms) => ({
              ...terms,
              [activeTerm.key]: true,
            }));
          }
        }}
      />
    </div>
  );
}
