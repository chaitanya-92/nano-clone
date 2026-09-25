import type { IncomingMessage, ServerResponse } from "node:http";
import {
  listCollaborations,
  getCollaboration,
  updateCollaboration,
} from "../controllers/collaborationController";

export async function collaborationRoutes(
  request: IncomingMessage,
  response: ServerResponse,
  url: URL,
) {
  if (url.pathname === "/api/collaborations" && request.method === "GET")
    return listCollaborations(request, response);
  const match = url.pathname.match(/^\/api\/collaborations\/([^/]+)$/);
  if (match && request.method === "GET")
    return getCollaboration(request, response, match[1]);
  if (match && request.method === "PATCH")
    return updateCollaboration(request, response, match[1]);
  return false;
}
