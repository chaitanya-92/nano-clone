import "dotenv/config";

const getEnv = (key: string) => process.env[key]?.trim() || undefined;

export const PORT = Number(getEnv("PORT") ?? 8787);

export const APP_ORIGIN =
  getEnv("APP_ORIGIN") ??
  getEnv("RENDER_EXTERNAL_URL") ??
  `http://localhost:${PORT}`;

export const FRONTEND_ORIGIN =
  getEnv("FRONTEND_ORIGIN") ?? "https://jocular-longma-0f9c9d.netlify.app";

export const NODE_ENV = getEnv("NODE_ENV") ?? "development";
export const IS_PRODUCTION = NODE_ENV === "production";
export const DATABASE_PATH =
  getEnv("DATABASE_PATH") ?? "./data/naano.sqlite";

export const GOOGLE_CLIENT_ID = getEnv("GOOGLE_CLIENT_ID") ?? "";
export const GOOGLE_CLIENT_SECRET = getEnv("GOOGLE_CLIENT_SECRET") ?? "";
export const GOOGLE_CALLBACK_URL =
  getEnv("GOOGLE_CALLBACK_URL") ??
  `${APP_ORIGIN}/api/auth/google/callback`;

export const LINKEDIN_API_VERSION =
  getEnv("LINKEDIN_API_VERSION") ?? "202609";
export const X_BEARER_TOKEN = getEnv("X_BEARER_TOKEN") ?? "";

export const COOKIE_NAME = "naano_session";
export const OAUTH_STATE_COOKIE = "naano_oauth_state";
export const SESSION_LIFETIME = 1000 * 60 * 60 * 24 * 30;
