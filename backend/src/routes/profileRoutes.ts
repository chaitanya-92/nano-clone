import type { IncomingMessage, ServerResponse } from "node:http";
import {
  getProfile,
  patchProfile,
  getPublicCard,
} from "../controllers/profileController";
export async function profileRoutes(
  request: IncomingMessage,
  response: ServerResponse,
  url: URL,
) {
  if (
    (url.pathname === "/api/creator/profile" ||
      url.pathname === "/api/brand/profile") &&
    request.method === "GET"
  )
    return getProfile(request, response);
  if (
    (url.pathname === "/api/creator/profile" ||
      url.pathname === "/api/brand/profile") &&
    request.method === "PATCH"
  )
    return patchProfile(request, response);
  if (url.pathname === "/api/creator/card" && request.method === "GET")
    return getProfile(request, response);
  const card = url.pathname.match(/^\/api\/creator\/card\/([^/]+)$/);
  if (card && request.method === "GET")
    return getPublicCard(request, response, card[1]);
  return false;
}
