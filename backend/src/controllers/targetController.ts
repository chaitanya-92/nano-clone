import type { IncomingMessage,ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import { requireAuth } from "../middleware/authMiddleware";
import { db } from "../db/client";
import { error,json,readJson,stringValue,integerValue,now } from "../utils/api";

export async function targets(request:IncomingMessage,response:ServerResponse){
 const user=requireAuth(request,response);if(!user)return;
 if(user.role!=="creator")return error(response,403,"CREATOR_ONLY","Creator account required.");
 if(request.method==="GET")return json(response,200,{data:db.prepare("SELECT * FROM creator_targets WHERE creator_id=? ORDER BY sort_order").all(user.id)});
 const body=await readJson(request);const title=stringValue(body.title);if(!title)return error(response,422,"TITLE_REQUIRED","Target title is required.");
 const t=now(),id=randomUUID();db.prepare("INSERT INTO creator_targets (id,creator_id,title,description,sort_order,created_at,updated_at) VALUES (?,?,?,?,?,?,?)").run(id,user.id,title,stringValue(body.description),integerValue(body.sortOrder),t,t);
 return json(response,201,{data:db.prepare("SELECT * FROM creator_targets WHERE id=?").get(id)});
}
