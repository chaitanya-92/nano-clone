import type { User, UserRole } from "@/features/authSlice";

type AuthResponse = { user: User };

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8787";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body = (await response.json().catch(() => ({}))) as T & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(body.error ?? "Something went wrong. Please try again.");
  }

  return body;
}

export function getCurrentUser() {
  return request<{ user: User | null }>("/api/auth/me");
}

export function login(email: string, password: string) {
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function register(
  name: string,
  email: string,
  password: string,
  role: UserRole,
) {
  return request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, role }),
  });
}

export function logout() {
  return request<{ ok: true }>("/api/auth/logout", {
    method: "POST",
  });
}
export async function checkEmail(email: string) {
  const response = await fetch(
    `${API_URL}/api/auth/check-email?email=${encodeURIComponent(email.trim())}`,
    { credentials: "include" },
  );
  if (!response.ok) return { valid: false, available: false };
  return response.json() as Promise<{ valid: boolean; available: boolean }>;
}

export function requestEmailOtp(email: string) {
  return request<{ ok: true; expiresAt: number }>(
    "/api/auth/email/request-otp",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    },
  );
}

export function verifyEmailOtp(email: string, code: string) {
  return request<{ ok: true }>("/api/auth/email/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

export async function deleteAccount() {
  return request<{ ok: true }>(
    "/api/auth/account",
    {
      method: "DELETE",
    },
  );
}
