import type { IncomingMessage,ServerResponse } from "node:http";
import { requireAuth } from "../middleware/authMiddleware";
import { db } from "../db/client";
import { json } from "../utils/api";

export function analytics(request:IncomingMessage,response:ServerResponse,url:URL){
 const user=requireAuth(request,response);if(!user)return;
 const range=url.searchParams.get("range")??"all";
 const since=range==="30d"?new Date(Date.now()-30*86400000).toISOString():range==="90d"?new Date(Date.now()-90*86400000).toISOString():null;
 const where=since?"AND published_at >= ?":"";
 const args=since?[user.id,since]:[user.id];
 const summary=db.prepare(`SELECT COUNT(*) AS posts,COALESCE(SUM(impressions),0) AS impressions,COALESCE(SUM(reach),0) AS reach,COALESCE(SUM(likes),0) AS likes,COALESCE(SUM(comments),0) AS comments,COALESCE(SUM(reposts),0) AS reposts,COALESCE(SUM(engagements),0) AS engagements FROM analytics_posts WHERE creator_id=? ${where}`).get(...args);
 const posts=db.prepare(`SELECT * FROM analytics_posts WHERE creator_id=? ${where} ORDER BY published_at DESC`).all(...args);
 const profile=db.prepare("SELECT followers,impressions,engagement_count,post_count FROM creator_profiles WHERE user_id=?").get(user.id);
 return json(response,200,{data:{range,profile,summary,posts}});
}
