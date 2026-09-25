import type { IncomingMessage,ServerResponse } from "node:http";
import { conversations,messages,sendMessage,markRead } from "../controllers/messageController";
export async function messageRoutes(request:IncomingMessage,response:ServerResponse,url:URL){
 if(url.pathname==="/api/conversations"&&request.method==="GET")return conversations(request,response);
 const m=url.pathname.match(/^\/api\/conversations\/([^/]+)\/messages$/);
 if(m&&request.method==="GET")return messages(request,response,m[1]);
 if(m&&request.method==="POST")return sendMessage(request,response,m[1]);
 const r=url.pathname.match(/^\/api\/conversations\/([^/]+)\/read$/);
 if(r&&request.method==="PATCH")return markRead(request,response,r[1]);
 return false;
}
