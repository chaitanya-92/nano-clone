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
      email_verified INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS email_verifications (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      code_hash TEXT NOT NULL,
      verification_token_hash TEXT,
      attempts INTEGER NOT NULL DEFAULT 0,
      expires_at INTEGER NOT NULL,
      verified_at INTEGER,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS email_verifications_email_idx ON email_verifications(email);
    CREATE INDEX IF NOT EXISTS email_verifications_expires_at_idx ON email_verifications(expires_at);

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

    CREATE TABLE IF NOT EXISTS social_accounts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      provider TEXT NOT NULL CHECK(provider IN ('linkedin','x')),
      provider_user_id TEXT,
      access_token TEXT,
      refresh_token TEXT,
      token_expires_at INTEGER,
      last_synced_at TEXT,
      sync_error TEXT,
      followers_count INTEGER NOT NULL DEFAULT 0,
      impressions INTEGER NOT NULL DEFAULT 0,
      engagements INTEGER NOT NULL DEFAULT 0,
      posts_count INTEGER NOT NULL DEFAULT 0,
      username TEXT,
      profile_url TEXT,
      profile_image_url TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      verified_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(user_id, provider)
    );

    CREATE TABLE IF NOT EXISTS website_analyses (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      website TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      company_name TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      value_proposition TEXT NOT NULL DEFAULT '',
      industries TEXT NOT NULL DEFAULT '[]',
      audience_signals TEXT NOT NULL DEFAULT '[]',
      social_links TEXT NOT NULL DEFAULT '[]',
      raw_title TEXT NOT NULL DEFAULT '',
      raw_description TEXT NOT NULL DEFAULT '',
      error_message TEXT,
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

    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      brand_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      brief TEXT NOT NULL DEFAULT '',
      deliverables TEXT NOT NULL DEFAULT '[]',
      requirements TEXT NOT NULL DEFAULT '[]',
      budget_cents INTEGER NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'EUR',
      application_deadline TEXT,
      start_date TEXT,
      end_date TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      min_followers INTEGER NOT NULL DEFAULT 0,
      max_applications INTEGER,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
      creator_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      message TEXT NOT NULL DEFAULT '',
      proposed_price_cents INTEGER,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(campaign_id, creator_id)
    );

    CREATE TABLE IF NOT EXISTS collaborations (
      id TEXT PRIMARY KEY,
      campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
      creator_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      brand_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      application_id TEXT REFERENCES applications(id) ON DELETE SET NULL,
      status TEXT NOT NULL DEFAULT 'application_submitted',
      brief TEXT NOT NULL DEFAULT '',
      content_url TEXT,
      published_url TEXT,
      due_at TEXT,
      approved_at TEXT,
      completed_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS analytics_posts (
      id TEXT PRIMARY KEY,
      creator_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      platform TEXT NOT NULL DEFAULT 'linkedin',
      external_id TEXT,
      url TEXT,
      text TEXT NOT NULL DEFAULT '',
      published_at TEXT NOT NULL,
      impressions INTEGER NOT NULL DEFAULT 0,
      reach INTEGER NOT NULL DEFAULT 0,
      likes INTEGER NOT NULL DEFAULT 0,
      comments INTEGER NOT NULL DEFAULT 0,
      reposts INTEGER NOT NULL DEFAULT 0,
      engagements INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS campaign_metrics (
      id TEXT PRIMARY KEY,
      collaboration_id TEXT NOT NULL REFERENCES collaborations(id) ON DELETE CASCADE,
      impressions INTEGER NOT NULL DEFAULT 0,
      reach INTEGER NOT NULL DEFAULT 0,
      engagements INTEGER NOT NULL DEFAULT 0,
      likes INTEGER NOT NULL DEFAULT 0,
      comments INTEGER NOT NULL DEFAULT 0,
      reposts INTEGER NOT NULL DEFAULT 0,
      recorded_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS campaign_metrics_collaboration_id_idx
      ON campaign_metrics(collaboration_id);

    CREATE TABLE IF NOT EXISTS earnings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      collaboration_id TEXT REFERENCES collaborations(id) ON DELETE SET NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      amount_cents INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'EUR',
      description TEXT NOT NULL DEFAULT '',
      available_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payout_methods (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      label TEXT NOT NULL,
      provider_reference TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS withdrawals (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      payout_method_id TEXT NOT NULL REFERENCES payout_methods(id),
      amount_cents INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'EUR',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      creator_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      brand_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      subject TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'open',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      body TEXT NOT NULL,
      read_at TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL DEFAULT '',
      read_at TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS affiliate_referrals (
      id TEXT PRIMARY KEY,
      referrer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      referred_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      type TEXT NOT NULL,
      code TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'created',
      reward_started_at TEXT,
      reward_ends_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS affiliate_rewards (
      id TEXT PRIMARY KEY,
      referral_id TEXT NOT NULL REFERENCES affiliate_referrals(id) ON DELETE CASCADE,
      referrer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      source_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      collaboration_id TEXT REFERENCES collaborations(id) ON DELETE SET NULL,
      amount_cents INTEGER NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'EUR',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS social_accounts_user_id_idx ON social_accounts(user_id);
    CREATE INDEX IF NOT EXISTS website_analyses_user_id_idx ON website_analyses(user_id);
    CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions(expires_at);
  `);
  migrateDatabase();
}

export function migrateDatabase() {
  const migrations = [
    "ALTER TABLE social_accounts ADD COLUMN provider_user_id TEXT",
    "ALTER TABLE social_accounts ADD COLUMN access_token TEXT",
    "ALTER TABLE social_accounts ADD COLUMN refresh_token TEXT",
    "ALTER TABLE social_accounts ADD COLUMN token_expires_at INTEGER",
    "ALTER TABLE social_accounts ADD COLUMN last_synced_at TEXT",
    "ALTER TABLE social_accounts ADD COLUMN sync_error TEXT",
    "ALTER TABLE social_accounts ADD COLUMN followers_count INTEGER NOT NULL DEFAULT 0",
    "ALTER TABLE social_accounts ADD COLUMN impressions INTEGER NOT NULL DEFAULT 0",
    "ALTER TABLE social_accounts ADD COLUMN engagements INTEGER NOT NULL DEFAULT 0",
    "ALTER TABLE social_accounts ADD COLUMN posts_count INTEGER NOT NULL DEFAULT 0",
  ];

  for (const statement of migrations) {
    try {
      db.exec(statement);
    } catch (error: any) {
      if (!String(error?.message ?? "").includes("duplicate column name")) throw error;
    }
  }

  try {
    db.exec(
      "ALTER TABLE users ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 0",
    );
  } catch (error: any) {
    if (!String(error?.message ?? "").includes("duplicate column name"))
      throw error;
  }
}
