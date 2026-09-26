import type { IncomingMessage, ServerResponse } from "node:http";
import { analytics } from "../controllers/analyticsController";
export async function analyticsRoutes(
  request: IncomingMessage,
  response: ServerResponse,
  url: URL,
) {
  if (url.pathname === "/api/analytics" && request.method === "GET")
    return analytics(request, response, url);
  return false;
}
