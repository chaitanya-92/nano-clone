import { randomBytes } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import { db } from "../db/client";
import {
  COOKIE_NAME,
  IS_PRODUCTION,
  SESSION_LIFETIME,
} from "../config/env";

function parseCookies(request: IncomingMessage) {
  return Object.fromEntries(
    (request.headers.cookie ?? "")
      .split(";")
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");

        return [
          part.slice(0, index).trim(),
          decodeURIComponent(part.slice(index + 1)),
        ];
      }),
  );
}

export function setCookie(
  response: ServerResponse,
  name: string,
  value: string,
  options: { maxAge?: number } = {},
) {
  const attributes = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
  ];

  if (IS_PRODUCTION) {
    attributes.push("Secure");
  }

  if (options.maxAge !== undefined) {
    attributes.push(`Max-Age=${options.maxAge}`);
  }

  const cookie = attributes.join("; ");
  const existing = response.getHeader("Set-Cookie");

  if (!existing) {
    response.setHeader("Set-Cookie", [cookie]);
    return;
  }

  if (Array.isArray(existing)) {
    response.setHeader("Set-Cookie", [
      ...existing.map(String),
      cookie,
    ]);
    return;
  }

  response.setHeader("Set-Cookie", [
    String(existing),
    cookie,
  ]);
}

export function createSession(
  response: ServerResponse,
  userId: string,
) {
  const sessionId = randomBytes(32).toString("base64url");

  db.prepare(`
    INSERT INTO sessions
    (id, user_id, expires_at, created_at)
    VALUES (?, ?, ?, ?)
  `).run(
    sessionId,
    userId,
    Date.now() + SESSION_LIFETIME,
    new Date().toISOString(),
  );

  setCookie(response, COOKIE_NAME, sessionId, {
    maxAge: SESSION_LIFETIME / 1000,
  });
}

export function getSessionId(request: IncomingMessage) {
  return parseCookies(request)[COOKIE_NAME] ?? null;
}

export function destroySession(
  request: IncomingMessage,
  response: ServerResponse,
) {
  const sessionId = getSessionId(request);

  if (sessionId) {
    db.prepare("DELETE FROM sessions WHERE id = ?").run(sessionId);
  }

  setCookie(response, COOKIE_NAME, "", {
    maxAge: 0,
  });
}

export function getCurrentUser(request: IncomingMessage) {
  const sessionId = getSessionId(request);

  if (!sessionId) {
    return null;
  }

  const user = db
    .prepare(`
      SELECT
        users.id,
        users.email,
        users.name,
        users.role
      FROM sessions
      JOIN users ON users.id = sessions.user_id
      WHERE sessions.id = ?
      AND sessions.expires_at > ?
    `)
    .get(sessionId, Date.now());

  return user ?? null;
}
