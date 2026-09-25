import type { IncomingMessage, ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import { requireAuth } from "../middleware/authMiddleware";
import { db } from "../db/client";
import { error, json, now, stringValue } from "../utils/api";
import { fetchPublicSocialProfile } from "../services/socialProfileService";
type SocialProvider = "linkedin" | "x";

function normalizeProfileUrl(provider: SocialProvider, value: string) {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error("Enter a valid profile URL.");
  }

  if (url.protocol !== "https:") {
    throw new Error("Profile URL must use HTTPS.");
  }

  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");

  if (provider === "linkedin") {
    if (hostname !== "linkedin.com") {
      throw new Error("Enter a valid LinkedIn profile URL.");
    }

    if (!/^\/in\/[A-Za-z0-9][A-Za-z0-9._-]*\/?$/.test(url.pathname)) {
      throw new Error("Enter a valid LinkedIn profile URL.");
    }
  }

  if (provider === "x") {
    if (hostname !== "x.com" && hostname !== "twitter.com") {
      throw new Error("Enter a valid X profile URL.");
    }

    if (!/^\/[A-Za-z0-9_]{1,15}\/?$/.test(url.pathname)) {
      throw new Error("Enter a valid X profile URL.");
    }
  }

  url.search = "";
  url.hash = "";

  return url.toString().replace(/\/$/, "");
}

async function verifyProfileUrl(provider: SocialProvider, profileUrl: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(profileUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 NaanoSocialVerifier/1.0",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: controller.signal,
    });

    if (response.status === 404) {
      throw new Error(
        "This " +
          (provider === "linkedin" ? "LinkedIn" : "X") +
          " profile was not found.",
      );
    }

    if (response.status >= 500) {
      throw new Error(
        "The social profile could not be verified right now. Try again.",
      );
    }

    if (response.status === 401 || response.status === 403) {
      throw new Error(
        "The social profile could not be verified. Check that the profile URL is public and correct.",
      );
    }

    if (!response.ok) {
      throw new Error(
        "The social profile could not be verified. Check the profile URL and try again.",
      );
    }
  } catch (verificationError) {
    if (
      verificationError instanceof Error &&
      verificationError.name === "AbortError"
    ) {
      throw new Error("The social profile verification timed out. Try again.");
    }

    if (verificationError instanceof Error) {
      throw verificationError;
    }

    throw new Error("The social profile could not be verified. Try again.");
  } finally {
    clearTimeout(timeout);
  }
}

export function socialAccounts(
  request: IncomingMessage,
  response: ServerResponse,
) {
  const user = requireAuth(request, response);
  if (!user) return;
  return json(response, 200, {
    data: db
      .prepare(
        "SELECT id,provider,username,profile_url,profile_image_url,status,verified_at,created_at,updated_at FROM social_accounts WHERE user_id=? ORDER BY provider",
      )
      .all(user.id),
  });
}
export async function connectSocial(
  request: IncomingMessage,
  response: ServerResponse,
) {
  const user = requireAuth(request, response);
  if (!user) return;
  const body = await import("../utils/api").then((module) =>
    module.readJson(request),
  );

  const provider = stringValue(body.provider) as SocialProvider;

  if (provider !== "linkedin" && provider !== "x") {
    return error(
      response,
      422,
      "INVALID_PROVIDER",
      "Provider must be linkedin or x.",
    );
  }

  const rawProfileUrl = stringValue(body.profileUrl);

  if (!rawProfileUrl) {
    return error(
      response,
      422,
      "PROFILE_URL_REQUIRED",
      "Profile URL is required.",
    );
  }

  let profileUrl: string;

  try {
    profileUrl = normalizeProfileUrl(provider, rawProfileUrl);
    await verifyProfileUrl(provider, profileUrl);
  } catch (verificationError) {
    return error(
      response,
      422,
      "PROFILE_NOT_VERIFIED",
      verificationError instanceof Error
        ? verificationError.message
        : "The social profile could not be verified.",
    );
  }

  let fetchedProfile;

  try {
    fetchedProfile =
      await fetchPublicSocialProfile(
        provider,
        profileUrl,
      );
  } catch (profileError) {
    return error(
      response,
      422,
      "PROFILE_FETCH_FAILED",
      profileError instanceof Error
        ? profileError.message
        : "The public social profile could not be fetched.",
    );
  }

  const t = now();
  const id = randomUUID();

  db.prepare(
    "INSERT INTO social_accounts (id,user_id,provider,username,profile_url,profile_image_url,status,verified_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?) ON CONFLICT(user_id,provider) DO UPDATE SET username=excluded.username,profile_url=excluded.profile_url,profile_image_url=excluded.profile_image_url,status='connected',verified_at=excluded.verified_at,updated_at=excluded.updated_at",
  ).run(
    id,
    user.id,
    provider,
    fetchedProfile.username,
    profileUrl,
    fetchedProfile.profileImageUrl,
    "connected",
    t,
    t,
    t,
  );

  if (provider === "linkedin") {
    db.prepare(
      "UPDATE creator_profiles SET linkedin_url=?,name=COALESCE(NULLIF(?,''),name),headline=COALESCE(NULLIF(?,''),headline),profile_photo_url=COALESCE(NULLIF(?,''),profile_photo_url),followers=COALESCE(?,followers),updated_at=? WHERE user_id=?",
    ).run(
      profileUrl,
      fetchedProfile.name,
      fetchedProfile.headline,
      fetchedProfile.profileImageUrl,
      fetchedProfile.followers,
      t,
      user.id,
    );
  }

  if (provider === "x") {
    db.prepare(
      "UPDATE creator_profiles SET x_profile_url=?,name=COALESCE(NULLIF(?,''),name),bio=COALESCE(NULLIF(?,''),bio),profile_photo_url=COALESCE(NULLIF(?,''),profile_photo_url),followers=COALESCE(?,followers),updated_at=? WHERE user_id=?",
    ).run(
      profileUrl,
      fetchedProfile.name,
      fetchedProfile.bio,
      fetchedProfile.profileImageUrl,
      fetchedProfile.followers,
      t,
      user.id,
    );
  }

  return json(response, 200, {
    data: {
      provider,
      profileUrl,
      fetchedProfile,
    },
  });

}
