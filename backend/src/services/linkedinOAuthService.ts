import { randomBytes } from "node:crypto";
import type { ServerResponse } from "node:http";
import { FRONTEND_ORIGIN, LINKEDIN_CALLBACK_URL, LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, OAUTH_STATE_COOKIE } from "../config/env";
import { setCookie } from "../utils/session";
import { createOAuthUser } from "./authService";

export function startLinkedInOAuth(response: ServerResponse, role: "creator" | "brand") {
  if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET || !LINKEDIN_CALLBACK_URL) return false;
  const state = randomBytes(24).toString("base64url");
  setCookie(response, OAUTH_STATE_COOKIE, state, { maxAge: 600 });
  setCookie(response, "naano_oauth_role", role, { maxAge: 600 });
  const params = new URLSearchParams({
    response_type: "code",
    client_id: LINKEDIN_CLIENT_ID,
    redirect_uri: LINKEDIN_CALLBACK_URL,
    state,
    scope: "openid profile email",
  });
  response.writeHead(302, { Location: `https://www.linkedin.com/oauth/v2/authorization?${params}`, "Cache-Control": "no-store" });
  response.end();
  return true;
}

export async function handleLinkedInCallback(code: string, role: "creator" | "brand") {
  if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET || !LINKEDIN_CALLBACK_URL) throw new Error("LinkedIn OAuth is not configured.");
  const tokenResponse = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET,
      redirect_uri: LINKEDIN_CALLBACK_URL,
    }),
  });
  const tokens: any = await tokenResponse.json();
  if (!tokenResponse.ok || !tokens.access_token) throw new Error("LinkedIn authentication failed.");
  const profileResponse = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const profile: any = await profileResponse.json();
  if (!profileResponse.ok || !profile.email) throw new Error("Unable to retrieve your LinkedIn profile.");
  return createOAuthUser({
    email: String(profile.email).toLowerCase(),
    name: String(profile.name || profile.given_name || "Naano member"),
    role,
    provider: "linkedin",
  });
}

export function getFrontendLinkedInErrorUrl(error: string) {
  return `${FRONTEND_ORIGIN}/register?error=${encodeURIComponent(error)}`;
}
