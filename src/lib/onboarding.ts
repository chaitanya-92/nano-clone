const API_URL = import.meta.env.VITE_API_URL ?? "https://nano-clone-lo9q.onrender.com";
async function request(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(body?.error?.message ?? body?.error ?? "Request failed.");
  return body;
}
export function saveCreatorSocial(data: {
  linkedinUrl: string;
  xProfileUrl: string;
}) {
  return request("/api/onboarding/social", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export function saveCreatorDetails(data: {
  country: string;
  industries: string[];
}) {
  return request("/api/onboarding/details", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export function saveCreatorProfile(data: { headline: string; bio: string }) {
  return request("/api/creator/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
export function saveCreatorCard(data: { priceCents: number }) {
  return request("/api/onboarding/card", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export function saveCreatorProfessional(data: Record<string, unknown>) {
  return request("/api/onboarding/professional", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export function saveBrandOnboarding(data: Record<string, unknown>) {
  return request("/api/onboarding/brand", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function connectSocial(provider: "linkedin" | "x", profileUrl: string) {
  return request("/api/social-accounts/connect", {
    method: "POST",
    body: JSON.stringify({ provider, profileUrl }),
  });
}
export function analyzeCompanyWebsite(website: string) {
  return request("/api/company/analyze", {
    method: "POST",
    body: JSON.stringify({ website }),
  });
}
