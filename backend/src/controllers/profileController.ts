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
      .prepare("SELECT * FROM creator_profiles WHERE user_id=?")
      .get(user.id) as any;
    db.prepare(
      "UPDATE creator_profiles SET name=?,headline=?,category=?,bio=?,linkedin_url=?,x_profile_url=?,price_cents=?,updated_at=? WHERE user_id=?",
    ).run(
      stringValue(body.name, p.name),
      stringValue(body.headline, p.headline),
      stringValue(body.category, p.category),
      stringValue(body.bio, p.bio),
      stringValue(body.linkedinUrl, p.linkedin_url),
      stringValue(body.xProfileUrl, p.x_profile_url),
      integerValue(body.priceCents, p.price_cents),
      now(),
      user.id,
    );
    return json(response, 200, {
      data: db
        .prepare("SELECT * FROM creator_profiles WHERE user_id=?")
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
