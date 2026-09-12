import type { ServerResponse } from "node:http";

export function handleError(
  response: ServerResponse,
  error: unknown,
) {
  console.error(error);

  if (response.headersSent) {
    response.end();
    return;
  }

  response.writeHead(500, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });

  response.end(
    JSON.stringify({
      error: "Something went wrong. Please try again.",
    }),
  );
}
