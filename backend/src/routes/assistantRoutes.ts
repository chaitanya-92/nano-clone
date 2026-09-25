import type {
  IncomingMessage,
  ServerResponse,
} from "node:http";
import {
  assistantContext,
  assistantMessage,
} from "../controllers/assistantController";

export async function assistantRoutes(
  request: IncomingMessage,
  response: ServerResponse,
  url: URL,
) {
  if (
    url.pathname ===
      "/api/assistant/context" &&
    request.method === "GET"
  ) {
    return assistantContext(
      request,
      response,
    );
  }

  if (
    url.pathname ===
      "/api/assistant/message" &&
    request.method === "POST"
  ) {
    return assistantMessage(
      request,
      response,
    );
  }

  return false;
}
