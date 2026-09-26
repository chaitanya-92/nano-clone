import type { IncomingMessage, ServerResponse } from "node:http";
import { socialAccounts, connectSocial } from "../controllers/socialController";
export async function socialRoutes(
  request: IncomingMessage,
  response: ServerResponse,
  url: URL,
) {
  if (url.pathname === "/api/social-accounts" && request.method === "GET")
    return socialAccounts(request, response);
  if (
    url.pathname === "/api/social-accounts/connect" &&
    request.method === "POST"
  )
    return connectSocial(request, response);
  return false;
}
