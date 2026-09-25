import type { IncomingMessage, ServerResponse } from "node:http";
import { requireAuth } from "../middleware/authMiddleware";
import { db } from "../db/client";
import {
  error,
  json,
  readJson,
  stringValue,
  integerValue,
  now,
} from "../utils/api";

export function getPublicCard(
  request: IncomingMessage,
  response: ServerResponse,
  slug: string,
) {
  const profile = db
    .prepare(
      "SELECT name,slug,linkedin_url,headline,category,bio,country,industries,followers,impressions,engagement_count,post_count,profile_photo_url,price_cents,currency,card_status FROM creator_profiles WHERE slug=? AND card_status='published'",
    )
    .get(slug);
  if (!profile)
    return error(response, 404, "CARD_NOT_FOUND", "Creator card not found.");
  return json(response, 200, { data: profile });
}
export function getProfile(request: IncomingMessage, response: ServerResponse) {
  const user = requireAuth(request, response);
  if (!user) return;
  if (user.role === "creator")
    return json(response, 200, {
      data: db
        .prepare("SELECT * FROM creator_profiles WHERE user_id=?")
        .get(user.id),
    });
  return json(response, 200, {
    data: db
      .prepare("SELECT * FROM brand_profiles WHERE user_id=?")
      .get(user.id),
  });
}
export async function patchProfile(
  request: IncomingMessage,
  response: ServerResponse,
) {
  const user = requireAuth(request, response);
  if (!user) return;
  const body = await readJson(request);
  if (user.role === "creator") {
    const p = db
      .prepare(
        "SELECT * FROM creator_profiles WHERE user_id=?",
      )
      .get(user.id) as
      | Record<string, unknown>
      | undefined;

    if (!p) {
      return error(
        response,
        404,
        "PROFILE_NOT_FOUND",
        "Creator profile not found.",
      );
    }

    const linkedinUrl = stringValue(
      body.linkedinUrl,
      String(p.linkedin_url ?? ""),
    ).trim();

    const xProfileUrl = stringValue(
      body.xProfileUrl,
      String(p.x_profile_url ?? ""),
    ).trim();

    const profilePhotoUrl =
      stringValue(
        body.profilePhotoUrl,
        String(
          p.profile_photo_url ?? "",
        ),
      ).trim();

    if (
      profilePhotoUrl &&
      !/^data:image\/(png|jpe?g|webp|gif);base64,/i.test(
        profilePhotoUrl,
      )
    ) {
      return error(
        response,
        422,
        "INVALID_PROFILE_PHOTO",
        "Upload a PNG, JPG, WEBP or GIF image.",
      );
    }

    if (
      profilePhotoUrl.length >
      2_100_000
    ) {
      return error(
        response,
        422,
        "PROFILE_PHOTO_TOO_LARGE",
        "Choose an image smaller than 1.5 MB.",
      );
    }

    const validateSocialUrl = (
      provider: "linkedin" | "x",
      value: string,
    ) => {
      if (!value) {
        return null;
      }

      let parsed: URL;

      try {
        parsed = new URL(value);
      } catch {
        return "Enter a valid " +
          (provider === "linkedin"
            ? "LinkedIn"
            : "X") +
          " profile URL.";
      }

      if (
        parsed.protocol !== "https:" ||
        (provider === "linkedin" &&
          parsed.hostname.toLowerCase().replace(/^www\./, "") !==
            "linkedin.com") ||
        (provider === "x" &&
          !["x.com", "twitter.com"].includes(
            parsed.hostname
              .toLowerCase()
              .replace(/^www\./, ""),
          ))
      ) {
        return "Enter a valid " +
          (provider === "linkedin"
            ? "LinkedIn"
            : "X") +
          " profile URL.";
      }

      const pathname =
        parsed.pathname.replace(
          /\/$/,
          "",
        );

      if (
        provider === "linkedin" &&
        !/^\/in\/[A-Za-z0-9][A-Za-z0-9._-]*$/.test(
          pathname,
        )
      ) {
        return "Enter a valid LinkedIn profile URL.";
      }

      if (
        provider === "x" &&
        !/^\/[A-Za-z0-9_]{1,15}$/.test(
          pathname,
        )
      ) {
        return "Enter a valid X profile URL.";
      }

      return null;
    };

    const linkedinError =
      validateSocialUrl(
        "linkedin",
        linkedinUrl,
      );

    if (linkedinError) {
      return error(
        response,
        422,
        "INVALID_LINKEDIN_URL",
        linkedinError,
      );
    }

    const xError = validateSocialUrl(
      "x",
      xProfileUrl,
    );

    if (xError) {
      return error(
        response,
        422,
        "INVALID_X_URL",
        xError,
      );
    }

    db.prepare(
      "UPDATE creator_profiles SET name=?,headline=?,category=?,bio=?,linkedin_url=?,x_profile_url=?,profile_photo_url=?,price_cents=?,updated_at=?" + 
      " WHERE user_id=?",
    ).run(
      stringValue(
        body.name,
        String(p.name ?? ""),
      ),
      stringValue(
        body.headline,
        String(p.headline ?? ""),
      ),
      stringValue(
        body.category,
        String(p.category ?? ""),
      ),
      stringValue(
        body.bio,
        String(p.bio ?? ""),
      ),
      linkedinUrl,
      xProfileUrl,
      profilePhotoUrl || null,
      integerValue(
        body.priceCents,
        Number(p.price_cents ?? 0),
      ),
      now(),
      user.id,
    );

    return json(response, 200, {
      data: db
        .prepare(
          "SELECT * FROM creator_profiles WHERE user_id=?",
        )
        .get(user.id),
    });
  }
  const p = db
    .prepare("SELECT * FROM brand_profiles WHERE user_id=?")
    .get(user.id) as any;
  if (!p)
    return error(
      response,
      404,
      "PROFILE_NOT_FOUND",
      "Brand profile not found.",
    );
  db.prepare(
    "UPDATE brand_profiles SET company_name=?,website=?,description=?,value_proposition=?,industries=?,country=?,updated_at=? WHERE user_id=?",
  ).run(
    stringValue(body.companyName, p.company_name),
    stringValue(body.website, p.website),
    stringValue(body.description, p.description),
    stringValue(body.valueProposition, p.value_proposition),
    JSON.stringify(
      Array.isArray(body.industries)
        ? body.industries
        : JSON.parse(p.industries),
    ),
    stringValue(body.country, p.country),
    now(),
    user.id,
  );
  return json(response, 200, {
    data: db
      .prepare("SELECT * FROM brand_profiles WHERE user_id=?")
      .get(user.id),
  });
}
