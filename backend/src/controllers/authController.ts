import type {
  IncomingMessage,
  ServerResponse,
} from "node:http";
import { createSession, destroySession, getCurrentUser, setCookie } from "../utils/session";
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
import { requestEmailVerification, verifyEmailCode } from "../services/emailVerificationService";
import { createHash } from "node:crypto";
import {
  getFrontendDashboardUrl,
  getFrontendLoginErrorUrl,
  getFrontendOnboardingUrl,
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

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function hasVerifiedEmail(request: IncomingMessage, email: string) {
  const token = parseCookies(request).naano_email_verified;
  if (!token) return false;
  const row = db.prepare(`
    SELECT id
    FROM email_verifications
    WHERE email = ?
      AND verification_token_hash = ?
      AND verified_at IS NOT NULL
      AND expires_at > ?
    ORDER BY verified_at DESC
    LIMIT 1
  `).get(email.trim().toLowerCase(), hashValue(token), Date.now());
  return Boolean(row);
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

  if (!hasVerifiedEmail(request, data.email)) {
    return json(response, 403, {
      error: "Verify your email before creating your account.",
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
    db.prepare("DELETE FROM email_verifications WHERE email = ?").run(data.email.trim().toLowerCase());
    setCookie(response, "naano_email_verified", "", { maxAge: 0 });

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
  const role =
    url.searchParams.get("role") === "brand"
      ? "brand"
      : "creator";
  const flow =
    url.searchParams.get("flow") === "signup"
      ? "signup"
      : "login";

  const started = startGoogleOAuth(
    response,
    role,
    flow,
  );

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

  if (params.error) {
    console.error(
      "Google OAuth provider error:",
      params.error,
      params.error_description,
    );
  
    return redirect(
      response,
      getFrontendLoginErrorUrl(
        "google_failed",
      ),
    );
  }
  
  if (!params.code) {
    console.error(
      "Google OAuth callback missing authorization code.",
    );
  
    return redirect(
      response,
      getFrontendLoginErrorUrl(
        "google_failed",
      ),
    );
  }
  
  if (
    params.state !==
    cookies.naano_oauth_state
  ) {
    console.error(
      "Google OAuth state mismatch.",
      {
        received: params.state,
        expected: cookies.naano_oauth_state,
        hasCookie: Boolean(
          cookies.naano_oauth_state,
        ),
      },
    );
  
    return redirect(
      response,
      getFrontendLoginErrorUrl(
        "google_failed",
      ),
    );
  }

  try {
    const role =
      cookies.naano_oauth_role === "brand"
        ? "brand"
        : "creator";
    const flow =
      cookies.naano_oauth_flow === "signup"
        ? "signup"
        : "login";

    const { user, isNewUser } =
      await handleGoogleCallback(
        params.code,
        role,
      );

    createSession(response, user.id);
    setCookie(
      response,
      "naano_oauth_state",
      "",
      { maxAge: 0 },
    );
    setCookie(
      response,
      "naano_oauth_role",
      "",
      { maxAge: 0 },
    );
    setCookie(
      response,
      "naano_oauth_flow",
      "",
      { maxAge: 0 },
    );

    return redirect(
      response,
      isNewUser && flow === "signup"
        ? getFrontendOnboardingUrl(role)
        : getFrontendDashboardUrl(),
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

export async function requestEmailOtp(
  request: IncomingMessage,
  response: ServerResponse,
) {
  const data: any = await readJson(request);
  const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(response, 422, { error: "Enter a valid email address." });
  }

  try {
    const result = await requestEmailVerification(email);
    return json(response, 200, {
      ok: true,
      expiresAt: result.expiresAt,
    });
  } catch (error: any) {
    const message = error?.message ?? "Unable to send verification code.";
    const status = message.includes("wait") ? 429 : message.includes("already exists") ? 409 : message.includes("not configured") ? 503 : 502;
    return json(response, status, { error: message });
  }
}

export async function verifyEmailOtp(
  request: IncomingMessage,
  response: ServerResponse,
) {
  const data: any = await readJson(request);
  const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  const code = typeof data.code === "string" ? data.code.trim() : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{6}$/.test(code)) {
    return json(response, 422, { error: "Enter the 6-digit verification code." });
  }

  try {
    const token = verifyEmailCode(email, code);
    setCookie(response, "naano_email_verified", token, { maxAge: 30 * 60 });
    return json(response, 200, { ok: true });
  } catch (error: any) {
    return json(response, 422, {
      error: error?.message ?? "Unable to verify email.",
    });
  }
}

export function checkEmail(_request: IncomingMessage, response: ServerResponse, url: URL) {
  const email = (url.searchParams.get("email") ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(response, 200, { valid: false, available: false });
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  return json(response, 200, { valid: true, available: !existing });
}
