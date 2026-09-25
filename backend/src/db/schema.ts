import { db } from "./client";

export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('creator', 'brand')),
      provider TEXT NOT NULL DEFAULT 'password',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS creator_profiles (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL DEFAULT '',
      slug TEXT UNIQUE,
      linkedin_url TEXT NOT NULL DEFAULT '',
      x_profile_url TEXT NOT NULL DEFAULT '',
      headline TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      bio TEXT NOT NULL DEFAULT '',
      country TEXT NOT NULL DEFAULT '',
      industries TEXT NOT NULL DEFAULT '[]',
      followers INTEGER NOT NULL DEFAULT 0,
      impressions INTEGER NOT NULL DEFAULT 0,
      engagement_count INTEGER NOT NULL DEFAULT 0,
      post_count INTEGER NOT NULL DEFAULT 0,
      profile_photo_url TEXT,
      price_cents INTEGER NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'EUR',
      card_status TEXT NOT NULL DEFAULT 'draft',
      onboarding_step INTEGER NOT NULL DEFAULT 1,
      onboarding_status TEXT NOT NULL DEFAULT 'not_started',
      registration_country TEXT NOT NULL DEFAULT '',
      registered_business INTEGER NOT NULL DEFAULT 0,
      legal_status TEXT NOT NULL DEFAULT '',
      legal_name TEXT NOT NULL DEFAULT '',
      trade_name TEXT NOT NULL DEFAULT '',
      pan_gstin TEXT NOT NULL DEFAULT '',
      legal_address TEXT NOT NULL DEFAULT '',
      tax_responsibility_confirmed INTEGER NOT NULL DEFAULT 0,
      self_billing_mandate_accepted INTEGER NOT NULL DEFAULT 0,
      certification_accepted INTEGER NOT NULL DEFAULT 0,
      professional_info_status TEXT NOT NULL DEFAULT 'incomplete',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS creator_targets (
      id TEXT PRIMARY KEY,
      creator_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS brand_profiles (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      company_name TEXT NOT NULL DEFAULT '',
      website TEXT NOT NULL DEFAULT '',
      logo_url TEXT,
      description TEXT NOT NULL DEFAULT '',
      value_proposition TEXT NOT NULL DEFAULT '',
      industries TEXT NOT NULL DEFAULT '[]',
      country TEXT NOT NULL DEFAULT '',
      onboarding_step INTEGER NOT NULL DEFAULT 1,
      onboarding_status TEXT NOT NULL DEFAULT 'not_started',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS brand_icps (
      id TEXT PRIMARY KEY,
      brand_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions(expires_at);
  `);
}