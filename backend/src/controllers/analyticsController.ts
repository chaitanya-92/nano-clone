import type { IncomingMessage, ServerResponse } from "node:http";
import { db } from "../db/client";
import { requireAuth } from "../middleware/authMiddleware";
import { syncSocialAnalytics } from "../services/socialAnalyticsService";
import { json } from "../utils/api";

type AnalyticsRange = "all" | "30d" | "90d";

interface AnalyticsSummaryRow {
  posts: number;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  reposts: number;
  engagements: number;
}

interface AnalyticsProfileTotals {
  impressions: number;
  engagement_count: number;
  post_count: number;
}

interface AnalyticsPostRow {
  id: string;
  platform: string;
  url: string | null;
  text: string;
  published_at: string;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  reposts: number;
  engagements: number;
}

interface CreatorFollowersRow {
  followers: number;
}

interface SocialAccountRow {
  provider: "linkedin" | "x";
  status: string;
  followers_count: number | null;
  impressions: number | null;
  engagements: number | null;
  posts_count: number | null;
  last_synced_at: string | null;
  sync_error: string | null;
}

const RANGE_DAYS: Record<Exclude<AnalyticsRange, "all">, number> = {
  "30d": 30,
  "90d": 90,
};

function parseRange(value: string | null): AnalyticsRange {
  return value === "30d" || value === "90d" ? value : "all";
}

function getSince(range: AnalyticsRange) {
  const days = range === "all" ? null : RANGE_DAYS[range];

  return days === null
    ? null
    : new Date(Date.now() - days * 86_400_000).toISOString();
}

function normalizeNumber(value: number | null | undefined) {
  return Number(value ?? 0);
}

export async function analytics(
  request: IncomingMessage,
  response: ServerResponse,
  url: URL,
) {
  const user = requireAuth(request, response);

  if (!user) {
    return;
  }

  const range = parseRange(url.searchParams.get("range"));
  const syncStatuses = await syncSocialAnalytics(user.id);
  const since = getSince(range);
  const whereClause = since ? "AND published_at >= ?" : "";
  const queryArgs = since ? [user.id, since] : [user.id];

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
      ${whereClause}`,
    )
    .get(...queryArgs) as AnalyticsSummaryRow;

  const posts = db
    .prepare(
      `SELECT
        id,
        platform,
        url,
        text,
        published_at,
        impressions,
        reach,
        likes,
        comments,
        reposts,
        engagements
       FROM analytics_posts
       WHERE creator_id = ?
       ${whereClause}
       ORDER BY published_at DESC`,
    )
    .all(...queryArgs) as AnalyticsPostRow[];

  const profile = (db
    .prepare("SELECT followers FROM creator_profiles WHERE user_id = ?")
    .get(user.id) as CreatorFollowersRow | undefined) ?? {
    followers: 0,
  };

  const profileTotals = db
    .prepare(
      `SELECT
        COALESCE(SUM(impressions), 0) AS impressions,
        COALESCE(SUM(engagements), 0) AS engagement_count,
        COUNT(*) AS post_count
       FROM analytics_posts
       WHERE creator_id = ?
       ${whereClause}`,
    )
    .get(...queryArgs) as AnalyticsProfileTotals;

  const platforms = (
    db
      .prepare(
        `SELECT
        provider,
        status,
        followers_count,
        impressions,
        engagements,
        posts_count,
        last_synced_at,
        sync_error
       FROM social_accounts
       WHERE user_id = ?
       ORDER BY provider`,
      )
      .all(user.id) as SocialAccountRow[]
  ).map((account) => ({
    provider: account.provider,
    status: account.status,
    followers_count: normalizeNumber(account.followers_count),
    impressions: normalizeNumber(account.impressions),
    engagements: normalizeNumber(account.engagements),
    posts_count: normalizeNumber(account.posts_count),
    last_synced_at: account.last_synced_at,
    sync_error: account.sync_error,
  }));

  return json(response, 200, {
    data: {
      range,
      profile: {
        followers: normalizeNumber(profile.followers),
        impressions: normalizeNumber(profileTotals.impressions),
        engagement_count: normalizeNumber(profileTotals.engagement_count),
        post_count: normalizeNumber(profileTotals.post_count),
      },
      summary: {
        posts: normalizeNumber(summary.posts),
        impressions: normalizeNumber(summary.impressions),
        reach: normalizeNumber(summary.reach),
        likes: normalizeNumber(summary.likes),
        comments: normalizeNumber(summary.comments),
        reposts: normalizeNumber(summary.reposts),
        engagements: normalizeNumber(summary.engagements),
      },
      posts: posts.map((post) => ({
        ...post,
        impressions: normalizeNumber(post.impressions),
        reach: normalizeNumber(post.reach),
        likes: normalizeNumber(post.likes),
        comments: normalizeNumber(post.comments),
        reposts: normalizeNumber(post.reposts),
        engagements: normalizeNumber(post.engagements),
      })),
      syncStatuses,
      platforms,
    },
  });
}
