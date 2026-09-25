import type { IncomingMessage,ServerResponse } from "node:http";
import { targets } from "../controllers/targetController";
export async function targetRoutes(request:IncomingMessage,response:ServerResponse,url:URL){if(url.pathname==="/api/creator/targets"&&(request.method==="GET"||request.method==="POST"))return targets(request,response);return false;}
