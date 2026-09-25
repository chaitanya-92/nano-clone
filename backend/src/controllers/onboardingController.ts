import type { IncomingMessage, ServerResponse } from "node:http";
import { requireAuth } from "../middleware/authMiddleware";
import { db } from "../db/client";
import { error, json, readJson, stringValue, integerValue, arrayValue, now } from "../utils/api";

function creatorOnly(request: IncomingMessage, response: ServerResponse) {
  const user = requireAuth(request, response);
  if (!user) return null;
  if (user.role !== "creator") {
    error(response, 403, "CREATOR_ONLY", "Creator account required.");
    return null;
  }
  return user;
}

function profile(userId: string) {
  return db.prepare("SELECT * FROM creator_profiles WHERE user_id = ?").get(userId) as Record<string, unknown> | undefined;
}

export function getOnboarding(request: IncomingMessage, response: ServerResponse) {
  const user = creatorOnly(request, response);
  if (!user) return;
  return json(response, 200, { data: profile(user.id) });
}

export async function saveSocial(request: IncomingMessage, response: ServerResponse) {
  const user = creatorOnly(request, response);
  if (!user) return;
  const body = await readJson(request);
  const linkedinUrl = stringValue(body.linkedinUrl);
  const xProfileUrl = stringValue(body.xProfileUrl);
  if (!linkedinUrl && !xProfileUrl) return error(response, 422, "PROFILE_URL_REQUIRED", "Add a LinkedIn or X profile URL.");
  db.prepare("UPDATE creator_profiles SET linkedin_url = ?, x_profile_url = ?, onboarding_step = MAX(onboarding_step, 2), onboarding_status = 'in_progress', updated_at = ? WHERE user_id = ?").run(linkedinUrl, xProfileUrl, now(), user.id);
  return json(response, 200, { data: profile(user.id) });
}

export async function saveDetails(request: IncomingMessage, response: ServerResponse) {
  const user = creatorOnly(request, response);
  if (!user) return;
  const body = await readJson(request);
  const country = stringValue(body.country);
  const industries = arrayValue(body.industries);
  if (!country || industries.length < 1 || industries.length > 3) return error(response, 422, "INVALID_DETAILS", "Country and one to three industries are required.");
  db.prepare("UPDATE creator_profiles SET country = ?, industries = ?, onboarding_step = MAX(onboarding_step, 3), onboarding_status = 'in_progress', updated_at = ? WHERE user_id = ?").run(country, JSON.stringify(industries), now(), user.id);
  return json(response, 200, { data: profile(user.id) });
}

export async function saveCard(request: IncomingMessage, response: ServerResponse) {
  const user = creatorOnly(request, response);
  if (!user) return;
  const body = await readJson(request);
  const priceCents = integerValue(body.priceCents, -1);
  if (priceCents < 0) return error(response, 422, "INVALID_PRICE", "Price per post must be zero or greater.");
  db.prepare("UPDATE creator_profiles SET price_cents = ?, card_status = 'published', onboarding_step = MAX(onboarding_step, 4), onboarding_status = 'completed', updated_at = ? WHERE user_id = ?").run(priceCents, now(), user.id);
  return json(response, 200, { data: profile(user.id) });
}

export async function saveProfessional(request: IncomingMessage, response: ServerResponse) {
  const user = creatorOnly(request, response);
  if (!user) return;
  const body = await readJson(request);
  const legalName = stringValue(body.legalName);
  const legalAddress = stringValue(body.legalAddress);
  if (!legalName || !legalAddress || body.taxResponsibilityConfirmed !== true || body.selfBillingMandateAccepted !== true || body.certificationAccepted !== true) {
    return error(response, 422, "PROFESSIONAL_INFO_INCOMPLETE", "Complete the required professional information before saving.");
  }
  db.prepare("UPDATE creator_profiles SET registration_country = ?, registered_business = ?, legal_status = ?, legal_name = ?, trade_name = ?, pan_gstin = ?, legal_address = ?, tax_responsibility_confirmed = 1, self_billing_mandate_accepted = 1, certification_accepted = 1, professional_info_status = 'complete', updated_at = ? WHERE user_id = ?").run(
    stringValue(body.registrationCountry), body.registeredBusiness === true ? 1 : 0, stringValue(body.legalStatus), legalName, stringValue(body.tradeName), stringValue(body.panGstin), legalAddress, now(), user.id
  );
  return json(response, 200, { data: profile(user.id) });
}

export async function updateProfile(request: IncomingMessage, response: ServerResponse) {
  const user = creatorOnly(request, response);
  if (!user) return;
  const body = await readJson(request);
  const fields = [
    ["headline", stringValue(body.headline)],
    ["category", stringValue(body.category)],
    ["bio", stringValue(body.bio)],
    ["linkedin_url", stringValue(body.linkedinUrl)],
    ["x_profile_url", stringValue(body.xProfileUrl)],
  ];
  const assignments = fields.filter(([, value]) => value !== "").map(([field]) => field + " = ?");
  const values = fields.filter(([, value]) => value !== "").map(([, value]) => value);
  if (assignments.length) {
    db.prepare("UPDATE creator_profiles SET " + assignments.join(", ") + ", updated_at = ? WHERE user_id = ?").run(...values, now(), user.id);
  }
  return json(response, 200, { data: profile(user.id) });
}
