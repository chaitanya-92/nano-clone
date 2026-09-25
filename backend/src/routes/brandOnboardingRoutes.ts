import type { IncomingMessage,ServerResponse } from "node:http";
import { saveBrandOnboarding } from "../controllers/brandOnboardingController";
export async function brandOnboardingRoutes(request:IncomingMessage,response:ServerResponse,url:URL){if(url.pathname==="/api/onboarding/brand"&&request.method==="POST")return saveBrandOnboarding(request,response);return false;}
