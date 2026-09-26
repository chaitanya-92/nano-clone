import { createReadStream, existsSync } from "node:fs";

import { join, extname, normalize } from "node:path";

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

const distDirectory = join(process.cwd(), "..", "dist");

const mimeTypes: Record<string, string> = {
  ".css": "text/css",
  ".js": "text/javascript",
  ".html": "text/html",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
};

const allowedOrigins = Array.from(
  new Set([
    process.env.FRONTEND_ORIGIN ?? FRONTEND_ORIGIN,
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

function serveStatic(response: ServerResponse, url: URL) {
  const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;

  const safePath = normalize(requestedPath).replace(/^([.][.][/\\])+/, "");

  const filePath = join(distDirectory, safePath);

  const file =
    existsSync(filePath) && !filePath.endsWith("/")
      ? filePath
      : join(distDirectory, "index.html");

  if (!existsSync(file)) {
    response.writeHead(503, {
      "Content-Type": "application/json; charset=utf-8",
    });

    response.end(
      JSON.stringify({
        error: "Application build is missing. Run npm run build.",
      }),
    );

    return;
  }

  response.writeHead(200, {
    "Content-Type": mimeTypes[extname(file)] ?? "application/octet-stream",
  });

  createReadStream(file).pipe(response);
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
    const url = new URL(request.url ?? "/", APP_ORIGIN);

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

    serveStatic(response, url);
  } catch (error) {
    handleError(response, error);
  }
});

server.listen(PORT, () => {
  console.log(`Naano backend running on ${APP_ORIGIN}`);
});
