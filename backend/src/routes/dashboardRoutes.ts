import type { IncomingMessage,ServerResponse } from "node:http";
import { dashboard } from "../controllers/dashboardController";
export async function dashboardRoutes(request:IncomingMessage,response:ServerResponse,url:URL){
  if(url.pathname==="/api/dashboard"&&request.method==="GET")return dashboard(request,response);
  return false;
}
