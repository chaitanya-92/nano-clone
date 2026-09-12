import { randomBytes } from "node:crypto";
import { db } from "../db/client";
import { hashPassword, passwordMatches } from "../utils/password";

export function publicUser(user: any) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export async function registerUser({
  email,
  password,
  name,
  role,
}: {
  email: string;
  password: string;
  name: string;
  role: "creator" | "brand";
}) {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(normalizedEmail);

  if (existingUser) {
    throw new Error("An account already exists for this email.");
  }

  const user = {
    id: randomBytes(18).toString("base64url"),
    email: normalizedEmail,
    name: name.trim(),
    role,
    provider: "password",
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  db.prepare(`
    INSERT INTO users
    (id, email, password_hash, name, role, provider, created_at)
    VALUES
    (@id, @email, @passwordHash, @name, @role, @provider, @createdAt)
  `).run(user);

  return publicUser(user);
}

export async function loginUser(
  email: string,
  password: string,
) {
  const user: any = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.trim().toLowerCase());

  if (
    !user ||
    !user.password_hash ||
    !(await passwordMatches(password, user.password_hash))
  ) {
    throw new Error("Incorrect email or password.");
  }

  return publicUser(user);
}

export function findUserByEmail(email: string) {
  return db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.trim().toLowerCase());
}

export function createGoogleUser({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  const user = {
    id: randomBytes(18).toString("base64url"),
    email: email.toLowerCase(),
    name: name.slice(0, 80),
    role: "creator",
    provider: "google",
    createdAt: new Date().toISOString(),
  };

  db.prepare(`
    INSERT INTO users
    (id, email, name, role, provider, created_at)
    VALUES
    (@id, @email, @name, @role, @provider, @createdAt)
  `).run(user);

  return user;
}
