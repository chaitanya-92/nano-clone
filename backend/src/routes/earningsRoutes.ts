import type { IncomingMessage,ServerResponse } from "node:http";
import { earnings,payoutMethods,addPayoutMethod,withdraw } from "../controllers/earningsController";
export async function earningsRoutes(request:IncomingMessage,response:ServerResponse,url:URL){
 if(url.pathname==="/api/earnings"&&request.method==="GET")return earnings(request,response);
 if(url.pathname==="/api/earnings/payout-methods"&&request.method==="GET")return payoutMethods(request,response);
 if(url.pathname==="/api/earnings/payout-methods"&&request.method==="POST")return addPayoutMethod(request,response);
 if(url.pathname==="/api/earnings/withdrawals"&&request.method==="POST")return withdraw(request,response);
 return false;
}
