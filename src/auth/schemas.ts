import * as Yup from "yup";
export const accountSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Enter at least 2 characters.")
    .max(80, "Name is too long.")
    .required("Name is required."),
  email: Yup.string()
    .trim()
    .email("Enter a valid email address.")
    .required("Email is required."),
  password: Yup.string()
    .min(8, "Use at least 8 characters.")
    .matches(/[A-Z]/, "Add an uppercase letter.")
    .matches(/[0-9]/, "Add a number.")
    .required("Password is required."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match.")
    .required("Confirm your password."),
});
export const creatorSocialSchema = Yup.object({
  linkedinUrl: Yup.string()
    .trim()
    .url("Enter a valid LinkedIn URL.")
    .matches(
      /^https?:\/\/(www\.)?linkedin\.com\//i,
      "Use a LinkedIn profile URL.",
    )
    .nullable(),
  xProfileUrl: Yup.string()
    .trim()
    .url("Enter a valid X URL.")
    .matches(/^https?:\/\/(www\.)?(x|twitter)\.com\//i, "Use an X profile URL.")
    .nullable(),
}).test(
  "social",
  "Add at least one social profile.",
  (
    v:
      | {
          linkedinUrl?: string | null;
          xProfileUrl?: string | null;
        }
      | undefined,
  ) => Boolean(v?.linkedinUrl || v?.xProfileUrl),
);
export const creatorDetailsSchema = Yup.object({
  country: Yup.string().required("Select your country."),
  industries: Yup.array()
    .of(Yup.string())
    .min(1, "Choose at least one industry.")
    .max(3, "Choose up to three industries."),
});
export const creatorPositioningSchema = Yup.object({
  headline: Yup.string()
    .trim()
    .max(120, "Keep the headline under 120 characters.")
    .required("Headline is required."),
  bio: Yup.string()
    .trim()
    .min(40, "Tell brands a little more about you.")
    .max(700, "Keep the bio under 700 characters.")
    .required("Bio is required."),
});
export const creatorPricingSchema = Yup.object({
  priceCents: Yup.number()
    .typeError("Enter a valid price.")
    .integer("Use a whole amount.")
    .min(0, "Price cannot be negative.")
    .required("Set your price per post."),
});
export const professionalSchema = Yup.object({
  registrationCountry: Yup.string().required(
    "Registration country is required.",
  ),
  legalName: Yup.string().trim().required("Legal name is required."),
  legalAddress: Yup.string().trim().required("Legal address is required."),
  legalStatus: Yup.string().required("Select your legal status."),
  taxResponsibilityConfirmed: Yup.boolean().oneOf(
    [true],
    "Confirmation is required.",
  ),
  selfBillingMandateAccepted: Yup.boolean().oneOf(
    [true],
    "Confirmation is required.",
  ),
  certificationAccepted: Yup.boolean().oneOf(
    [true],
    "Confirmation is required.",
  ),
});
export const brandCompanySchema = Yup.object({
  website: Yup.string()
    .trim()
    .url("Enter a valid company website.")
    .required("Company website is required."),
});
export const brandProfileSchema = Yup.object({
  companyName: Yup.string().trim().min(2).required("Company name is required."),
  description: Yup.string()
    .trim()
    .min(20)
    .required("Add a company description."),
  valueProposition: Yup.string()
    .trim()
    .min(40)
    .required("Add your value proposition."),
  country: Yup.string().required("Select your country."),
  industries: Yup.array().of(Yup.string()).min(1).max(3).required(),
});
