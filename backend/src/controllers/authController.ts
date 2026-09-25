import type {
  IncomingMessage,
  ServerResponse,
} from "node:http";
import { createSession, destroySession, getCurrentUser } from "../utils/session";
import { db } from "../db/client";
import {
  validateLogin,
  validateRegistration,
} from "../utils/validation";
import {
  loginUser,
  registerUser,
  publicUser,
} from "../services/authService";
import { handleLinkedInCallback, getFrontendLinkedInErrorUrl, startLinkedInOAuth } from "../services/linkedinOAuthService";
import {
  getFrontendDashboardUrl,
  getFrontendLoginErrorUrl,
  handleGoogleCallback,
  startGoogleOAuth,
} from "../services/googleOAuthService";

async function readJson(
  request: IncomingMessage,
) {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(
      Buffer.isBuffer(chunk)
        ? chunk
        : Buffer.from(chunk),
    );
  }

  const body = Buffer.concat(chunks).toString("utf8");

  if (body.length > 32_000) {
    throw new Error("Payload is too large.");
  }

  try {
    return body ? JSON.parse(body) : {};
  } catch {
    throw new Error("Invalid JSON payload.");
  }
}

function json(
  response: ServerResponse,
  status: number,
  body: unknown,
) {
  response.writeHead(status, {
    "Content-Type":
      "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });

  response.end(JSON.stringify(body));
}

function redirect(
  response: ServerResponse,
  location: string,
) {
  response.writeHead(302, {
    Location: location,
    "Cache-Control": "no-store",
  });

  response.end();
}

export async function register(
  request: IncomingMessage,
  response: ServerResponse,
) {
  const data: any = await readJson(request);

  const validationError =
    validateRegistration(data);

  if (validationError) {
    return json(response, 422, {
      error: validationError,
    });
  }

  try {
    const user = await registerUser({
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role,
    });

    createSession(response, user.id);

    return json(response, 201, {
      user,
    });
  } catch (error: any) {
    return json(response, 409, {
      error:
        error?.message ??
        "Unable to create account.",
    });
  }
}

export async function login(
  request: IncomingMessage,
  response: ServerResponse,
) {
  const data: any = await readJson(request);

  const validationError =
    validateLogin(data);

  if (validationError) {
    return json(response, 422, {
      error: validationError,
    });
  }

  try {
    const user = await loginUser(
      data.email,
      data.password,
    );

    createSession(response, user.id);

    return json(response, 200, {
      user,
    });
  } catch (error: any) {
    return json(response, 401, {
      error:
        error?.message ??
        "Incorrect email or password.",
    });
  }
}

export function me(
  request: IncomingMessage,
  response: ServerResponse,
) {
  return json(response, 200, {
    user: getCurrentUser(request),
  });
}

export function logout(
  request: IncomingMessage,
  response: ServerResponse,
) {
  destroySession(request, response);

  return json(response, 200, {
    ok: true,
  });
}

export function google(
  _request: IncomingMessage,
  response: ServerResponse,
  url: URL,
) {
  const role = url.searchParams.get("role") === "brand" ? "brand" : "creator";
  const started = startGoogleOAuth(response, role);

  if (!started) {
    return redirect(
      response,
      getFrontendLoginErrorUrl(
        "google_not_configured",
      ),
    );
  }
}

export async function googleCallback(
  request: IncomingMessage,
  response: ServerResponse,
  url: URL,
) {
  const params = Object.fromEntries(
    url.searchParams,
  );

  const cookies = Object.fromEntries(
    (request.headers.cookie ?? "")
      .split(";")
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");

        return [
          part.slice(0, index).trim(),
          decodeURIComponent(
            part.slice(index + 1),
          ),
        ];
      }),
  );

  if (
    params.error ||
    !params.code ||
    params.state !==
      cookies.naano_oauth_state
  ) {
    return redirect(
      response,
      getFrontendLoginErrorUrl(
        "google_failed",
      ),
    );
  }

  try {
    const role = cookies.naano_oauth_role === "brand" ? "brand" : "creator";
    const user = await handleGoogleCallback(params.code, role);

    createSession(response, user.id);

    return redirect(
      response,
      getFrontendDashboardUrl(),
    );
  } catch {
    return redirect(
      response,
      getFrontendLoginErrorUrl(
        "google_failed",
      ),
    );
  }
}

export function linkedin(_request: IncomingMessage, response: ServerResponse, url: URL) {
  const role = url.searchParams.get("role") === "brand" ? "brand" : "creator";
  const started = startLinkedInOAuth(response, role);
  if (!started) return redirect(response, getFrontendLinkedInErrorUrl("linkedin_not_configured"));
}

export async function linkedinCallback(request: IncomingMessage, response: ServerResponse, url: URL) {
  const params = Object.fromEntries(url.searchParams);
  const cookies = Object.fromEntries((request.headers.cookie ?? "").split(";").filter(Boolean).map((part) => {
    const index = part.indexOf("=");
    return [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1))];
  }));
  if (params.error || !params.code || params.state !== cookies.naano_oauth_state) return redirect(response, getFrontendLinkedInErrorUrl("linkedin_failed"));
  try {
    const role = cookies.naano_oauth_role === "brand" ? "brand" : "creator";
    const user = await handleLinkedInCallback(params.code, role);
    createSession(response, user.id);
    return redirect(response, getFrontendDashboardUrl());
  } catch {
    return redirect(response, getFrontendLinkedInErrorUrl("linkedin_failed"));
  }
}

export function checkEmail(_request: IncomingMessage, response: ServerResponse, url: URL) {
  const email = (url.searchParams.get("email") ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(response, 200, { valid: false, available: false });
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  return json(response, 200, { valid: true, available: !existing });
}
