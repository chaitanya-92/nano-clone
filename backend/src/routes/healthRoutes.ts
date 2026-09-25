import type { IncomingMessage,ServerResponse } from "node:http";
import { health } from "../controllers/healthController";
export async function healthRoutes(request:IncomingMessage,response:ServerResponse,url:URL){if(url.pathname==="/api/health"&&request.method==="GET")return health(request,response);return false;}
