import type { FormikProps } from "formik";

export type ProfessionalTermKey =
  | "taxResponsibilityConfirmed"
  | "selfBillingMandateAccepted"
  | "certificationAccepted";

export type ProfessionalTerm = {
  key: ProfessionalTermKey;
  label: string;
  title: string;
  description: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
};

export type WebsiteAnalysis = {
  company_name?: string;
  description?: string;
};

export type RegistrationValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "creator" | "brand";
  linkedinUrl: string;
  xProfileUrl: string;
  country: string;
  industries: string[];
  headline: string;
  bio: string;
  priceCents?: number;
  registrationCountry: string;
  registeredBusiness: boolean;
  legalStatus: string;
  legalName: string;
  tradeName: string;
  panGstin: string;
  legalAddress: string;
  taxResponsibilityConfirmed: boolean;
  selfBillingMandateAccepted: boolean;
  certificationAccepted: boolean;
  website: string;
  companyName: string;
  description: string;
  valueProposition: string;
  icps: Array<{
    title: string;
    description: string;
  }>;
  brief: string;
};

export type EmailStatus = "idle" | "checking" | "available" | "taken";

export type RegistrationFormik = FormikProps<RegistrationValues>;
