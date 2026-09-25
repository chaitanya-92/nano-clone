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
    emailVerified: 1,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  db.prepare(`
    INSERT INTO users
    (id, email, password_hash, name, role, provider, email_verified, created_at)
    VALUES
    (@id, @email, @passwordHash, @name, @role, @provider, @emailVerified, @createdAt)
  `).run(user);

  if (role === "creator") {
    db.prepare("INSERT INTO creator_profiles (user_id, name, created_at, updated_at) VALUES (?, ?, ?, ?)").run(user.id, user.name, user.createdAt, user.createdAt);
  } else {
    db.prepare("INSERT INTO brand_profiles (user_id, company_name, created_at, updated_at) VALUES (?, ?, ?, ?)").run(user.id, user.name, user.createdAt, user.createdAt);
  }

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

export function createOAuthUser({
  email,
  name,
  role,
  provider,
}: {
  email: string;
  name: string;
  role: "creator" | "brand";
  provider: string;
}) {
  const existing = findUserByEmail(email);
  if (existing) return publicUser(existing);
  const user = {
    id: randomBytes(18).toString("base64url"),
    email: email.toLowerCase(),
    name: name.slice(0, 80),
    role,
    provider,
    emailVerified: 1,
    createdAt: new Date().toISOString(),
  };
  db.prepare(`INSERT INTO users (id, email, name, role, provider, email_verified, created_at) VALUES (@id, @email, @name, @role, @provider, @emailVerified, @createdAt)`).run(user);
  if (role === "creator") {
    db.prepare("INSERT INTO creator_profiles (user_id, name, created_at, updated_at) VALUES (?, ?, ?, ?)").run(user.id, user.name, user.createdAt, user.createdAt);
  } else {
    db.prepare("INSERT INTO brand_profiles (user_id, company_name, created_at, updated_at) VALUES (?, ?, ?, ?)").run(user.id, user.name, user.createdAt, user.createdAt);
  }
  return publicUser(user);
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
    emailVerified: 1,
    createdAt: new Date().toISOString(),
  };

  db.prepare(`
    INSERT INTO users
    (id, email, name, role, provider, email_verified, created_at)
    VALUES
    (@id, @email, @name, @role, @provider, @emailVerified, @createdAt)
  `).run(user);

  db.prepare("INSERT INTO creator_profiles (user_id, name, created_at, updated_at) VALUES (?, ?, ?, ?)").run(user.id, user.name, user.createdAt, user.createdAt);

  return user;
}
