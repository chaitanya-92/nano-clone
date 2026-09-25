import type { IncomingMessage, ServerResponse } from "node:http";
import { db } from "../db/client";
export function health(_request: IncomingMessage, response: ServerResponse) {
  const result = db.prepare("SELECT 1 AS ok").get() as any;
  response.writeHead(result.ok === 1 ? 200 : 503, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(
    JSON.stringify({
      status: result.ok === 1 ? "ok" : "degraded",
      database: result.ok === 1 ? "ok" : "error",
      timestamp: new Date().toISOString(),
    }),
  );
}
