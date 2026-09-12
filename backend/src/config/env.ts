import "dotenv/config";

export const PORT = Number(process.env.PORT ?? 8787);
export const APP_ORIGIN = process.env.APP_ORIGIN ?? `http://localhost:${PORT}`;
export const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";
export const NODE_ENV = process.env.NODE_ENV ?? "development";
export const IS_PRODUCTION = NODE_ENV === "production";
export const DATABASE_PATH = process.env.DATABASE_PATH ?? "./data/naano.sqlite";
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? "";
export const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL ?? "";
export const COOKIE_NAME = "naano_session";
export const OAUTH_STATE_COOKIE = "naano_oauth_state";
export const SESSION_LIFETIME = 1000 * 60 * 60 * 24 * 30;