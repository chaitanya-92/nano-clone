import type { IncomingMessage, ServerResponse } from "node:http";
import { getCurrentUser } from "../utils/session";

export function requireAuth(
  request: IncomingMessage,
  response: ServerResponse,
) {
  const user = getCurrentUser(request);

  if (!user) {
    response.writeHead(401, {
      "Content-Type": "application/json; charset=utf-8",
    });

    response.end(
      JSON.stringify({
        error: "Authentication required.",
      }),
    );

    return null;
  }

  return user;
}
