import type { IncomingMessage, ServerResponse } from "node:http";
import {
  apply,
  listApplications,
  updateApplication,
} from "../controllers/applicationController";

export async function applicationRoutes(
  request: IncomingMessage,
  response: ServerResponse,
  url: URL,
) {
  if (url.pathname === "/api/applications" && request.method === "GET")
    return listApplications(request, response);
  if (
    url.pathname.match(/^\/api\/campaigns\/([^/]+)\/applications$/) &&
    request.method === "POST"
  )
    return apply(request, response, url.pathname.split("/")[3]);
  const match = url.pathname.match(/^\/api\/applications\/([^/]+)$/);
  if (match && request.method === "PATCH")
    return updateApplication(request, response, match[1]);
  return false;
}
