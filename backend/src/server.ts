import {
  createReadStream,
  existsSync,
  mkdirSync,
} from "node:fs";
import { join, extname, normalize } from "node:path";
import { createServer } from "node:http";
import { PORT, APP_ORIGIN } from "./config/env";
import { initializeDatabaseConnection } from "./config/database";
import { authRoutes } from "./routes/authRoutes";
import { handleError } from "./middleware/errorMiddleware";

const distDirectory = join(
  process.cwd(),
  "..",
  "dist",
);

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

initializeDatabaseConnection();

function serveStatic(
  response: any,
  url: URL,
) {
  const requestedPath =
    url.pathname === "/"
      ? "/index.html"
      : url.pathname;

  const safePath = normalize(
    requestedPath,
  ).replace(/^([.][.][/\\])+/, "");

  const filePath = join(
    distDirectory,
    safePath,
  );

  const file =
    existsSync(filePath) &&
    !filePath.endsWith("/")
      ? filePath
      : join(
          distDirectory,
          "index.html",
        );

  if (!existsSync(file)) {
    response.writeHead(503, {
      "Content-Type":
        "application/json; charset=utf-8",
    });

    response.end(
      JSON.stringify({
        error:
          "Application build is missing. Run npm run build.",
      }),
    );

    return;
  }

  response.writeHead(200, {
    "Content-Type":
      mimeTypes[extname(file)] ??
      "application/octet-stream",
  });

  createReadStream(file).pipe(response);
}

const server = createServer(
  async (request, response) => {
    try {
      const url = new URL(
        request.url ?? "/",
        APP_ORIGIN,
      );

      if (
        url.pathname.startsWith("/api/")
      ) {
        const handled =
          await authRoutes(
            request,
            response,
            url,
          );

        if (handled !== false) {
          return;
        }
      }

      serveStatic(response, url);
    } catch (error) {
      handleError(response, error);
    }
  },
);

server.listen(PORT, () => {
  console.log(
    `Naano backend running on ${APP_ORIGIN}`,
  );
});
