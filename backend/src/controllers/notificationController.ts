import type { IncomingMessage,ServerResponse } from "node:http";
import { requireAuth } from "../middleware/authMiddleware";
import { db } from "../db/client";
import { json,now } from "../utils/api";
export function notifications(request:IncomingMessage,response:ServerResponse){const user=requireAuth(request,response);if(!user)return;return json(response,200,{data:db.prepare("SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 50").all(user.id)});}
export function markNotification(request:IncomingMessage,response:ServerResponse,id:string){const user=requireAuth(request,response);if(!user)return;db.prepare("UPDATE notifications SET read_at=? WHERE id=? AND user_id=?").run(now(),id,user.id);return json(response,200,{ok:true});}
export function markAll(request:IncomingMessage,response:ServerResponse){const user=requireAuth(request,response);if(!user)return;db.prepare("UPDATE notifications SET read_at=? WHERE user_id=? AND read_at IS NULL").run(now(),user.id);return json(response,200,{ok:true});}
