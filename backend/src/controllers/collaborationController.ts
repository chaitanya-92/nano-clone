import type { IncomingMessage,ServerResponse } from "node:http";
import { db } from "../db/client";
import { requireAuth } from "../middleware/authMiddleware";
import { error,json,readJson,stringValue,now } from "../utils/api";

function allowed(user:any,row:any){return user.id===row.creator_id||user.id===row.brand_id;}

export function listCollaborations(request:IncomingMessage,response:ServerResponse){
  const user=requireAuth(request,response);if(!user)return;
  const rows=db.prepare("SELECT c.*,ca.title AS campaign_title,u.name AS creator_name,bp.company_name AS brand_name,COALESCE((SELECT MAX(impressions) FROM campaign_metrics WHERE collaboration_id=c.id),0) AS impressions,COALESCE((SELECT MAX(engagements) FROM campaign_metrics WHERE collaboration_id=c.id),0) AS engagements,COALESCE((SELECT amount_cents FROM earnings WHERE collaboration_id=c.id ORDER BY created_at DESC LIMIT 1),0) AS net_amount_cents FROM collaborations c JOIN campaigns ca ON ca.id=c.campaign_id JOIN users u ON u.id=c.creator_id JOIN brand_profiles bp ON bp.user_id=c.brand_id WHERE c.creator_id=? OR c.brand_id=? ORDER BY c.created_at DESC").all(user.id,user.id);
  return json(response,200,{data:rows});
}

export function getCollaboration(request:IncomingMessage,response:ServerResponse,id:string){
  const user=requireAuth(request,response);if(!user)return;
  const row=db.prepare("SELECT c.*,ca.title AS campaign_title,u.name AS creator_name,bp.company_name AS brand_name FROM collaborations c JOIN campaigns ca ON ca.id=c.campaign_id JOIN users u ON u.id=c.creator_id JOIN brand_profiles bp ON bp.user_id=c.brand_id WHERE c.id=?").get(id) as any;
  if(!row)return error(response,404,"COLLABORATION_NOT_FOUND","Collaboration not found.");
  if(!allowed(user,row))return error(response,403,"FORBIDDEN","You cannot access this collaboration.");
  return json(response,200,{data:row});
}

export async function updateCollaboration(request:IncomingMessage,response:ServerResponse,id:string){
  const user=requireAuth(request,response);if(!user)return;
  const row=db.prepare("SELECT * FROM collaborations WHERE id=?").get(id) as any;
  if(!row)return error(response,404,"COLLABORATION_NOT_FOUND","Collaboration not found.");
  if(!allowed(user,row))return error(response,403,"FORBIDDEN","You cannot modify this collaboration.");
  const body=await readJson(request);
  const status=stringValue(body.status,row.status);
  const brief=stringValue(body.brief,row.brief);
  const contentUrl=stringValue(body.contentUrl,row.content_url??"")||null;
  const publishedUrl=stringValue(body.publishedUrl,row.published_url??"")||null;
  const timestamp=now();
  db.prepare("UPDATE collaborations SET status=?,brief=?,content_url=?,published_url=?,approved_at=CASE WHEN ?='content_approved' THEN ? ELSE approved_at END,completed_at=CASE WHEN ?='completed' THEN ? ELSE completed_at END,updated_at=? WHERE id=?").run(status,brief,contentUrl,publishedUrl,status,timestamp,status,timestamp,timestamp,id);
  if(status==="payment_released"){
    const exists=db.prepare("SELECT id FROM earnings WHERE collaboration_id=? AND type='collaboration'").get(id);
    if(!exists){
      const amount=db.prepare("SELECT budget_cents FROM campaigns WHERE id=?").get(row.campaign_id) as any;
      db.prepare("INSERT INTO earnings (id,user_id,collaboration_id,type,status,amount_cents,currency,description,available_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)").run(require("node:crypto").randomBytes(16).toString("base64url"),row.creator_id,id,"collaboration","available",amount?.budget_cents??0,"EUR","Collaboration payment",timestamp,timestamp,timestamp);
    }
  }
  return json(response,200,{data:db.prepare("SELECT * FROM collaborations WHERE id=?").get(id)});
}
