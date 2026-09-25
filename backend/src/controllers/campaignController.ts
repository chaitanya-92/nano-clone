import type { IncomingMessage, ServerResponse } from "node:http";
import { randomBytes } from "node:crypto";
import { db } from "../db/client";
import { requireAuth } from "../middleware/authMiddleware";
import { error, json, readJson, stringValue, integerValue, arrayValue, now } from "../utils/api";

export function listCampaigns(request: IncomingMessage, response: ServerResponse, url: URL) {
  const user = requireAuth(request, response);
  if (!user) return;
  const status = url.searchParams.get("status") ?? "open";
  const rows = user.role === "brand"
    ? db.prepare("SELECT * FROM campaigns WHERE brand_id = ? ORDER BY created_at DESC").all(user.id)
    : db.prepare("SELECT c.*, b.company_name AS brand_name FROM campaigns c JOIN brand_profiles b ON b.user_id = c.brand_id WHERE c.status = ? ORDER BY c.created_at DESC").all(status);
  return json(response, 200, { data: rows });
}

export function getCampaign(request: IncomingMessage, response: ServerResponse, id: string) {
  const user = requireAuth(request, response);
  if (!user) return;
  const row = db.prepare("SELECT c.*, b.company_name AS brand_name FROM campaigns c JOIN brand_profiles b ON b.user_id = c.brand_id WHERE c.id = ?").get(id) as any;
  if (!row) return error(response, 404, "CAMPAIGN_NOT_FOUND", "Campaign not found.");
  if (user.role === "brand" && row.brand_id !== user.id) return error(response, 403, "FORBIDDEN", "You cannot access this campaign.");
  return json(response, 200, { data: row });
}

export async function createCampaign(request: IncomingMessage, response: ServerResponse) {
  const user = requireAuth(request, response);
  if (!user || user.role !== "brand") return error(response, 403, "BRAND_ONLY", "Brand account required.");
  const body = await readJson(request);
  const title = stringValue(body.title);
  const description = stringValue(body.description);
  if (!title || !description) return error(response, 422, "INVALID_CAMPAIGN", "Title and description are required.");
  const id = randomBytes(16).toString("base64url");
  const timestamp = now();
  db.prepare("INSERT INTO campaigns (id,brand_id,title,description,brief,deliverables,requirements,budget_cents,currency,application_deadline,start_date,end_date,status,min_followers,max_applications,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)").run(
    id,user.id,title,description,stringValue(body.brief),JSON.stringify(arrayValue(body.deliverables)),JSON.stringify(arrayValue(body.requirements)),integerValue(body.budgetCents),stringValue(body.currency,"EUR"),stringValue(body.applicationDeadline)||null,stringValue(body.startDate)||null,stringValue(body.endDate)||null,stringValue(body.status,"draft"),integerValue(body.minFollowers),body.maxApplications == null ? null : integerValue(body.maxApplications),timestamp,timestamp
  );
  return json(response, 201, { data: db.prepare("SELECT * FROM campaigns WHERE id = ?").get(id) });
}

export async function updateCampaign(request: IncomingMessage, response: ServerResponse, id: string) {
  const user = requireAuth(request, response);
  if (!user || user.role !== "brand") return error(response, 403, "BRAND_ONLY", "Brand account required.");
  const campaign = db.prepare("SELECT * FROM campaigns WHERE id = ?").get(id) as any;
  if (!campaign) return error(response, 404, "CAMPAIGN_NOT_FOUND", "Campaign not found.");
  if (campaign.brand_id !== user.id) return error(response, 403, "FORBIDDEN", "You cannot modify this campaign.");
  const body = await readJson(request);
  db.prepare("UPDATE campaigns SET title = ?, description = ?, brief = ?, deliverables = ?, requirements = ?, budget_cents = ?, currency = ?, application_deadline = ?, start_date = ?, end_date = ?, status = ?, min_followers = ?, max_applications = ?, updated_at = ? WHERE id = ?").run(
    stringValue(body.title,campaign.title),stringValue(body.description,campaign.description),stringValue(body.brief,campaign.brief),JSON.stringify(Array.isArray(body.deliverables)?arrayValue(body.deliverables):JSON.parse(campaign.deliverables)),JSON.stringify(Array.isArray(body.requirements)?arrayValue(body.requirements):JSON.parse(campaign.requirements)),integerValue(body.budgetCents,campaign.budget_cents),stringValue(body.currency,campaign.currency),stringValue(body.applicationDeadline,campaign.application_deadline??"")||null,stringValue(body.startDate,campaign.start_date??"")||null,stringValue(body.endDate,campaign.end_date??"")||null,stringValue(body.status,campaign.status),integerValue(body.minFollowers,campaign.min_followers),body.maxApplications == null ? campaign.max_applications : integerValue(body.maxApplications),now(),id
  );
  return json(response, 200, { data: db.prepare("SELECT * FROM campaigns WHERE id = ?").get(id) });
}
