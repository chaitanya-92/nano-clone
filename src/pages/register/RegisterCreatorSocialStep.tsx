import { CheckCircle2, Globe2, Linkedin } from "lucide-react";
import { FieldError } from "@/auth/components/FieldError";
import { Input } from "./RegisterFields";
import { useRegistrationForm } from "./registerContext";
import { connectSocial } from "@/lib/onboarding";

export function RegisterCreatorSocialStep() {
  const {
  formik,
  socialStatus,
  setSocialStatus,
  socialErrors,
  setSocialErrors,
  saving,
  } = useRegistrationForm();

  return (
  <div className="space-y-5">
    <div className="rounded-2xl border border-[#dbe7ff] bg-[#f5f8ff] p-5">
      <p className="font-semibold">
        Connect your professional presence
      </p>
      <p className="mt-2 text-sm leading-6 text-[#687387]">
        We’ll verify the profile link before connecting it to your
        account.
      </p>
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <Input
          name="linkedinUrl"
          label="LinkedIn profile"
          placeholder="https://linkedin.com/in/your-profile"
          formik={formik}
          disabled={socialStatus.linkedin === "Connected"}
        />
        <button
          type="button"
          onClick={async () => {
            setSocialErrors((v) => ({ ...v, linkedin: "" }));
            try {
              await connectSocial(
                "linkedin",
                formik.values.linkedinUrl,
              );
              setSocialStatus((v) => ({
                ...v,
                linkedin: "Connected",
              }));
            } catch (e) {
              setSocialErrors((v) => ({
                ...v,
                linkedin:
                  e instanceof Error
                    ? e.message
                    : "Unable to verify LinkedIn profile.",
              }));
            }
          }}
          disabled={
            !formik.values.linkedinUrl ||
            saving ||
            socialStatus.linkedin === "Connected"
          }
          className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#0a66c2]/20 bg-[#f2f8fc] px-4 py-2.5 text-sm font-semibold text-[#0a66c2] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Linkedin className="h-4 w-4" variant="brand" />
          {socialStatus.linkedin === "Connected"
            ? "Connected"
            : "Connect LinkedIn"}
        </button>
        {socialErrors.linkedin && (
          <p className="mt-2 text-xs font-medium text-red-600">
            {socialErrors.linkedin}
          </p>
        )}
      </div>
      <div>
        <Input
          name="xProfileUrl"
          label="X profile"
          placeholder="https://x.com/your-handle"
          formik={formik}
          disabled={socialStatus.x === "Connected"}
        />
        <button
          type="button"
          onClick={async () => {
            setSocialErrors((v) => ({ ...v, x: "" }));
            try {
              await connectSocial("x", formik.values.xProfileUrl);
              setSocialStatus((v) => ({ ...v, x: "Connected" }));
            } catch (e) {
              setSocialErrors((v) => ({
                ...v,
                x:
                  e instanceof Error
                    ? e.message
                    : "Unable to verify X profile.",
              }));
            }
          }}
          disabled={
            !formik.values.xProfileUrl ||
            saving ||
            socialStatus.x === "Connected"
          }
          className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#e4e8ee] bg-white px-4 py-2.5 text-sm font-semibold text-[#202124] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Globe2 className="h-4 w-4" />
          {socialStatus.x === "Connected"
            ? "Connected"
            : "Connect X"}
        </button>
        {socialErrors.x && (
          <p className="mt-2 text-xs font-medium text-red-600">
            {socialErrors.x}
          </p>
        )}
      </div>
    </div>
    <div className="flex items-start gap-3 rounded-xl border border-[#e4e8ee] p-4 text-xs leading-5 text-[#737c8d]">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2864f0]" />
      Only information you submit or authorize is connected to
      your account.
    </div>
  </div>
)}
  );
}
