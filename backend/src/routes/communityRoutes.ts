import type { IncomingMessage,ServerResponse } from "node:http";
import { community } from "../controllers/communityController";
export async function communityRoutes(request:IncomingMessage,response:ServerResponse,url:URL){if(url.pathname==="/api/community"&&request.method==="GET")return community(request,response);if(url.pathname==="/api/community/leaderboard"&&request.method==="GET")return community(request,response);return false;}
