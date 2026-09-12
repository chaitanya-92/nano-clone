export function isEmail(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}

export function isValidRole(
  value: unknown,
): value is "creator" | "brand" {
  return value === "creator" || value === "brand";
}

export function validateRegistration(data: {
  email?: unknown;
  password?: unknown;
  name?: unknown;
  role?: unknown;
}) {
  if (!isEmail(data.email)) {
    return "Enter a valid email address.";
  }

  if (
    typeof data.password !== "string" ||
    data.password.length < 8
  ) {
    return "Password must be at least 8 characters.";
  }

  if (
    typeof data.name !== "string" ||
    data.name.trim().length < 2 ||
    data.name.trim().length > 80
  ) {
    return "Enter your name.";
  }

  if (!isValidRole(data.role)) {
    return "Select whether you are a creator or brand.";
  }

  return null;
}

export function validateLogin(data: {
  email?: unknown;
  password?: unknown;
}) {
  if (!isEmail(data.email) || typeof data.password !== "string") {
    return "Enter your email and password.";
  }

  return null;
}
