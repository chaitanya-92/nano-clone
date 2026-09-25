import type { IncomingMessage, ServerResponse } from "node:http";
import { getOnboarding, saveSocial, saveDetails, saveCard, saveProfessional, updateProfile } from "../controllers/onboardingController";

export async function onboardingRoutes(request: IncomingMessage, response: ServerResponse, url: URL) {
  if (url.pathname === "/api/onboarding" && request.method === "GET") return getOnboarding(request, response);
  if (url.pathname === "/api/onboarding/social" && request.method === "POST") return saveSocial(request, response);
  if (url.pathname === "/api/onboarding/details" && request.method === "POST") return saveDetails(request, response);
  if (url.pathname === "/api/onboarding/card" && request.method === "POST") return saveCard(request, response);
  if (url.pathname === "/api/onboarding/professional" && request.method === "POST") return saveProfessional(request, response);
  if (url.pathname === "/api/creator/profile" && request.method === "PATCH") return updateProfile(request, response);
  return false;
}
