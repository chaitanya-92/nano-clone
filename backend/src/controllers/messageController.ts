import type { IncomingMessage, ServerResponse } from "node:http";
import { randomBytes } from "node:crypto";
import { requireAuth } from "../middleware/authMiddleware";
import { db } from "../db/client";
import { error, json, readJson, stringValue, now } from "../utils/api";

export function conversations(
  request: IncomingMessage,
  response: ServerResponse,
) {
  const user = requireAuth(request, response);
  if (!user) return;
  const rows = db
    .prepare(
      "SELECT c.*,u.name AS creator_name,COALESCE(bp.company_name,u.name) AS brand_name,(SELECT body FROM messages WHERE conversation_id=c.id ORDER BY created_at DESC LIMIT 1) AS last_message,(SELECT created_at FROM messages WHERE conversation_id=c.id ORDER BY created_at DESC LIMIT 1) AS last_message_at FROM conversations c JOIN users u ON u.id=c.creator_id LEFT JOIN brand_profiles bp ON bp.user_id=c.brand_id WHERE c.creator_id=? OR c.brand_id=? ORDER BY COALESCE(last_message_at,c.updated_at) DESC",
    )
    .all(user.id, user.id);
  return json(response, 200, { data: rows });
}
export function messages(
  request: IncomingMessage,
  response: ServerResponse,
  id: string,
) {
  const user = requireAuth(request, response);
  if (!user) return;
  const c = db.prepare("SELECT * FROM conversations WHERE id=?").get(id) as any;
  if (!c)
    return error(
      response,
      404,
      "CONVERSATION_NOT_FOUND",
      "Conversation not found.",
    );
  if (c.creator_id !== user.id && c.brand_id !== user.id)
    return error(
      response,
      403,
      "FORBIDDEN",
      "You cannot access this conversation.",
    );
  return json(response, 200, {
    data: db
      .prepare(
        "SELECT m.*,u.name AS sender_name FROM messages m JOIN users u ON u.id=m.sender_id WHERE m.conversation_id=? ORDER BY m.created_at ASC",
      )
      .all(id),
  });
}
export async function sendMessage(
  request: IncomingMessage,
  response: ServerResponse,
  id: string,
) {
  const user = requireAuth(request, response);
  if (!user) return;
  const c = db.prepare("SELECT * FROM conversations WHERE id=?").get(id) as any;
  if (!c)
    return error(
      response,
      404,
      "CONVERSATION_NOT_FOUND",
      "Conversation not found.",
    );
  if (c.creator_id !== user.id && c.brand_id !== user.id)
    return error(
      response,
      403,
      "FORBIDDEN",
      "You cannot access this conversation.",
    );
  const body = await readJson(request);
  const text = stringValue(body.body);
  if (!text)
    return error(response, 422, "MESSAGE_REQUIRED", "Message cannot be empty.");
  const messageId = randomBytes(16).toString("base64url"),
    t = now();
  db.prepare(
    "INSERT INTO messages (id,conversation_id,sender_id,body,created_at) VALUES (?,?,?,?,?)",
  ).run(messageId, id, user.id, text, t);
  db.prepare("UPDATE conversations SET updated_at=? WHERE id=?").run(t, id);
  const recipient = user.id === c.creator_id ? c.brand_id : c.creator_id;
  if (recipient)
    db.prepare(
      "INSERT INTO notifications (id,user_id,type,title,body,created_at) VALUES (?,?,?,?,?,?)",
    ).run(
      randomBytes(16).toString("base64url"),
      recipient,
      "message",
      "New message",
      text,
      t,
    );
  return json(response, 201, {
    data: db.prepare("SELECT * FROM messages WHERE id=?").get(messageId),
  });
}
export function markRead(
  request: IncomingMessage,
  response: ServerResponse,
  id: string,
) {
  const user = requireAuth(request, response);
  if (!user) return;
  const c = db.prepare("SELECT * FROM conversations WHERE id=?").get(id) as any;
  if (!c || (c.creator_id !== user.id && c.brand_id !== user.id))
    return error(
      response,
      403,
      "FORBIDDEN",
      "You cannot access this conversation.",
    );
  db.prepare(
    "UPDATE messages SET read_at=? WHERE conversation_id=? AND sender_id != ? AND read_at IS NULL",
  ).run(now(), id, user.id);
  return json(response, 200, { ok: true });
}
