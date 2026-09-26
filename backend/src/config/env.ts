import "dotenv/config";

const getEnv = (key: string) => process.env[key]?.trim() || undefined;

const isValidHttpOrigin = (value: string | undefined): value is string => {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const normalizeOrigin = (value: string | undefined, fallback: string) =>
  isValidHttpOrigin(value) ? new URL(value).origin : fallback;

export const PORT = Number(getEnv("PORT") ?? 8787);
export const NODE_ENV = getEnv("NODE_ENV") ?? "development";
export const IS_PRODUCTION = NODE_ENV === "production";

const defaultAppOrigin = IS_PRODUCTION
  ? "https://nano-clone-lo9q.onrender.com"
  : `http://localhost:${PORT}`;

const defaultFrontendOrigin = "https://jocular-longma-0f9c9d.netlify.app";

const configuredAppOrigin =
  getEnv("APP_ORIGIN") ?? getEnv("RENDER_EXTERNAL_URL");
const productionAppOrigin =
  configuredAppOrigin && isValidHttpOrigin(configuredAppOrigin)
    ? new URL(configuredAppOrigin)
    : null;

export const APP_ORIGIN =
  IS_PRODUCTION && productionAppOrigin
    ? productionAppOrigin.hostname.endsWith(".onrender.com")
      ? productionAppOrigin.origin
      : defaultAppOrigin
    : normalizeOrigin(configuredAppOrigin, defaultAppOrigin);

const configuredFrontendOrigin = getEnv("FRONTEND_ORIGIN");
const productionFrontendOrigin =
  configuredFrontendOrigin && isValidHttpOrigin(configuredFrontendOrigin)
    ? new URL(configuredFrontendOrigin)
    : null;

export const FRONTEND_ORIGIN =
  IS_PRODUCTION && productionFrontendOrigin
    ? productionFrontendOrigin.hostname.endsWith(".netlify.app")
      ? productionFrontendOrigin.origin
      : defaultFrontendOrigin
    : normalizeOrigin(configuredFrontendOrigin, defaultFrontendOrigin);

export const DATABASE_PATH = getEnv("DATABASE_PATH") ?? "./data/naano.sqlite";

export const GOOGLE_CLIENT_ID = getEnv("GOOGLE_CLIENT_ID") ?? "";
export const GOOGLE_CLIENT_SECRET = getEnv("GOOGLE_CLIENT_SECRET") ?? "";

const configuredGoogleCallback = getEnv("GOOGLE_CALLBACK_URL");
export const GOOGLE_CALLBACK_URL =
  configuredGoogleCallback &&
  isValidHttpOrigin(
    configuredGoogleCallback.replace(/\/api\/auth\/google\/callback\/?$/, ""),
  )
    ? configuredGoogleCallback
    : `${APP_ORIGIN}/api/auth/google/callback`;

export const LINKEDIN_API_VERSION = getEnv("LINKEDIN_API_VERSION") ?? "202609";
export const X_BEARER_TOKEN = getEnv("X_BEARER_TOKEN") ?? "";

export const COOKIE_NAME = "naano_session";
export const OAUTH_STATE_COOKIE = "naano_oauth_state";
export const SESSION_LIFETIME = 1000 * 60 * 60 * 24 * 30;
