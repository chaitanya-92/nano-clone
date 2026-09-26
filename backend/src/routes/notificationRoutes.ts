import type { IncomingMessage, ServerResponse } from "node:http";
import {
  notifications,
  markNotification,
  markAll,
} from "../controllers/notificationController";
export async function notificationRoutes(
  request: IncomingMessage,
  response: ServerResponse,
  url: URL,
) {
  if (url.pathname === "/api/notifications" && request.method === "GET")
    return notifications(request, response);
  if (
    url.pathname === "/api/notifications/read-all" &&
    request.method === "PATCH"
  )
    return markAll(request, response);
  const m = url.pathname.match(/^\/api\/notifications\/([^/]+)\/read$/);
  if (m && request.method === "PATCH")
    return markNotification(request, response, m[1]);
  return false;
}
