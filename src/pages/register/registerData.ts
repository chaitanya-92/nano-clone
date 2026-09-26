import type { RegistrationValues } from "./registerTypes";

export const creatorSteps = [
  "Account",
  "Social profiles",
  "Creator card",
  "Professional",
];

export const brandSteps = ["Account", "Company", "Value prop & ICP", "Review"];

export const initialValues: Omit<RegistrationValues, "role"> & {
  role: "" | "creator" | "brand";
} = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
  linkedinUrl: "",
  xProfileUrl: "",
  country: "",
  industries: [],
  headline: "",
  bio: "",
  priceCents: undefined,
  registrationCountry: "",
  registeredBusiness: false,
  legalStatus: "individual",
  legalName: "",
  tradeName: "",
  panGstin: "",
  legalAddress: "",
  taxResponsibilityConfirmed: false,
  selfBillingMandateAccepted: false,
  certificationAccepted: false,
  website: "",
  companyName: "",
  description: "",
  valueProposition: "",
  icps: [
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
  ],
  brief: "",
};
