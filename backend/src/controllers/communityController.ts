import type { IncomingMessage,ServerResponse } from "node:http";
import { requireAuth } from "../middleware/authMiddleware";
import { db } from "../db/client";
import { json } from "../utils/api";
export function community(request:IncomingMessage,response:ServerResponse){const user=requireAuth(request,response);if(!user)return;const leaderboard=db.prepare("SELECT u.id,u.name,cp.headline,cp.followers,cp.impressions,cp.post_count,cp.engagement_count FROM creator_profiles cp JOIN users u ON u.id=cp.user_id WHERE u.role='creator' ORDER BY cp.impressions DESC LIMIT 50").all();return json(response,200,{data:{leaderboard,member:db.prepare("SELECT * FROM creator_profiles WHERE user_id=?").get(user.id)}});}
