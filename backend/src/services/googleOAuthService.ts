import { randomBytes } from "node:crypto";
import type { ServerResponse } from "node:http";
import {
  FRONTEND_ORIGIN,
  OAUTH_STATE_COOKIE,
} from "../config/env";
import { setCookie } from "../utils/session";
import { db } from "../db/client";
import {
  createOAuthUser,
  findUserByEmail,
} from "./authService";

function getGoogleConfig() {
  const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL,
  } = process.env;

  return {
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackUrl: GOOGLE_CALLBACK_URL,
  };
}

export function startGoogleOAuth(
  response: ServerResponse,
  role: "creator" | "brand" = "creator",
  flow: "login" | "signup" = "login",
) {
  const {
    clientId,
    clientSecret,
    callbackUrl,
  } = getGoogleConfig();

  if (!clientId || !clientSecret || !callbackUrl) {
    return false;
  }

  const state = randomBytes(24).toString("base64url");

  setCookie(
    response,
    OAUTH_STATE_COOKIE,
    state,
    { maxAge: 600 },
  );
  setCookie(
    response,
    "naano_oauth_role",
    role,
    { maxAge: 600 },
  );
  setCookie(
    response,
    "naano_oauth_flow",
    flow,
    { maxAge: 600 },
  );

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });

  response.writeHead(302, {
    Location:
      `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
    "Cache-Control": "no-store",
  });

  response.end();

  return true;
}

export async function handleGoogleCallback(code: string, role: "creator" | "brand" = "creator") {
  const {
    clientId,
    clientSecret,
    callbackUrl,
  } = getGoogleConfig();

  if (!clientId || !clientSecret || !callbackUrl) {
    throw new Error("Google OAuth is not configured.");
  }

  const tokenResponse = await fetch(
    "https://oauth2.googleapis.com/token",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callbackUrl,
        grant_type: "authorization_code",
      }),
    },
  );

  const tokens: any = await tokenResponse.json();

  if (!tokenResponse.ok || !tokens.access_token) {
    throw new Error("Google authentication failed.");
  }

  const profileResponse = await fetch(
    "https://openidconnect.googleapis.com/v1/userinfo",
    {
      headers: {
        Authorization:
          `Bearer ${tokens.access_token}`,
      },
    },
  );

  const profile: any = await profileResponse.json();

  if (
    !profileResponse.ok ||
    !profile.email ||
    !profile.email_verified
  ) {
    throw new Error("Unable to verify Google account.");
  }

  const email = String(profile.email).toLowerCase();

  let user: any = findUserByEmail(email);
  let isNewUser = false;

  if (!user) {
    user = createOAuthUser({
      email,
      name: String(
        profile.name ||
          email.split("@")[0],
      ),
      role,
      provider: "google",
    });

    isNewUser = true;
  }

  const profileTable =
    role === "brand"
      ? "brand_profiles"
      : "creator_profiles";

  const onboarding = db
    .prepare(
      `SELECT onboarding_status
       FROM ${profileTable}
       WHERE user_id = ?
       LIMIT 1`,
    )
    .get(user.id) as
    | { onboarding_status?: string }
    | undefined;

  const needsOnboarding =
    onboarding?.onboarding_status !==
    "completed";

  return {
    user,
    isNewUser,
    needsOnboarding,
  };
}

export function getFrontendDashboardUrl() {
  return `${FRONTEND_ORIGIN}/dashboard`;
}

export function getFrontendOnboardingUrl(
  role: "creator" | "brand",
) {
  return `${FRONTEND_ORIGIN}/register?oauth=google&role=${role}`;
}

export function getFrontendLoginErrorUrl(error: string) {
  return `${FRONTEND_ORIGIN}/login?error=${encodeURIComponent(error)}`;
}
