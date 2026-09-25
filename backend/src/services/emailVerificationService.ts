import { createHash } from "node:crypto";
import { randomBytes, randomInt } from "node:crypto";
import { db } from "../db/client";

const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function otpHash(email: string, code: string) {
  const secret = process.env.EMAIL_OTP_SECRET ?? "";
  return hashValue(`${email}:${code}:${secret}`);
}

async function sendVerificationEmail(email: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY ?? "";
  const from = process.env.RESEND_FROM_EMAIL ?? "";

  if (!apiKey || !from) {
    throw new Error("Email delivery is not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Your Naano verification code",
      html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px;color:#171d2b"><p style="font-size:22px;font-weight:700;margin:0 0 24px">naano.</p><h1 style="font-size:24px;margin:0 0 12px">Verify your email</h1><p style="font-size:15px;line-height:1.6;color:#626a78">Use the verification code below to finish creating your Naano account.</p><div style="margin:28px 0;padding:18px 22px;border-radius:14px;background:#f5f7fb;text-align:center;font-size:32px;letter-spacing:8px;font-weight:700">${code}</div><p style="font-size:13px;line-height:1.6;color:#7a8290">This code expires in 10 minutes. If you did not request this, you can ignore this email.</p></div>`,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || "Unable to send verification email.");
  }
}

export async function requestEmailVerification(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(normalizedEmail);

  if (existing) {
    throw new Error("An account already exists for this email.");
  }

  const recent = db.prepare("SELECT created_at FROM email_verifications WHERE email = ? ORDER BY created_at DESC LIMIT 1").get(normalizedEmail) as { created_at?: string } | undefined;
  if (recent?.created_at && Date.now() - new Date(recent.created_at).getTime() < RESEND_COOLDOWN_MS) {
    throw new Error("Please wait before requesting another code.");
  }

  const code = String(randomInt(100000, 1000000));
  const verificationId = randomBytes(18).toString("base64url");
  const expiresAt = Date.now() + OTP_TTL_MS;
  const createdAt = new Date().toISOString();

  db.prepare("DELETE FROM email_verifications WHERE email = ? AND verified_at IS NULL").run(normalizedEmail);
  db.prepare(`
    INSERT INTO email_verifications
    (id, email, code_hash, attempts, expires_at, created_at)
    VALUES (?, ?, ?, 0, ?, ?)
  `).run(verificationId, normalizedEmail, otpHash(normalizedEmail, code), expiresAt, createdAt);

  try {
    await sendVerificationEmail(normalizedEmail, code);
  } catch (error) {
    db.prepare("DELETE FROM email_verifications WHERE id = ?").run(verificationId);
    throw error;
  }

  return { expiresAt };
}

export function verifyEmailCode(email: string, code: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const verification = db.prepare("SELECT * FROM email_verifications WHERE email = ? ORDER BY created_at DESC LIMIT 1").get(normalizedEmail) as any;

  if (!verification || verification.verified_at) {
    throw new Error("Request a new verification code.");
  }

  if (verification.expires_at < Date.now()) {
    throw new Error("This verification code has expired.");
  }

  if (verification.attempts >= MAX_ATTEMPTS) {
    throw new Error("Too many incorrect attempts. Request a new code.");
  }

  const expectedHash = otpHash(normalizedEmail, code.trim());
  if (expectedHash !== verification.code_hash) {
    db.prepare("UPDATE email_verifications SET attempts = attempts + 1 WHERE id = ?").run(verification.id);
    throw new Error("Incorrect verification code.");
  }

  const verificationToken = randomBytes(32).toString("base64url");
  db.prepare("UPDATE email_verifications SET verified_at = ?, verification_token_hash = ? WHERE id = ?").run(Date.now(), hashValue(verificationToken), verification.id);

  return verificationToken;
}

export const emailVerificationConfig = {
  otpTtlMs: OTP_TTL_MS,
  resendCooldownMs: RESEND_COOLDOWN_MS,
};
