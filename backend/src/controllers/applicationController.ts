import type { IncomingMessage, ServerResponse } from "node:http";
import { randomBytes } from "node:crypto";
import { db } from "../db/client";
import { requireAuth } from "../middleware/authMiddleware";
import { error, json, readJson, stringValue, integerValue, now } from "../utils/api";

export async function apply(request: IncomingMessage,response: ServerResponse,campaignId:string) {
  const user=requireAuth(request,response);
  if(!user) return;
  if(user.role!=="creator") return error(response,403,"CREATOR_ONLY","Creator account required.");
  const campaign=db.prepare("SELECT * FROM campaigns WHERE id = ?").get(campaignId) as any;
  if(!campaign || campaign.status!=="open") return error(response,404,"CAMPAIGN_UNAVAILABLE","Campaign is not available.");
  const profile=db.prepare("SELECT followers FROM creator_profiles WHERE user_id = ?").get(user.id) as any;
  if((profile?.followers ?? 0)<campaign.min_followers) return error(response,403,"NOT_ELIGIBLE","Creator does not meet the follower requirement.");
  const existing=db.prepare("SELECT id FROM applications WHERE campaign_id = ? AND creator_id = ?").get(campaignId,user.id);
  if(existing) return error(response,409,"ALREADY_APPLIED","You already applied to this campaign.");
  const count=db.prepare("SELECT COUNT(*) AS count FROM applications WHERE campaign_id = ?").get(campaignId) as any;
  if(campaign.max_applications != null && count.count>=campaign.max_applications) return error(response,409,"APPLICATIONS_CLOSED","Application limit reached.");
  const body=await readJson(request);
  const id=randomBytes(16).toString("base64url"), timestamp=now();
  db.prepare("INSERT INTO applications (id,campaign_id,creator_id,message,proposed_price_cents,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)").run(id,campaignId,user.id,stringValue(body.message),body.proposedPriceCents==null?null:integerValue(body.proposedPriceCents),"pending",timestamp,timestamp);
  return json(response,201,{data:db.prepare("SELECT * FROM applications WHERE id = ?").get(id)});
}

export function listApplications(request:IncomingMessage,response:ServerResponse) {
  const user=requireAuth(request,response);
  if(!user)return;
  const rows=user.role==="creator"
    ? db.prepare("SELECT a.*,c.title AS campaign_title,b.company_name AS brand_name FROM applications a JOIN campaigns c ON c.id=a.campaign_id JOIN brand_profiles b ON b.user_id=c.brand_id WHERE a.creator_id=? ORDER BY a.created_at DESC").all(user.id)
    : db.prepare("SELECT a.*,c.title AS campaign_title,u.name AS creator_name FROM applications a JOIN campaigns c ON c.id=a.campaign_id JOIN users u ON u.id=a.creator_id WHERE c.brand_id=? ORDER BY a.created_at DESC").all(user.id);
  return json(response,200,{data:rows});
}

export async function updateApplication(request:IncomingMessage,response:ServerResponse,id:string) {
  const user=requireAuth(request,response);
  if(!user)return;
  const application=db.prepare("SELECT a.*,c.brand_id FROM applications a JOIN campaigns c ON c.id=a.campaign_id WHERE a.id=?").get(id) as any;
  if(!application)return error(response,404,"APPLICATION_NOT_FOUND","Application not found.");
  const allowed=user.role==="creator"?application.creator_id===user.id:application.brand_id===user.id;
  if(!allowed)return error(response,403,"FORBIDDEN","You cannot modify this application.");
  const body=await readJson(request);
  const status=stringValue(body.status,application.status);
  db.prepare("UPDATE applications SET status=?,updated_at=? WHERE id=?").run(status,now(),id);
  if(status==="accepted") {
    const existing=db.prepare("SELECT id FROM collaborations WHERE application_id=?").get(id);
    if(!existing) {
      const timestamp=now();
      db.prepare("INSERT INTO collaborations (id,campaign_id,creator_id,brand_id,application_id,status,brief,due_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)").run(randomBytes(16).toString("base64url"),application.campaign_id,application.creator_id,application.brand_id,id,"application_accepted",application.brief??"",application.application_deadline,timestamp,timestamp);
    }
  }
  return json(response,200,{data:db.prepare("SELECT * FROM applications WHERE id=?").get(id)});
}
