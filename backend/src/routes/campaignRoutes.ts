import type { IncomingMessage, ServerResponse } from "node:http";
import { createCampaign, getCampaign, listCampaigns, updateCampaign } from "../controllers/campaignController";

export async function campaignRoutes(request: IncomingMessage, response: ServerResponse, url: URL) {
  if (url.pathname === "/api/campaigns" && request.method === "GET") return listCampaigns(request,response,url);
  if (url.pathname === "/api/campaigns" && request.method === "POST") return createCampaign(request,response);
  const match = url.pathname.match(/^\/api\/campaigns\/([^/]+)$/);
  if (match && request.method === "GET") return getCampaign(request,response,match[1]);
  if (match && request.method === "PATCH") return updateCampaign(request,response,match[1]);
  return false;
}
