import type { IncomingMessage, ServerResponse } from "node:http";
import { randomBytes } from "node:crypto";
import { requireAuth } from "../middleware/authMiddleware";
import { db } from "../db/client";
import { json, now } from "../utils/api";

function ensureCreatorProfile(userId: string, name: string) {
  let profile = db
    .prepare("SELECT * FROM creator_profiles WHERE user_id = ?")
    .get(userId) as Record<string, unknown> | undefined;

  if (!profile) {
    const timestamp = now();

    db.prepare(
      "INSERT INTO creator_profiles (user_id, name, created_at, updated_at) VALUES (?, ?, ?, ?)",
    ).run(userId, name, timestamp, timestamp);

    profile = db
      .prepare("SELECT * FROM creator_profiles WHERE user_id = ?")
      .get(userId) as Record<string, unknown>;
  }

  const profileName = String(
    profile.name ?? "",
  ).trim();

  if (
    !profileName ||
    profileName === "Creator"
  ) {
    db.prepare(
      "UPDATE creator_profiles SET name = ?, updated_at = ? WHERE user_id = ?",
    ).run(
      name,
      now(),
      userId,
    );

    profile.name = name;
  }

  if (!String(profile.slug ?? "").trim()) {
    const base =
      (
        profile.name ??
        name ??
        "creator"
      )
        .toString()
        .trim() || "creator";

    const normalizedBase =
      base
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") ||
      "creator";

    const slug =
      normalizedBase +
      "-" +
      randomBytes(4).toString("hex");

    db.prepare(
      "UPDATE creator_profiles SET slug = ?, updated_at = ? WHERE user_id = ?",
    ).run(
      slug,
      now(),
      userId,
    );

    profile.slug = slug;
  }

  return profile;
}

export function dashboard(request: IncomingMessage, response: ServerResponse) {
  const user = requireAuth(request, response);

  if (!user) {
    return;
  }

  if (user.role === "brand") {
    const stats = db
      .prepare("SELECT COUNT(*) AS campaigns FROM campaigns WHERE brand_id = ?")
      .get(user.id) as {
      campaigns: number;
    };

    const activated = db
      .prepare(
        "SELECT COUNT(DISTINCT creator_id) AS count FROM collaborations WHERE brand_id = ? AND status NOT IN ('declined', 'cancelled')",
      )
      .get(user.id) as {
      count: number;
    };

    const posts = db
      .prepare(
        "SELECT COUNT(*) AS count FROM collaborations WHERE brand_id = ? AND published_url IS NOT NULL",
      )
      .get(user.id) as {
      count: number;
    };

    const impressions = db
      .prepare(
        "SELECT COALESCE(SUM(cm.impressions), 0) AS count FROM campaign_metrics cm JOIN collaborations c ON c.id = cm.collaboration_id WHERE c.brand_id = ?",
      )
      .get(user.id) as {
      count: number;
    };

    return json(response, 200, {
      data: {
        role: "brand",
        metrics: {
          campaigns: stats.campaigns,
          creators_activated: activated.count,
          posts_published: posts.count,
          impressions: impressions.count,
        },
      },
    });
  }

  const profile = ensureCreatorProfile(user.id, user.name);

  const analyticsTotals = db
    .prepare(
      `SELECT
        COUNT(*) AS posts,
        COALESCE(SUM(impressions), 0) AS impressions,
        COALESCE(SUM(engagements), 0) AS engagements
       FROM analytics_posts
       WHERE creator_id = ?`,
    )
    .get(user.id) as {
    posts: number;
    impressions: number;
    engagements: number;
  };

  const applications = db
    .prepare("SELECT COUNT(*) AS count FROM applications WHERE creator_id = ?")
    .get(user.id) as {
    count: number;
  };

  const collaborations = db
    .prepare(
      "SELECT COUNT(*) AS count FROM collaborations WHERE creator_id = ? AND status NOT IN ('declined', 'cancelled')",
    )
    .get(user.id) as {
    count: number;
  };

  const earnings = db
    .prepare(
      "SELECT COALESCE(SUM(CASE WHEN status = 'available' THEN amount_cents ELSE 0 END), 0) AS available, COALESCE(SUM(CASE WHEN type = 'collaboration' THEN amount_cents ELSE 0 END), 0) AS total FROM earnings WHERE user_id = ?",
    )
    .get(user.id) as {
    available: number;
    total: number;
  };

  const notifications = db
    .prepare(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 10",
    )
    .all(user.id);

  return json(response, 200, {
    data: {
      role: "creator",
      profile,
      metrics: {
        followers: Number(profile.followers ?? 0),
        posts: Number(analyticsTotals.posts ?? 0),
        impressions: Number(analyticsTotals.impressions ?? 0),
        engagements: Number(analyticsTotals.engagements ?? 0),
        applications: applications.count,
        collaborations: collaborations.count,
      },
      earnings,
      notifications,
    },
  });
}
