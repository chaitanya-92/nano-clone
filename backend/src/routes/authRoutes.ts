import type {
  IncomingMessage,
  ServerResponse,
} from "node:http";
import {
  google,
  googleCallback,
  login,
  logout,
  me,
  register,
  checkEmail,
  linkedin,
  linkedinCallback,
} from "../controllers/authController";

export async function authRoutes(
  request: IncomingMessage,
  response: ServerResponse,
  url: URL,
) {
  if (
    url.pathname === "/api/auth/me" &&
    request.method === "GET"
  ) {
    return me(request, response);
  }

  if (
    url.pathname === "/api/auth/logout" &&
    request.method === "POST"
  ) {
    return logout(request, response);
  }

  if (
    url.pathname === "/api/auth/register" &&
    request.method === "POST"
  ) {
    return register(request, response);
  }

  if (url.pathname === "/api/auth/check-email" && request.method === "GET") {
    return checkEmail(request, response, url);
  }

  if (
    url.pathname === "/api/auth/login" &&
    request.method === "POST"
  ) {
    return login(request, response);
  }

  if (url.pathname === "/api/auth/linkedin" && request.method === "GET") {
    return linkedin(request, response, url);
  }

  if (url.pathname === "/api/auth/linkedin/callback" && request.method === "GET") {
    return linkedinCallback(request, response, url);
  }

  if (
    url.pathname === "/api/auth/google" &&
    request.method === "GET"
  ) {
    return google(request, response, url);
  }

  if (
    url.pathname ===
      "/api/auth/google/callback" &&
    request.method === "GET"
  ) {
    return googleCallback(
      request,
      response,
      url,
    );
  }

  return false;
}
