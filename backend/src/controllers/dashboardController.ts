import type { IncomingMessage, ServerResponse } from "node:http";
import { requireAuth } from "../middleware/authMiddleware";
import { db } from "../db/client";
import { json } from "../utils/api";

export function dashboard(request: IncomingMessage, response: ServerResponse) {
  const user = requireAuth(request, response);
  if (!user) return;
  if (user.role === "brand") {
    const stats = db
      .prepare("SELECT COUNT(*) AS campaigns FROM campaigns WHERE brand_id=?")
      .get(user.id) as any;
    const activated = db
      .prepare(
        "SELECT COUNT(DISTINCT creator_id) AS count FROM collaborations WHERE brand_id=? AND status NOT IN ('declined','cancelled')",
      )
      .get(user.id) as any;
    const posts = db
      .prepare(
        "SELECT COUNT(*) AS count FROM collaborations WHERE brand_id=? AND published_url IS NOT NULL",
      )
      .get(user.id) as any;
    const impressions = db
      .prepare(
        "SELECT COALESCE(SUM(cm.impressions),0) AS count FROM campaign_metrics cm JOIN collaborations c ON c.id=cm.collaboration_id WHERE c.brand_id=?",
      )
      .get(user.id) as any;
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
  const p = db
    .prepare("SELECT * FROM creator_profiles WHERE user_id=?")
    .get(user.id) as any;
  const applications = db
    .prepare("SELECT COUNT(*) AS count FROM applications WHERE creator_id=?")
    .get(user.id) as any;
  const collaborations = db
    .prepare(
      "SELECT COUNT(*) AS count FROM collaborations WHERE creator_id=? AND status NOT IN ('declined','cancelled')",
    )
    .get(user.id) as any;
  const earnings = db
    .prepare(
      "SELECT COALESCE(SUM(CASE WHEN status IN ('available','paid') THEN amount_cents ELSE 0 END),0) AS available,COALESCE(SUM(amount_cents),0) AS total FROM earnings WHERE user_id=?",
    )
    .get(user.id) as any;
  const notifications = db
    .prepare(
      "SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 10",
    )
    .all(user.id);
  return json(response, 200, {
    data: {
      role: "creator",
      profile: p,
      metrics: {
        followers: p?.followers ?? 0,
        posts: p?.post_count ?? 0,
        impressions: p?.impressions ?? 0,
        engagements: p?.engagement_count ?? 0,
        applications: applications.count,
        collaborations: collaborations.count,
      },
      earnings,
      notifications,
    },
  });
}
