import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { FormikProps } from "formik";
import type {
  EmailStatus,
  ProfessionalTerm,
  RegistrationValues,
  WebsiteAnalysis,
} from "./registerTypes";

type Setter<T> = Dispatch<SetStateAction<T>>;

export type RegistrationFormContextValue = {
  formik: FormikProps<RegistrationValues>;
  role: "creator" | "brand";
  step: number;
  emailStatus: EmailStatus;
  setEmailStatus: Setter<EmailStatus>;
  emailVerified: boolean;
  setEmailVerified: Setter<boolean>;
  handleExistingEmail: () => void;
  showPassword: boolean;
  setShowPassword: Setter<boolean>;
  socialStatus: Record<string, string>;
  setSocialStatus: Setter<Record<string, string>>;
  socialErrors: Record<"linkedin" | "x", string>;
  setSocialErrors: Setter<Record<"linkedin" | "x", string>>;
  customIndustries: string[];
  setCustomIndustries: Setter<string[]>;
  customIndustry: string;
  setCustomIndustry: Setter<string>;
  showIndustryInput: boolean;
  setShowIndustryInput: Setter<boolean>;
  readTerms: Record<ProfessionalTerm["key"], boolean>;
  setReadTerms: Setter<Record<ProfessionalTerm["key"], boolean>>;
  activeTerm: ProfessionalTerm | null;
  setActiveTerm: Setter<ProfessionalTerm | null>;
  analysis: WebsiteAnalysis | null;
  setAnalysis: Setter<WebsiteAnalysis | null>;
  saving: boolean;
  setError: (value: string) => void;
};

const RegistrationFormContext =
  createContext<RegistrationFormContextValue | null>(null);

export function RegistrationFormProvider({
  value,
  children,
}: {
  value: RegistrationFormContextValue;
  children: React.ReactNode;
}) {
  return (
    <RegistrationFormContext.Provider value={value}>
      {children}
    </RegistrationFormContext.Provider>
  );
}

export function useRegistrationForm() {
  const context = useContext(RegistrationFormContext);

  if (!context) {
    throw new Error(
      "useRegistrationForm must be used inside RegistrationFormProvider.",
    );
  }

  return context;
}
