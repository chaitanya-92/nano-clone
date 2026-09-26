import type { IncomingMessage, ServerResponse } from "node:http";
import { requireAuth } from "../middleware/authMiddleware";
import { db } from "../db/client";
import { json } from "../utils/api";
import { syncSocialAnalytics } from "../services/socialAnalyticsService";

export async function analytics(
  request: IncomingMessage,
  response: ServerResponse,
  url: URL,
) {
  const user = requireAuth(request, response);

  if (!user) {
    return;
  }

  const range = url.searchParams.get("range") ?? "all";

  const syncStatuses = await syncSocialAnalytics(user.id);

  const since =
    range === "30d"
      ? new Date(Date.now() - 30 * 86400000).toISOString()
      : range === "90d"
        ? new Date(Date.now() - 90 * 86400000).toISOString()
        : null;

  const where = since ? "AND published_at >= ?" : "";

  const args = since ? [user.id, since] : [user.id];

  const summary = db
    .prepare(
      `SELECT
        COUNT(*) AS posts,
        COALESCE(SUM(impressions), 0) AS impressions,
        COALESCE(SUM(reach), 0) AS reach,
        COALESCE(SUM(likes), 0) AS likes,
        COALESCE(SUM(comments), 0) AS comments,
        COALESCE(SUM(reposts), 0) AS reposts,
        COALESCE(SUM(engagements), 0) AS engagements
      FROM analytics_posts
      WHERE creator_id = ?
      ${where}`,
    )
    .get(...args);

  const posts = db
    .prepare(
      `SELECT *
       FROM analytics_posts
       WHERE creator_id = ?
       ${where}
       ORDER BY published_at DESC`,
    )
    .all(...args);

  const profile = (db
    .prepare("SELECT followers FROM creator_profiles WHERE user_id = ?")
    .get(user.id) as
    | {
        followers: number;
      }
    | undefined) ?? {
    followers: 0,
  };

  const platforms = db
    .prepare(
      `SELECT provider,status,followers_count,impressions,engagements,posts_count,last_synced_at,sync_error
       FROM social_accounts WHERE user_id=? ORDER BY provider`,
    )
    .all(user.id)
    .map((item: any) => ({
      ...item,
      followers_count: Number(item.followers_count ?? 0),
      impressions: Number(item.impressions ?? 0),
      engagements: Number(item.engagements ?? 0),
      posts_count: Number(item.posts_count ?? 0),
    }));

  const profileTotals = db
    .prepare(
      `SELECT
        COALESCE(SUM(impressions), 0) AS impressions,
        COALESCE(SUM(engagements), 0) AS engagement_count,
        COUNT(*) AS post_count
       FROM analytics_posts
       WHERE creator_id = ?
       ${where}`,
    )
    .get(...args) as {
    impressions: number;
    engagement_count: number;
    post_count: number;
  };

  return json(response, 200, {
    data: {
      range,
      profile: {
        followers: Number(profile.followers ?? 0),
        impressions: Number(profileTotals.impressions ?? 0),
        engagement_count: Number(profileTotals.engagement_count ?? 0),
        post_count: Number(profileTotals.post_count ?? 0),
      },
      summary: {
        posts: Number((summary as any)?.posts ?? 0),
        impressions: Number((summary as any)?.impressions ?? 0),
        reach: Number((summary as any)?.reach ?? 0),
        likes: Number((summary as any)?.likes ?? 0),
        comments: Number((summary as any)?.comments ?? 0),
        reposts: Number((summary as any)?.reposts ?? 0),
        engagements: Number((summary as any)?.engagements ?? 0),
      },
      posts: (posts as any[]).map((post) => ({
        ...post,
        impressions: Number(post.impressions ?? 0),
        reach: Number(post.reach ?? 0),
        likes: Number(post.likes ?? 0),
        comments: Number(post.comments ?? 0),
        reposts: Number(post.reposts ?? 0),
        engagements: Number(post.engagements ?? 0),
      })),
      syncStatuses,
      platforms,
    },
  });
}
