const DEFAULT_API_URL = "http://localhost:8787";
const API_URL = (import.meta.env.VITE_API_URL ?? DEFAULT_API_URL).replace(
  /\/$/,
  "",
);

interface ApiErrorBody {
  error?:
    | {
        message?: string;
      }
    | string;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getErrorMessage(body: unknown, fallback: string) {
  if (!body || typeof body !== "object") {
    return fallback;
  }

  const error = (body as ApiErrorBody).error;

  if (typeof error === "string") {
    return error;
  }

  return error?.message ?? fallback;
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return response.text();
  }

  return response.json().catch(() => undefined);
}

export async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(body, "Request failed."),
      response.status,
    );
  }

  return body as T;
}
