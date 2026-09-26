import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { OnboardingShell } from "@/auth/components/OnboardingShell";
import {
  accountSchema,
  brandCompanySchema,
  creatorDetailsSchema,
  creatorPositioningSchema,
  creatorPricingSchema,
  creatorSocialSchema,
  professionalSchema,
} from "@/auth/schemas";
import { register } from "@/lib/auth";
import {
  saveBrandOnboarding,
  saveCreatorCard,
  saveCreatorDetails,
  saveCreatorProfessional,
  saveCreatorProfile,
  saveCreatorSocial,
} from "@/lib/onboarding";
import { signIn } from "@/features/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { toast } from "@/components/ui/toast";
import { RegistrationFormProvider } from "./registerContext";
import { brandSteps, creatorSteps, initialValues } from "./registerData";
import { RegisterAccountStep } from "./RegisterAccountStep";
import { RegisterBrandCompanyStep } from "./RegisterBrandCompanyStep";
import { RegisterBrandIcpStep } from "./RegisterBrandIcpStep";
import { RegisterBrandReviewStep } from "./RegisterBrandReviewStep";
import { RegisterCreatorProfessionalStep } from "./RegisterCreatorProfessionalStep";
import { RegisterCreatorProfileStep } from "./RegisterCreatorProfileStep";
import { RegisterCreatorSocialStep } from "./RegisterCreatorSocialStep";
import type {
  ProfessionalTerm,
  ProfessionalTermKey,
  RegistrationValues,
  WebsiteAnalysis,
} from "./registerTypes";

type RegistrationWizardProps = {
  role: "creator" | "brand";
  googleOnboarding: boolean;
  userName?: string | null;
  userEmail?: string | null;
  onExit: () => void;
};

export function RegistrationWizard({
  role,
  googleOnboarding,
  userName,
  userEmail,
  onExit,
}: RegistrationWizardProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(googleOnboarding ? 1 : 0);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [socialStatus, setSocialStatus] = useState<Record<string, string>>({});
  const [socialErrors, setSocialErrors] = useState<
    Record<"linkedin" | "x", string>
  >({
    linkedin: "",
    x: "",
  });
  const [customIndustries, setCustomIndustries] = useState<string[]>([]);
  const [customIndustry, setCustomIndustry] = useState("");
  const [showIndustryInput, setShowIndustryInput] = useState(false);
  const [readTerms, setReadTerms] = useState<
    Record<ProfessionalTermKey, boolean>
  >({
    taxResponsibilityConfirmed: false,
    selfBillingMandateAccepted: false,
    certificationAccepted: false,
  });
  const [activeTerm, setActiveTerm] = useState<ProfessionalTerm | null>(null);
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null);
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const [emailVerified, setEmailVerified] = useState(false);

  const handleExistingEmail = () => {
    toast.add({
      title: "Account already exists",
      description: "We’ll redirect you to sign in.",
      type: "loading",
      timeout: 1800,
    });
    window.setTimeout(() => navigate("/login"), 1400);
  };

  return (
    <Formik<RegistrationValues>
      enableReinitialize
      initialValues={{
        ...initialValues,
        role,
        name: googleOnboarding ? (userName ?? "") : initialValues.name,
        email: googleOnboarding ? (userEmail ?? "") : initialValues.email,
      }}
      onSubmit={() =>
        navigate("/dashboard", {
          replace: true,
        })
      }
      validateOnBlur
      validateOnChange={false}
    >
      {(formik) => {
        const steps = role === "creator" ? creatorSteps : brandSteps;
        const validateStep = async () => {
          setError("");
          let schema: Yup.AnyObjectSchema;
          if (step === 0) schema = accountSchema;
          else if (role === "creator" && step === 1)
            schema = creatorSocialSchema;
          else if (role === "creator" && step === 2)
            schema = creatorPositioningSchema
              .concat(creatorPricingSchema)
              .concat(creatorDetailsSchema);
          else if (role === "creator" && step === 3)
            schema = professionalSchema;
          else if (role === "brand" && step === 1) schema = brandCompanySchema;
          else if (role === "brand" && step === 2)
            schema = Yup.object({
              companyName: Yup.string()
                .trim()
                .min(2)
                .required("Company name is required."),
              description: Yup.string()
                .trim()
                .min(20)
                .required("Add a company description."),
              valueProposition: Yup.string()
                .trim()
                .min(40)
                .required("Add your value proposition."),
              country: Yup.string().required("Country is required."),
              industries: Yup.array()
                .of(Yup.string())
                .min(1)
                .max(3)
                .required("Choose at least one industry."),
            });
          else schema = Yup.object();
          try {
            await schema.validate(formik.values, { abortEarly: false });
            if (step === 0 && !emailVerified) {
              formik.setFieldError(
                "email",
                "Verify your email before continuing.",
              );
              formik.setFieldTouched("email", true, false);
              setError(
                "Verify your email address with the 6-digit code before continuing.",
              );
              return false;
            }
            return true;
          } catch (error) {
            if (!(error instanceof Yup.ValidationError)) {
              return false;
            }

            const errors: Record<string, string> = {};

            error.inner.forEach((item: Yup.ValidationError) => {
              if (item.path && !errors[item.path]) {
                errors[item.path] = item.message;
              }
            });

            formik.setErrors(errors);
            Object.keys(errors).forEach((key) =>
              formik.setFieldTouched(key, true, false),
            );
            return false;
          }
        };
        const next = async () => {
          if (!(await validateStep())) return;
          setSaving(true);
          try {
            if (step === 0 && !googleOnboarding) {
              const result = await register(
                formik.values.name,
                formik.values.email,
                formik.values.password,
                role,
              );

              dispatch(signIn(result.user));
            } else if (role === "creator" && step === 1)
              await saveCreatorSocial({
                linkedinUrl: formik.values.linkedinUrl,
                xProfileUrl: formik.values.xProfileUrl,
              });
            else if (role === "creator" && step === 2) {
              await saveCreatorProfile({
                headline: formik.values.headline,
                bio: formik.values.bio,
              });
              await saveCreatorDetails({
                country: formik.values.country,
                industries: formik.values.industries,
              });
              if (typeof formik.values.priceCents !== "number") {
                formik.setFieldTouched("priceCents", true, false);
                formik.setFieldError("priceCents", "Set your price per post.");
                return;
              }

              await saveCreatorCard({
                priceCents: formik.values.priceCents,
              });
            } else if (role === "creator" && step === 3)
              await saveCreatorProfessional(formik.values);
            else if (role === "brand")
              await saveBrandOnboarding({
                ...formik.values,
                step: step + 1,
                icps: formik.values.icps.filter(
                  (item: RegistrationValues["icps"][number]) => item.title,
                ),
              });
            if (step < steps.length - 1) setStep((value) => value + 1);
            else navigate("/dashboard", { replace: true });
          } catch (e) {
            setError(
              e instanceof Error ? e.message : "Unable to save this step.",
            );
          } finally {
            setSaving(false);
          }
        };
        const title =
          step === 0
            ? "Create your Naano account"
            : role === "creator"
              ? ([
                  "Connect your professional profiles",
                  "Build your creator card",
                  "Complete professional information",
                ][step - 1] ?? "Your creator profile")
              : ([
                  "Tell us about your company",
                  "Define your value proposition and ICP",
                  "Review your brand profile",
                ][step - 1] ?? "Your brand profile");
        const description =
          step === 0
            ? "Start with your account, then we’ll build your marketplace profile with you."
            : role === "creator"
              ? "Connect your presence, shape your card and complete the information needed for paid work."
              : "Give us the context creators need to understand your company and campaign goals.";
        return (
          <Form>
            <RegistrationFormProvider
              value={{
                formik,
                role,
                step,
                emailStatus,
                setEmailStatus,
                emailVerified,
                setEmailVerified,
                handleExistingEmail,
                showPassword,
                setShowPassword,
                socialStatus,
                setSocialStatus,
                socialErrors,
                setSocialErrors,
                customIndustries,
                setCustomIndustries,
                customIndustry,
                setCustomIndustry,
                showIndustryInput,
                setShowIndustryInput,
                readTerms,
                setReadTerms,
                activeTerm,
                setActiveTerm,
                analysis,
                setAnalysis,
                saving,
                setError,
              }}
            >
              <OnboardingShell
                modal
                onClose={() => {
                  if (googleOnboarding) {
                    navigate("/dashboard", { replace: true });
                    return;
                  }

                  onExit();
                }}
                statusLabel={
                  role === "creator"
                    ? "Registering as Creator"
                    : "Registering as Company"
                }
                title={title}
                description={description}
                steps={steps}
                current={step}
                canBack={step > 0}
                canNext={!saving}
                nextLabel={
                  step === steps.length - 1 ? "Finish setup" : "Continue"
                }
                onBack={() => {
                  setError("");
                  setStep((value) => Math.max(0, value - 1));
                }}
                onNext={next}
                saving={saving}
              >
                {step === 0 && <RegisterAccountStep />}
                {role === "creator" && step === 1 && (
                  <RegisterCreatorSocialStep />
                )}
                {role === "creator" && step === 2 && (
                  <RegisterCreatorProfileStep />
                )}
                {role === "creator" && step === 3 && (
                  <RegisterCreatorProfessionalStep />
                )}
                {role === "brand" && step === 1 && <RegisterBrandCompanyStep />}
                {role === "brand" && step === 2 && <RegisterBrandIcpStep />}
                {role === "brand" && step === 3 && <RegisterBrandReviewStep />}

                {error && (
                  <p
                    role="alert"
                    className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                  >
                    {error}
                  </p>
                )}
              </OnboardingShell>
            </RegistrationFormProvider>
          </Form>
        );
      }}
    </Formik>
  );
}
