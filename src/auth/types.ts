export type OnboardingRole = "creator" | "brand";
export type VerificationStatus = "idle" | "pending" | "connected" | "failed";
export interface CreatorOnboardingValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  linkedinUrl: string;
  xProfileUrl: string;
  country: string;
  industries: string[];
  headline: string;
  bio: string;
  priceCents: number;
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
}
export interface BrandOnboardingValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  website: string;
  companyName: string;
  description: string;
  valueProposition: string;
  country: string;
  industries: string[];
  icps: { title: string; description: string }[];
  brief: string;
}
