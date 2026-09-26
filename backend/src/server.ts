import { createServer, type ServerResponse } from "node:http";

import { PORT, APP_ORIGIN, FRONTEND_ORIGIN } from "./config/env";

import { initializeDatabaseConnection } from "./config/database";

import { authRoutes } from "./routes/authRoutes";
import { onboardingRoutes } from "./routes/onboardingRoutes";
import { dashboardRoutes } from "./routes/dashboardRoutes";
import { campaignRoutes } from "./routes/campaignRoutes";
import { applicationRoutes } from "./routes/applicationRoutes";
import { collaborationRoutes } from "./routes/collaborationRoutes";
import { analyticsRoutes } from "./routes/analyticsRoutes";
import { earningsRoutes } from "./routes/earningsRoutes";
import { messageRoutes } from "./routes/messageRoutes";
import { notificationRoutes } from "./routes/notificationRoutes";
import { communityRoutes } from "./routes/communityRoutes";
import { affiliateRoutes } from "./routes/affiliateRoutes";
import { profileRoutes } from "./routes/profileRoutes";
import { brandOnboardingRoutes } from "./routes/brandOnboardingRoutes";
import { healthRoutes } from "./routes/healthRoutes";
import { targetRoutes } from "./routes/targetRoutes";
import { socialRoutes } from "./routes/socialRoutes";
import { websiteRoutes } from "./routes/websiteRoutes";
import { assistantRoutes } from "./routes/assistantRoutes";

import { handleError } from "./middleware/errorMiddleware";

const allowedOrigins = Array.from(
  new Set([
    process.env.FRONTEND_ORIGIN?.trim() || FRONTEND_ORIGIN,
    "https://jocular-longma-0f9c9d.netlify.app",
    "https://nano-clone.vercel.app",
    "http://localhost:5173",
  ]),
);

initializeDatabaseConnection();

function setCorsHeaders(response: ServerResponse, origin: string | undefined) {
  if (!origin || !allowedOrigins.includes(origin)) {
    return;
  }

  response.setHeader("Access-Control-Allow-Origin", origin);
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS",
  );
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Vary", "Origin");
}

function serveNotFound(response: ServerResponse) {
  response.writeHead(404, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify({ error: "Route not found." }));
}

const server = createServer(async (request, response) => {
  const origin = request.headers.origin;

  setCorsHeaders(response, origin);

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  try {
    // request.url is a relative path on Node's IncomingMessage.
    // Use the request host only as the parsing base so a bad APP_ORIGIN
    // environment variable can never turn a normal API request into a 500.
    const requestBase = `http://${request.headers.host ?? `localhost:${PORT}`}`;
    const url = new URL(request.url ?? "/", requestBase);

    if (url.pathname.startsWith("/api/")) {
      const handlers = [
        authRoutes,
        onboardingRoutes,
        dashboardRoutes,
        campaignRoutes,
        applicationRoutes,
        collaborationRoutes,
        analyticsRoutes,
        earningsRoutes,
        messageRoutes,
        notificationRoutes,
        communityRoutes,
        affiliateRoutes,
        profileRoutes,
        brandOnboardingRoutes,
        healthRoutes,
        targetRoutes,
        socialRoutes,
        websiteRoutes,
        assistantRoutes,
      ];

      for (const handler of handlers) {
        const handled = await handler(request, response, url);
        if (handled !== false) return;
      }
    }

    serveNotFound(response);
  } catch (error) {
    handleError(response, error);
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Naano backend running on ${APP_ORIGIN || "request host"}`);
});
