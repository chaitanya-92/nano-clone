import type { IncomingMessage, ServerResponse } from "node:http";
import {
  analyzeWebsite,
  websiteAnalyses,
} from "../controllers/websiteController";
export async function websiteRoutes(
  request: IncomingMessage,
  response: ServerResponse,
  url: URL,
) {
  if (url.pathname === "/api/company/analyze" && request.method === "POST")
    return analyzeWebsite(request, response);
  if (url.pathname === "/api/company/analyses" && request.method === "GET")
    return websiteAnalyses(request, response);
  return false;
}
